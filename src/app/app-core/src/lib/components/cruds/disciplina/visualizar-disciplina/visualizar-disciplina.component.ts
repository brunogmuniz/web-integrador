import { Component, OnInit } from '@angular/core';
import { DisciplinaService, DisciplinaDTO, MetadadosPaginacao, RespostaPaginada } from "app-core";
import Swal from "sweetalert2";
import { TableSort } from '../../../../utils/table-sort';

@Component({
  selector: 'app-visualizar-disciplina',
  templateUrl: './visualizar-disciplina.component.html',
  styleUrls: ['./visualizar-disciplina.component.css']
})
export class VisualizarDisciplinaComponent implements OnInit {
  disciplinas: DisciplinaDTO[] = [];
  busca = '';
  ordenacao = new TableSort<'nome' | 'subarea' | 'total' | 'tipo'>('nome', 'asc');

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
    this.disciplinaService.findAll(this.meta.paginaAtual, this.meta.tamanho, this.busca, this.ordenacao.coluna, this.ordenacao.direcao).subscribe({
      next: (res: RespostaPaginada<DisciplinaDTO>) => {
        this.disciplinas = res.conteudo || [];
        this.meta = res.meta;
      },
      error: (err: Error) => {
        console.error('Falha ao carregar a página de disciplinas:', err);
        void Swal.fire('Erro', 'Não foi possível carregar os registros. Tente novamente mais tarde.', 'error');
      }
    });
  }

  onMudancaPagina(evento: { pagina: number; tamanho: number }): void {
    this.meta.paginaAtual = evento.pagina;
    this.meta.tamanho = evento.tamanho;
    this.carregarDisciplinas();
  }

  aoBuscar(termo: string): void {
    this.busca = termo;
    this.meta.paginaAtual = 0;
    this.carregarDisciplinas();
  }

  ordenarPor(coluna: 'nome' | 'subarea' | 'total' | 'tipo'): void {
    this.ordenacao.ordenarPor(coluna, () => {
      this.meta.paginaAtual = 0;
      this.carregarDisciplinas();
    });
  }

  iconeOrdenacao(coluna: 'nome' | 'subarea' | 'total' | 'tipo'): string {
    return this.ordenacao.iconeOrdenacao(coluna);
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
      error: (err: any) => {
        console.error('Erro ao excluir disciplina:', err);
        void Swal.fire('Erro', this.obterMensagemErroExclusao(err), 'error');
      }
    });
  }

  private obterMensagemErroExclusao(err: any): string {
    if (err?.status === 409) {
      return err?.error?.message || err?.error?.detail || err?.error || 'Não é possível excluir esta disciplina porque ela possui vínculos.';
    }

    return 'Não foi possível excluir o registro.';
  }
}
