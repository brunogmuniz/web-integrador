import { Component, HostListener, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { ProjetosDTO } from 'app-core/lib/dto/Projetos.dto';
import {
  ProjetoService,
  ProjetoRecomendadoDTO
} from 'app-core/lib/services/projetos/projeto.service';

type Acao = 'like' | 'dislike';

@Component({
  selector: 'lib-recomendacoes-projetos',
  templateUrl: './recomendacoes-projetos.component.html',
  styleUrls: ['./recomendacoes-projetos.component.css']
})
export class RecomendacoesProjetosComponent implements OnInit {

  fila: ProjetoRecomendadoDTO[] = [];
  indice: number = 0;
  carregando: boolean = true;
  processando: boolean = false;
  saindo: Acao | null = null;
  ultimaAcao: { tipo: Acao; recomendado: ProjetoRecomendadoDTO } | null = null;

  private detalhes = new Map<number, ProjetosDTO>();

  get recomendado(): ProjetoRecomendadoDTO | null {
    return this.fila[this.indice] ?? null;
  }

  get projeto(): ProjetosDTO | null {
    const atual = this.recomendado;
    return atual ? this.detalhes.get(atual.id) ?? null : null;
  }

  get progresso(): number {
    return this.fila.length ? (this.indice / this.fila.length) * 100 : 0;
  }

  get afinidade(): number | null {
    const score = this.recomendado?.score;
    return score == null ? null : Math.round(score * 100);
  }

  get podeDesfazer(): boolean {
    return !!this.ultimaAcao
      && this.indice > 0
      && this.fila[this.indice - 1] === this.ultimaAcao.recomendado;
  }

  constructor(private projetoService: ProjetoService) {}

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const tag = (event.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (event.key === 'ArrowRight') this.curtir();
    if (event.key === 'ArrowLeft') this.descartar();
  }

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.projetoService.listarRecomendacoes().subscribe({
      next: (recomendados) => {
        console.log('RECOMENDAÇÕES RECEBIDAS:', recomendados);
        console.log('QUANTIDADE:', recomendados?.length);

        this.fila = recomendados ?? [];
        this.indice = 0;
        this.ultimaAcao = null;
        this.detalhes.clear();
        this.carregarDetalhe(0);
        this.carregarDetalhe(1);
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        void Swal.fire('Erro!', 'Não foi possível carregar as recomendações.', 'error');
      }
    });
  }

  curtir(): void {
    const recomendado = this.recomendado;
    if (!recomendado || this.processando) return;

    this.processando = true;
    this.projetoService.curtir(recomendado.id).subscribe({
      next: () => {
        this.ultimaAcao = { tipo: 'like', recomendado };
        this.avancar('like');
      },
      error: () => {
        this.processando = false;
        void Swal.fire('Erro!', 'Não foi possível registrar a curtida.', 'error');
      }
    });
  }

  descartar(): void {
    const recomendado = this.recomendado;
    if (!recomendado || this.processando) return;

    this.processando = true;
    this.projetoService.descartar(recomendado.id).subscribe({
      next: () => {
        this.ultimaAcao = { tipo: 'dislike', recomendado };
        this.avancar('dislike');
      },
      error: () => {
        this.processando = false;
        void Swal.fire('Erro!', 'Não foi possível registrar o descarte.', 'error');
      }
    });
  }

  desfazer(): void {
    const acao = this.ultimaAcao;
    if (!acao || !this.podeDesfazer || this.processando) return;

    this.processando = true;

    const requisicao = acao.tipo === 'like'
      ? this.projetoService.removerCurtida(acao.recomendado.id)
      : this.projetoService.removerDescarte(acao.recomendado.id);

    requisicao.subscribe({
      next: () => {
        this.indice--;
        this.ultimaAcao = null;
        this.processando = false;
      },
      error: () => {
        this.processando = false;
        void Swal.fire('Erro!', 'Não foi possível desfazer a ação.', 'error');
      }
    });
  }

  private avancar(acao: Acao): void {
    this.saindo = acao;
    setTimeout(() => {
      this.indice++;
      this.saindo = null;
      this.processando = false;
      this.carregarDetalhe(this.indice + 1);
    }, 250);
  }

  private carregarDetalhe(posicao: number): void {
    const recomendado = this.fila[posicao];
    if (!recomendado || this.detalhes.has(recomendado.id)) return;

    this.projetoService.buscarPorId(recomendado.id).subscribe({
      next: (detalhe) => this.detalhes.set(recomendado.id, detalhe),
      error: () => this.detalhes.set(recomendado.id, { ...recomendado } as unknown as ProjetosDTO)
    });
  }
}
