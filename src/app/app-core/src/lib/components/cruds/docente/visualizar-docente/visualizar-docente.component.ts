import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {DocenteDTO, DocenteService, MetadadosPaginacao, RespostaPaginada} from "app-core";

@Component({
  selector: 'app-visualizar-docente',
  templateUrl: './visualizar-docente.component.html',
})
export class VisualizarDocenteComponent implements OnInit {
  docentes: DocenteDTO[] = [];
  busca = '';

  meta: MetadadosPaginacao = {
    paginaAtual: 0,
    tamanho: 15,
    totalElementos: 0,
    totalPaginas: 0
  };

  constructor(private docenteService: DocenteService) {}

  ngOnInit(): void {
    this.carregarDocentes();
  }

  carregarDocentes(): void {
    this.docenteService.findAll(this.meta.paginaAtual, this.meta.tamanho, this.busca).subscribe({
      next: (res: RespostaPaginada<DocenteDTO>) => {
        this.docentes = res.conteudo;
        this.meta = res.meta;
      },
      error: (err: Error) => {
        console.error('Falha ao carregar a página de Docentes:', err);
        this.exibirErro('Não foi possível carregar a lista de Docentes.');
      }
    });
  }

  aoMudarPaginacao(evento: { pagina: number; tamanho: number }): void {
    this.meta.paginaAtual = evento.pagina;
    this.meta.tamanho = evento.tamanho;
    this.carregarDocentes();
  }

  aoBuscar(termo: string): void {
    this.busca = termo;
    this.meta.paginaAtual = 0;
    this.carregarDocentes();
  }

  onDelete(uuid: string | undefined): void {
    if (!uuid) {
      void Swal.fire('Erro', 'Identificador do docente inválido.', 'error');
      return;
    }

    void Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja realmente excluir este docente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-light-secondary me-3'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.docenteService.delete(uuid).subscribe({
          next: () => {
            void Swal.fire('Sucesso', 'Docente excluído com sucesso!', 'success');
            this.carregarDocentes();
          },
          error: (err) => this.handleDeleteError(err)
        });
      }
    });
  }

  private handleDeleteError(err: any): void {
    const isConflict = err.status === 500 || err.status === 409;
    void Swal.fire(
      isConflict ? 'Atenção' : 'Erro',
      isConflict ? 'Não é possível excluir este docente pois ele possui encargos ou vínculos ativos.' : 'Erro ao excluir o docente.',
      isConflict ? 'warning' : 'error'
    );
  }

  private exibirErro(msg: string): void {
    void Swal.fire('Erro!', msg, 'error');
  }
}
