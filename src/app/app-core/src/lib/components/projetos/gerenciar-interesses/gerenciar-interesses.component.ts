import { Component, OnInit, HostListener } from '@angular/core';
import Swal from 'sweetalert2';
import {
  ProjetoService,
  TopicoDTO
} from 'app-core/lib/services/projetos/projeto.service';

interface TopicoComPreferencia extends TopicoDTO {
  selecionado: boolean;
  selecionadoOriginal: boolean;
  peso: number;
  pesoOriginal: number;
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
  get temAlteracoesNaoSalvas(): boolean {
    return this.topicos.some(t =>
      t.selecionado !== t.selecionadoOriginal ||
      (t.selecionado && t.peso !== t.pesoOriginal)
    );
  }

  constructor(private projetoService: ProjetoService) {}

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload($event: BeforeUnloadEvent) {
    if (this.temAlteracoesNaoSalvas) {
      $event.returnValue = true;
    }
  }

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
              const peso = pref?.peso ?? 1;
              return {
                ...t,
                selecionado,
                selecionadoOriginal: selecionado,
                peso,
                pesoOriginal: peso
              };
            });
            this.carregando = false;
          },
          error: () => {
            this.topicos = topicos.map(t => ({
              ...t,
              selecionado: false,
              selecionadoOriginal: false,
              peso: 1,
              pesoOriginal: 1
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

  incrementar(topico: TopicoComPreferencia): void {
    if (topico.peso < 5) topico.peso++;
  }

  pesoLabel(peso: number): string {
    const labels: Record<number, string> = { 1: "Baixa", 2: "Média-baixa", 3: "Média", 4: "Média-alta", 5: "Alta" };
    return labels[peso] ?? "";
  }

  forcarBuscaVisual(): void {
    this.termoBusca = this.termoBusca.trim();
  }

  descartarAlteracoes(): void {
    this.topicos.forEach(t => {
      t.selecionado = t.selecionadoOriginal;
      t.peso = t.pesoOriginal;
    });
  }

  async podeDesativar(): Promise<boolean> {
    if (!this.temAlteracoesNaoSalvas) return true;

    const resultado = await Swal.fire({
      title: 'Descartar mudanças?',
      text: 'Você possui preferências que ainda não foram salvas. Se sair agora, elas serão perdidas.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, descartar',
      cancelButtonText: 'Continuar editando'
    });

    if (resultado.isConfirmed) {
      this.descartarAlteracoes();
      return true;
    }
    return false;
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
      this.topicos.forEach(t => {
        t.selecionadoOriginal = t.selecionado;
        t.pesoOriginal = t.peso;
      });
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
