import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProjetoService, ProjetoRecomendadoDTO } from 'app-core/lib/services/projetos/projeto.service';

@Component({
  selector: 'lib-projetos-recomendados',
  templateUrl: './projetos-recomendados.component.html',
  styleUrls: ['./projetos-recomendados.component.css']
})
export class ProjetosRecomendadosComponent implements OnInit {

  projetos: ProjetoRecomendadoDTO[] = [];
  carregando: boolean = true;

  constructor(
    private projetoService: ProjetoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projetoService.listarRecomendacoes().subscribe({
      next: (res) => {
        this.projetos = res;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        void Swal.fire('Erro!', 'Não foi possível carregar as recomendações.', 'error');
      }
    });
  }

  visualizarProjeto(id: number): void {
    this.router.navigate(['/visualizar-detalhes', id]);
  }
}
