import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MetadadosPaginacao } from 'app-core';

@Component({
  selector: 'app-paginador',
  templateUrl: './paginador.component.html',
  styleUrls: ['./paginador.component.scss']
})
export class PaginadorComponent {
  @Input() meta: MetadadosPaginacao = { totalElementos: 0, tamanho: 15, paginaAtual: 0, totalPaginas: 0 };
  @Input() seletorQuantidade: boolean = true;
  @Input() maxVisiblePages: number = 5;
  @Input() opcoesTamanho: number[] = [15, 30, 50, 100, 200, 500];

  @Output() mudancaPagina = new EventEmitter<{ pagina: number; tamanho: number }>();

  mudaMax(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const novoTamanho = Number(select.value);
    this.mudancaPagina.emit({ pagina: 0, tamanho: novoTamanho });
  }

  changePage(page: number): void {
    if (page < 0 || page >= this.meta.totalPaginas || page === this.meta.paginaAtual) {
      return;
    }
    this.mudancaPagina.emit({ pagina: page, tamanho: this.meta.tamanho });
  }

  goToFirst(): void { this.changePage(0); }
  goToPrevious(): void { this.changePage(this.meta.paginaAtual - 1); }
  goToNext(): void { this.changePage(this.meta.paginaAtual + 1); }
  goToLast(): void { this.changePage(this.meta.totalPaginas - 1); }

  get visiblePages(): number[] {
    if (!this.meta.totalPaginas) return [];

    const half = Math.floor(this.maxVisiblePages / 2);
    let start = this.meta.paginaAtual - half;
    let end = this.meta.paginaAtual + half;

    if (start < 0) {
      start = 0;
      end = Math.min(this.maxVisiblePages - 1, this.meta.totalPaginas - 1);
    }

    if (end >= this.meta.totalPaginas) {
      end = this.meta.totalPaginas - 1;
      start = Math.max(0, end - this.maxVisiblePages + 1);
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}
