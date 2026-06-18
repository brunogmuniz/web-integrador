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
