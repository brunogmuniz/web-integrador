import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {
  ProjetoService,
  TopicoDTO
} from 'app-core/lib/services/projetos/projeto.service';

interface TopicoComPreferencia extends TopicoDTO {
  selecionado: boolean;
  selecionadoOriginal: boolean;
  peso: number;
}

@Component({
  selector: 'lib-gerenciar-interesses',
  templateUrl: './gerenciar-interesses.component.html',
  styleUrls: ['./gerenciar-interesses.component.css']
})
export class GerenciarInteressesComponent implements OnInit {

  topicos: TopicoComPreferencia[] = [];
  carregando: boolean = true;
  salvando: boolean = false;
  termoBusca: string = '';
  filtro: 'todos' | 'selecionados' | 'nao-selecionados' = 'todos';

  get topicosFiltrados(): TopicoComPreferencia[] {
    return this.topicos.filter(t => {
      const matchBusca = t.nome.toLowerCase().includes(this.termoBusca.toLowerCase());
      const matchFiltro =
        this.filtro === 'todos' ||
        (this.filtro === 'selecionados' && t.selecionado) ||
        (this.filtro === 'nao-selecionados' && !t.selecionado);
      return matchBusca && matchFiltro;
    });
  }

  get totalSelecionados(): number {
    return this.topicos.filter(t => t.selecionado).length;
  }

  constructor(private projetoService: ProjetoService) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;

    this.projetoService.listarTopicos().subscribe({
      next: (topicos) => {
        this.projetoService.listarPreferencias().subscribe({
          next: (preferencias) => {
            this.topicos = topicos.map(t => {
              const pref = preferencias.find(p => p.topico.id === t.id);
              const selecionado = !!pref;
              return {
                ...t,
                selecionado,
                selecionadoOriginal: selecionado,
                peso: pref?.peso ?? 1
              };
            });
            this.carregando = false;
          },
          error: () => {
            this.topicos = topicos.map(t => ({
              ...t,
              selecionado: false,
              selecionadoOriginal: false,
              peso: 1
            }));
            this.carregando = false;
          }
        });
      },
      error: () => {
        this.carregando = false;
        void Swal.fire('Erro!', 'Não foi possível carregar os tópicos.', 'error');
      }
    });
  }

  onToggle(topico: TopicoComPreferencia): void {
    if (!topico.selecionado) {
      topico.peso = 1;
    }
  }

  decrementar(topico: TopicoComPreferencia): void {
    if (topico.peso > 1) topico.peso--;
  }

  pesoLabel(peso: number): string {
    const labels: Record<number, string> = { 1: "Baixa", 2: "Média-baixa", 3: "Média", 4: "Média-alta", 5: "Alta" };
    return labels[peso] ?? "";
  }

  incrementar(topico: TopicoComPreferencia): void {
    if (topico.peso < 5) topico.peso++;
  }

  salvar(): void {
    this.salvando = true;

    const paraUpsert = this.topicos.filter(t => t.selecionado);
    const paraRemover = this.topicos.filter(t => !t.selecionado && t.selecionadoOriginal);

    const operacoes: Promise<any>[] = [
      ...paraUpsert.map(t =>
        this.projetoService.salvarPreferencia({ topicoId: t.id, peso: t.peso }).toPromise()
      ),
      ...paraRemover.map(t =>
        this.projetoService.removerPreferencia(t.id).toPromise()
      )
    ];

    Promise.allSettled(operacoes).then(() => {
      this.topicos.forEach(t => t.selecionadoOriginal = t.selecionado);
      this.salvando = false;
      void Swal.fire({
        title: 'Salvo!',
        text: 'Seus interesses foram atualizados com sucesso.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false
      });
    });
  }
}
