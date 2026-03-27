import { Component, OnInit } from '@angular/core';
import { AreaConhecimentoDTO, MetadadosPaginacao, RespostaPaginada } from "app-core";
import { AreaConhecimentoService } from "app-core";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-visualizar-area-conhecimento',
  templateUrl: './visualizar-area-conhecimento.component.html',
  styleUrls: ['./visualizar-area-conhecimento.component.scss']
})
export class VisualizarAreaConhecimentoComponent implements OnInit {
  areas: AreaConhecimentoDTO[] = [];

  meta: MetadadosPaginacao = {
    paginaAtual: 0,
    tamanho: 15,
    totalElementos: 0,
    totalPaginas: 0
  };

  constructor(private areaService: AreaConhecimentoService) {}

  ngOnInit(): void {
    this.carregarAreas();
  }

  carregarAreas(): void {
    this.areaService.findAll(this.meta.paginaAtual, this.meta.tamanho).subscribe({
      next: (res: RespostaPaginada<AreaConhecimentoDTO>) => {
        this.areas = res.conteudo;
        this.meta = res.meta;
      },
      error: (err: Error) => {
        console.error('Falha ao carregar a página de áreas de conhecimento:', err);
        this.exibirErro('Não foi possível carregar a lista de áreas.');
      }
    });
  }

  aoMudarPaginacao(evento: { pagina: number; tamanho: number }): void {
    this.meta.paginaAtual = evento.pagina;
    this.meta.tamanho = evento.tamanho;
    this.carregarAreas();
  }

  onDelete(uuid: string | undefined): void {
    if (!uuid) return;

    Swal.fire({
      title: 'Tem certeza?',
      text: 'Essa área de conhecimento será excluída permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.areaService.delete(uuid).subscribe({
          next: () => {
            this.exibirSucesso('Área excluída com sucesso!');
            this.carregarAreas();
          },
          error: (err) => {
            console.error(err);
            this.exibirErro('Não foi possível excluir a área. Verifique se existem dependências vinculadas.');
          }
        });
      }
    });
  }

  private exibirSucesso(msg: string): void {
    void Swal.fire('Sucesso!', msg, 'success');
  }

  private exibirErro(msg: string): void {
    void Swal.fire('Erro!', msg, 'error');
  }
}
