import { Component, OnInit } from '@angular/core';
import { DisciplinaService, DisciplinaDTO, MetadadosPaginacao, RespostaPaginada } from "app-core";
import Swal from "sweetalert2";

@Component({
  selector: 'app-visualizar-disciplina',
  templateUrl: './visualizar-disciplina.component.html',
  styleUrls: ['./visualizar-disciplina.component.css']
})
export class VisualizarDisciplinaComponent implements OnInit {
  disciplinas: DisciplinaDTO[] = [];

  meta: MetadadosPaginacao = {
    paginaAtual: 0,
    tamanho: 15,
    totalElementos: 0,
    totalPaginas: 0
  };

  constructor(private disciplinaService: DisciplinaService) {}

  ngOnInit(): void {
    this.carregarDisciplinas();
  }

  carregarDisciplinas(): void {
    this.disciplinaService.findAll(this.meta.paginaAtual, this.meta.tamanho).subscribe({
      next: (res: RespostaPaginada<DisciplinaDTO>) => {
        this.disciplinas = res.conteudo;
        this.meta = res.meta;
      },
      error: (err: Error) => {
        console.error('Falha ao carregar a página de disciplinas:', err);
        void Swal.fire('Erro', 'Não foi possível carregar os registos. Tente novamente mais tarde.', 'error');
      }
    });
  }

  onMudancaPagina(evento: { pagina: number; tamanho: number }): void {
    this.meta.paginaAtual = evento.pagina;
    this.meta.tamanho = evento.tamanho;
    this.carregarDisciplinas();
  }

  confirmarExclusao(uuid: string | null | undefined): void {
    if (!uuid) {
      void Swal.fire('Erro', 'Identificador inválido.', 'error');
      return;
    }

    Swal.fire({
      title: 'Tem certeza?',
      text: "Esta ação não poderá ser revertida!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.excluir(uuid);
      }
    });
  }

  private excluir(uuid: string): void {
    this.disciplinaService.delete(uuid).subscribe({
      next: () => {
        void Swal.fire('Excluído!', 'A disciplina foi removida.', 'success');
        this.carregarDisciplinas();
      },
      error: (_err: any) => {
        console.error('Erro ao excluir disciplina:', _err);
        void Swal.fire('Erro', 'Não foi possível excluir o registro.', 'error');
      }
    });
  }
}
