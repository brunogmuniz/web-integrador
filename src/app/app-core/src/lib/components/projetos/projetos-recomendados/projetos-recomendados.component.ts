import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import {
  ProjetoService,
  ProjetoRecomendadoDTO
} from 'app-core/lib/services/projetos/projeto.service';

@Component({
  selector: 'lib-projetos-recomendados',
  templateUrl: './projetos-recomendados.component.html',
  styleUrls: ['./projetos-recomendados.component.css']
})
export class ProjetosRecomendadosComponent implements OnInit {

  projetos: ProjetoRecomendadoDTO[] = [];
  carregando: boolean = true;
  removendoId: number | null = null;
  saindoId: number | null = null;

  constructor(
    private projetoService: ProjetoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarProjetosCurtidos();
  }

  carregarProjetosCurtidos(): void {
    this.carregando = true;

    this.projetoService.listarProjetosCurtidos().subscribe({
      next: (res) => {
        this.projetos = res ?? [];
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        void Swal.fire(
          'Erro!',
          'Não foi possível carregar os projetos curtidos.',
          'error'
        );
      }
    });
  }

  visualizarProjeto(id: number): void {
    this.router.navigate(['/visualizar-detalhes', id]);
  }

  async removerCurtida(projeto: ProjetoRecomendadoDTO): Promise<void> {
    if (this.removendoId !== null) {
      return;
    }

    const resultado = await Swal.fire({
      title: 'Remover dos curtidos?',
      text: `"${projeto.titulo}" será removido da sua lista de projetos curtidos.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, remover',
      cancelButtonText: 'Cancelar'
    });

    if (!resultado.isConfirmed) {
      return;
    }

    this.removendoId = projeto.id;

    this.projetoService.removerCurtida(projeto.id).subscribe({
      next: () => {
        this.saindoId = projeto.id;
        const posicao = this.projetos.findIndex(p => p.id === projeto.id);

        setTimeout(() => {
          this.projetos = this.projetos.filter(p => p.id !== projeto.id);
          this.saindoId = null;
          this.removendoId = null;
          this.avisarRemocao(projeto, posicao);
        }, 350);
      },
      error: () => {
        this.removendoId = null;
        void Swal.fire(
          'Erro!',
          'Não foi possível remover a curtida.',
          'error'
        );
      }
    });
  }

  private avisarRemocao(projeto: ProjetoRecomendadoDTO, posicao: number): void {
    void Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'success',
      title: 'Curtida removida',
      showConfirmButton: true,
      confirmButtonText: 'Desfazer',
      timer: 5000,
      timerProgressBar: true
    }).then(resultado => {
      if (resultado.isConfirmed) {
        this.restaurarCurtida(projeto, posicao);
      }
    });
  }

  private restaurarCurtida(projeto: ProjetoRecomendadoDTO, posicao: number): void {
    this.projetoService.curtir(projeto.id).subscribe({
      next: () => {
        const copia = [...this.projetos];
        copia.splice(Math.min(posicao, copia.length), 0, projeto);
        this.projetos = copia;
      },
      error: () => {
        void Swal.fire(
          'Erro!',
          'Não foi possível restaurar a curtida.',
          'error'
        );
      }
    });
  }
}
