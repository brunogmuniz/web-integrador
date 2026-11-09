import { Component, OnInit } from '@angular/core';
import { SubareaConhecimentoService, MetadadosPaginacao, SubareaConhecimentoDTO } from "app-core";
import Swal from "sweetalert2";
import { TableSort } from '../../../../utils/table-sort';

@Component({
  selector: 'app-visualizar-subarea-conhecimento',
  templateUrl: './visualizar-subarea-conhecimento.component.html',
  styleUrls: ['./visualizar-subarea-conhecimento.component.scss']
})
export class VisualizarSubareaConhecimentoComponent implements OnInit {
  subAreas: SubareaConhecimentoDTO[] = [];
  busca = '';
  ordenacao = new TableSort<'nome' | 'sigla' | 'area'>('nome', 'asc');

  meta: MetadadosPaginacao = {
    paginaAtual: 0,
    tamanho: 15,
    totalElementos: 0,
    totalPaginas: 0
  };

  constructor(private subareaService: SubareaConhecimentoService) {}

  ngOnInit(): void {
    this.carregarSubAreas();
  }

  carregarSubAreas(): void {
    this.subareaService.findAll(this.meta.paginaAtual, this.meta.tamanho, this.busca, this.ordenacao.coluna, this.ordenacao.direcao).subscribe({
      next: (res) => {
        this.subAreas = res.conteudo || [];
        this.meta = res.meta;
      },
      error: (err) => {
        console.error(err);
        this.notificarErro('Não foi possível carregar a lista de subáreas.');
      }
    });
  }

  aoMudarPaginacao(evento: { pagina: number; tamanho: number }): void {
    this.meta.paginaAtual = evento.pagina;
    this.meta.tamanho = evento.tamanho;
    this.carregarSubAreas();
  }

  aoBuscar(termo: string): void {
    this.busca = termo;
    this.meta.paginaAtual = 0;
    this.carregarSubAreas();
  }

  onDelete(uuid: string): void {
    void Swal.fire({
      title: 'Tem certeza?',
      text: "Deseja excluir esta subárea? Esta ação pode afetar disciplinas vinculadas.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-light'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.executarExclusao(uuid);
      }
    });
  }

  private executarExclusao(uuid: string): void {
    this.subareaService.delete(uuid).subscribe({
      next: () => {
        void Swal.fire('Sucesso', 'Subárea removida com sucesso.', 'success');
        this.carregarSubAreas();
      },
      error: (err) => {
        const msg = err.status === 409 ? 'Existem vínculos ativos para esta subárea.' : 'Erro ao tentar excluir.';
        this.notificarErro(msg);
      }
    });
  }

  trackBySubUuid(_index: number, item: SubareaConhecimentoDTO): string | undefined {
    return item.uuid;
  }

  ordenarPor(coluna: 'nome' | 'sigla' | 'area'): void {
    this.ordenacao.ordenarPor(coluna, () => {
      this.meta.paginaAtual = 0;
      this.carregarSubAreas();
    });
  }

  iconeOrdenacao(coluna: 'nome' | 'sigla' | 'area'): string {
    return this.ordenacao.iconeOrdenacao(coluna);
  }

  private notificarErro(msg: string): void {
    void Swal.fire('Erro', msg, 'error');
  }
}
