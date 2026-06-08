import { Component, OnInit } from '@angular/core';
import { DocenteService } from "app-core/lib/services/docente-service";
import { DocenteDetalheDTO } from "app-core/lib/dto/DocenteDetalhe.dto";
import { RespostaPaginada } from "app-core/lib/dto/paginacao/resposta-paginada.dto";
import Swal from "sweetalert2";
import {DocenteSubAreaPercentualDTO, OfertaDTO, OfertaService} from "app-core";

interface MetadadosPaginacao {
  paginaAtual: number;
  tamanho: number;
  totalElementos: number;
  totalPaginas: number;
}

@Component({
  selector: 'app-visualizar-docente-encargos',
  templateUrl: './visualizar-docente-encargos.component.html',
  styleUrls: ['./visualizar-docente-encargos.component.scss']
})
export class VisualizarDocenteEncargosComponent implements OnInit {

  public listaDocentesDetalhados: DocenteDetalheDTO[] = [];
  public ofertas: OfertaDTO[] = [];
  public ofertaSelecionadaUuid?: string;
  public busca = '';
  public loading: boolean = false;
  public exibirModal: boolean = false;
  public docenteSelecionado?: DocenteDetalheDTO;

  public meta: MetadadosPaginacao = {
    paginaAtual: 0,
    tamanho: 15,
    totalElementos: 0,
    totalPaginas: 0
  };

  constructor(
    private docenteService: DocenteService,
    private ofertaService: OfertaService
  ) {}

  ngOnInit(): void {
    this.carregarOfertas();
  }

  public aoMudarPaginacao(evento: { pagina: number; tamanho: number }): void {
    this.meta.paginaAtual = evento.pagina;
    this.meta.tamanho = evento.tamanho;
    this.carregarDados();
  }

  public aoBuscar(termo: string): void {
    this.busca = termo;
    this.meta.paginaAtual = 0;
    this.carregarDados();
  }

  public aoSelecionarOferta(): void {
    this.meta.paginaAtual = 0;
    this.carregarDados();
  }

  public trackByDocenteUuid(_index: number, item: DocenteDetalheDTO): string {
    return item.uuid;
  }

  public getNomesAreas(subAreas: DocenteSubAreaPercentualDTO[] | undefined): string[] {
    if (!subAreas || !Array.isArray(subAreas) || subAreas.length === 0) {
      return [];
    }
    return Array.from(new Set(subAreas.map((sub: any) =>
      sub.nomeSubarea || sub.nomeSubArea || sub.nomeArea || sub.nome || 'Área sem nome'
    )));
  }

  public abrirModal(docente: DocenteDetalheDTO): void {
    this.docenteSelecionado = docente;
    this.exibirModal = true;
  }

  public get ofertaSelecionadaLabel(): string {
    const oferta = this.ofertas.find(item => item.uuid === this.ofertaSelecionadaUuid);
    return oferta ? `${oferta.ano}/${oferta.semestre}` : '';
  }

  public fecharModal(): void {
    this.exibirModal = false;
    this.docenteSelecionado = undefined;
  }

  public carregarDados(): void {
    if (!this.ofertaSelecionadaUuid) {
      this.listaDocentesDetalhados = [];
      return;
    }

    this.loading = true;
    this.docenteService.listarTodosDetalhadoPorOferta(this.ofertaSelecionadaUuid, this.meta.paginaAtual, this.meta.tamanho, this.busca).subscribe({
      next: (res: RespostaPaginada<DocenteDetalheDTO>) => {
        this.listaDocentesDetalhados = res.conteudo || [];
        this.meta = res.meta;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        void Swal.fire('Erro', 'Falha ao carregar a lista de docentes e seus encargos.', 'error');
      }
    });
  }

  public carregarOfertas(): void {
    this.ofertaService.findAll(0, 500).subscribe({
      next: (res) => {
        this.ofertas = (res.conteudo || []).filter(oferta => oferta.ativo);
        const ultimaOferta = [...this.ofertas].sort((a, b) => `${b.ano}${b.semestre}`.localeCompare(`${a.ano}${a.semestre}`))[0];
        this.ofertaSelecionadaUuid = ultimaOferta?.uuid;
        this.carregarDados();
      },
      error: () => void Swal.fire('Erro', 'Falha ao carregar as ofertas.', 'error')
    });
  }
}
