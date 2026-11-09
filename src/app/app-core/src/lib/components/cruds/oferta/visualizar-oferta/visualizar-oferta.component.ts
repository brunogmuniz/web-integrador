import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { MetadadosPaginacao, OfertaDTO, OfertaService, RespostaPaginada } from 'app-core';
import { TableSort } from '../../../../utils/table-sort';

@Component({
  selector: 'app-visualizar-oferta',
  templateUrl: './visualizar-oferta.component.html',
  styleUrls: ['../oferta.component.scss']
})
export class VisualizarOfertaComponent implements OnInit {
  ofertas: OfertaDTO[] = [];
  loading = false;
  importandoOferta = false;
  modalImportacaoAberto = false;
  ofertaOrigemImportacaoUuid = '';
  ofertaOrigemImportacao?: OfertaDTO;
  ofertaDestinoImportacao?: OfertaDTO;
  limparOfertaImportacaoToken = 0;
  busca = '';
  ordenacao = new TableSort<'anoSemestre'>('anoSemestre', 'asc');
  meta: MetadadosPaginacao = {
    paginaAtual: 0,
    tamanho: 15,
    totalElementos: 0,
    totalPaginas: 0
  };

  constructor(private ofertaService: OfertaService) {}

  ngOnInit(): void {
    this.carregarOfertas();
  }

  carregarOfertas(): void {
    this.loading = true;
    this.ofertaService.findAll(this.meta.paginaAtual, this.meta.tamanho, this.busca, this.ordenacao.coluna, this.ordenacao.direcao).subscribe({
      next: (res: RespostaPaginada<OfertaDTO>) => {
        this.ofertas = res.conteudo || [];
        this.meta = res.meta;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        void Swal.fire('Erro', 'Não foi possível carregar as ofertas.', 'error');
      }
    });
  }

  aoMudarPaginacao(evento: { pagina: number; tamanho: number }): void {
    this.meta.paginaAtual = evento.pagina;
    this.meta.tamanho = evento.tamanho;
    this.carregarOfertas();
  }

  aoBuscar(termo: string): void {
    this.busca = termo;
    this.meta.paginaAtual = 0;
    this.carregarOfertas();
  }

  ordenarPor(coluna: 'anoSemestre'): void {
    this.ordenacao.ordenarPor(coluna, () => {
      this.meta.paginaAtual = 0;
      this.carregarOfertas();
    });
  }

  iconeOrdenacao(coluna: 'anoSemestre'): string {
    return this.ordenacao.iconeOrdenacao(coluna);
  }

  abrirModalImportacao(ofertaDestino: OfertaDTO): void {
    if (!ofertaDestino.uuid) {
      return;
    }

    this.modalImportacaoAberto = true;
    this.ofertaOrigemImportacaoUuid = '';
    this.ofertaOrigemImportacao = undefined;
    this.ofertaDestinoImportacao = ofertaDestino;
    this.limparOfertaImportacaoToken++;
  }

  fecharModalImportacao(): void {
    if (this.importandoOferta) {
      return;
    }

    this.modalImportacaoAberto = false;
  }

  selecionarOfertaOrigem(oferta: OfertaDTO | null): void {
    if (!oferta?.uuid) {
      this.ofertaOrigemImportacaoUuid = '';
      this.ofertaOrigemImportacao = undefined;
      return;
    }

    this.ofertaOrigemImportacaoUuid = oferta.uuid;
    this.ofertaOrigemImportacao = oferta;
  }

  importarOferta(): void {
    if (!this.ofertaDestinoImportacao?.uuid || !this.ofertaOrigemImportacaoUuid) {
      void Swal.fire('Aviso', 'Selecione a oferta de origem.', 'warning');
      return;
    }

    if (this.ofertaOrigemImportacaoUuid === this.ofertaDestinoImportacao.uuid) {
      void Swal.fire('Aviso', 'Selecione ofertas diferentes para origem e destino.', 'warning');
      return;
    }

    void Swal.fire({
      title: 'Importar oferta?',
      text: `As disciplinas atuais da oferta ${this.formatarOferta(this.ofertaDestinoImportacao)} serão substituídas por todas as disciplinas da oferta ${this.formatarOferta(this.ofertaOrigemImportacao)}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, importar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (!result.isConfirmed) return;
      this.executarImportacaoOferta();
    });
  }

  private executarImportacaoOferta(): void {
    this.importandoOferta = true;
    this.ofertaService.importarDisciplinasOfertaCompleta(
      this.ofertaDestinoImportacao?.uuid || '',
      this.ofertaOrigemImportacaoUuid
    ).subscribe({
      next: () => {
        this.importandoOferta = false;
        this.modalImportacaoAberto = false;
        this.ofertaOrigemImportacaoUuid = '';
        this.ofertaOrigemImportacao = undefined;
        this.ofertaDestinoImportacao = undefined;
        this.limparOfertaImportacaoToken++;
        void Swal.fire('Sucesso', 'Oferta importada com sucesso.', 'success');
        this.carregarOfertas();
      },
      error: err => {
        this.importandoOferta = false;
        const message = err?.error?.message || 'Não foi possível importar a oferta selecionada.';
        void Swal.fire('Erro', message, 'error');
      }
    });
  }

  formatarOferta(oferta?: OfertaDTO): string {
    if (!oferta) {
      return '';
    }
    return `${oferta.ano}/${oferta.semestre}`;
  }

  alterarDisponibilidade(oferta: OfertaDTO): void {
    if (!oferta.uuid) return;

    const payload = { ...oferta, ativo: !oferta.ativo };
    this.ofertaService.update(oferta.uuid, payload).subscribe({
      next: () => this.carregarOfertas(),
      error: (err) => {
        const message = err?.error?.message || 'Não foi possível alterar a disponibilidade.';
        void Swal.fire('Erro', message, 'error');
      }
    });
  }

  excluir(uuid?: string): void {
    if (!uuid) return;

    void Swal.fire({
      title: 'Tem certeza?',
      text: 'Esta oferta será excluída permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (!result.isConfirmed) return;
      this.ofertaService.delete(uuid).subscribe({
        next: () => this.carregarOfertas(),
        error: () => void Swal.fire('Erro', 'Não foi possível excluir a oferta.', 'error')
      });
    });
  }
}
