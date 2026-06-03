import {Component, OnInit} from '@angular/core';
import {EstruturaCurricularService, RespostaPaginada} from "app-core";
import Swal from 'sweetalert2';
import { EstruturaCurricularDTO } from 'app-core';

interface MetadadosPaginacao {
  paginaAtual: number;
  tamanho: number;
  totalElementos: number;
  totalPaginas: number;
}

@Component({
  selector: 'app-visualizar-estrutura-curricular',
  templateUrl: './visualizar-estrutura-curricular.component.html',
  styleUrls: ['../estrutura-curricular.component.scss']
})
export class VisualizarEstruturaCurricularComponent implements OnInit {

  listaEstruturas: EstruturaCurricularDTO[] = [];
  busca = '';
  public loading: boolean = false;
  public meta: MetadadosPaginacao = {
    paginaAtual: 0,
    tamanho: 15,
    totalElementos: 0,
    totalPaginas: 0
  };

  constructor(
    private service: EstruturaCurricularService,
  ) {}

  ngOnInit(): void {
    this.carregarEstruturas();
  }

  public carregarEstruturas(): void {
    this.loading = true;
    this.service.findAll(this.meta.paginaAtual, this.meta.tamanho, this.busca).subscribe({
      next: (res: RespostaPaginada<EstruturaCurricularDTO>) => {
        this.listaEstruturas = res.conteudo || [];
        this.meta = res.meta;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        void Swal.fire('Erro', 'Não foi possível carregar as Estruturas Curriculares.', 'error');
      }
    });
  }
  public aoMudarPaginacao(evento: { pagina: number; tamanho: number }): void {
    this.meta.paginaAtual = evento.pagina;
    this.meta.tamanho = evento.tamanho;
    this.carregarEstruturas();
  }

  public aoBuscar(termo: string): void {
    this.busca = termo;
    this.meta.paginaAtual = 0;
    this.carregarEstruturas();
  }

  public onDelete(uuid: string, nome: string): void {
    void Swal.fire({
      title: 'Tem certeza?',
      text: `Deseja realmente excluir a estrutura "${nome}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-primary me-3'
      }
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.service.delete(uuid).subscribe({
          next: () => {
            this.loading = false;
            void Swal.fire('Sucesso', 'Estrutura Curricular excluída com sucesso!', 'success');
            this.carregarEstruturas();
          },
          error: (_err) => {
            this.loading = false;
            void Swal.fire('Erro', 'Não foi possível excluir a Estrutura Curricular. Verifique se há vínculos ativos.', 'error');
          }
        });
      }
    });
  }

  trackByEstruturaUuid(_index: number, item: EstruturaCurricularDTO) {
    return item.uuid;
  }
}
