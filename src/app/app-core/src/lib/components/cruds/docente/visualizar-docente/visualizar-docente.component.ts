import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {DocenteDTO, DocenteService, MetadadosPaginacao, RespostaPaginada} from "app-core";
import { switchMap } from 'rxjs/operators';
import { TableSort } from '../../../../utils/table-sort';

@Component({
  selector: 'app-visualizar-docente',
  templateUrl: './visualizar-docente.component.html',
  styleUrls: ['./visualizar-docente.component.scss']
})
export class VisualizarDocenteComponent implements OnInit {
  docentes: DocenteDTO[] = [];
  busca = '';
  ordenacao = new TableSort<'nome'>('nome', 'asc');

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
    this.docenteService.findAll(this.meta.paginaAtual, this.meta.tamanho, this.busca, this.ordenacao.coluna, this.ordenacao.direcao).subscribe({
      next: (res: RespostaPaginada<DocenteDTO>) => {
        this.docentes = res.conteudo || [];
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

  ordenarPor(coluna: 'nome'): void {
    this.ordenacao.ordenarPor(coluna, () => {
      this.meta.paginaAtual = 0;
      this.carregarDocentes();
    });
  }

  iconeOrdenacao(coluna: 'nome'): string {
    return this.ordenacao.iconeOrdenacao(coluna);
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

  confirmarStatus(docente: DocenteDTO, ativar: boolean): void {
    if (!docente.uuid) {
      void Swal.fire('Erro', 'Identificador do docente inválido.', 'error');
      return;
    }

    const acao = ativar ? 'ativar' : 'inativar';

    void Swal.fire({
      title: `Deseja realmente ${acao}?`,
      text: `O docente "${docente.nome}" será marcado como ${ativar ? 'ativo' : 'inativo'}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: ativar ? '#28a745' : '#f0ad4e',
      cancelButtonColor: '#3085d6',
      confirmButtonText: ativar ? 'Sim, ativar' : 'Sim, inativar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.docenteService.alterarStatus(docente.uuid, ativar).pipe(
        switchMap(() => this.docenteService.buscarPorId(docente.uuid!))
      ).subscribe({
        next: (docenteAtualizado) => {
          if (docenteAtualizado.ativo !== ativar) {
            void Swal.fire(
              'Atenção',
              `A API respondeu com sucesso, mas o docente ainda não retornou como ${ativar ? 'ativo' : 'inativo'}. Verifique se o backend foi reiniciado e se a migration da coluna ativo foi aplicada.`,
              'warning'
            );
            this.carregarDocentes();
            return;
          }

          void Swal.fire('Sucesso', `Docente ${ativar ? 'ativado' : 'inativado'} com sucesso!`, 'success');
          this.carregarDocentes();
        },
        error: (err) => {
          console.error(`Erro ao ${acao} docente:`, err);
          const mensagem = err?.error?.message || err?.message || `Não foi possível ${acao} o docente.`;
          void Swal.fire('Erro', mensagem, 'error');
        }
      });
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
