import { Component, OnInit } from '@angular/core';
import { MetadadosPaginacao, RespostaPaginada } from "app-core/lib/dto/paginacao/resposta-paginada.dto";
import Swal from "sweetalert2";
import { ProjetosDTO } from "app-core/lib/dto/Projetos.dto";
import { ProjetoService } from "app-core/lib/services/projetos/projeto.service";
import { Router } from '@angular/router';
@Component({
  selector: 'lib-visualizar-projetos',
  templateUrl: './visualizar-projetos.component.html',
  styleUrls: ['./visualizar-projetos.component.css']
})
export class VisualizarProjetosComponent implements OnInit {

  projetos: ProjetosDTO[] = [];
  termoBusca: string = '';

  meta: MetadadosPaginacao = {
    paginaAtual: 0,
    tamanho: 15,
    totalElementos: 0,
    totalPaginas: 0
  };

  constructor(private projetosService: ProjetoService, private router: Router) { }

  ngOnInit(): void {
    this.carregarProjetos();
  }

  carregarProjetos(): void {

    this.projetosService.findAll(this.meta.paginaAtual, this.meta.tamanho, this.termoBusca).subscribe({
      next: (res: RespostaPaginada<ProjetosDTO>) => {
        this.projetos = res.conteudo;
        this.meta = res.meta;
      },
      error: (err: Error) => {
        console.error('Falha ao carregar projetos:', err);
        this.exibirErro('Não foi possível carregar a lista de projetos.');
      }
    });
  }

  visualizarProjeto(id: number): void {
    this.router.navigate(['/visualizar-detalhes', id]);
  }

  buscar(): void {
    this.meta.paginaAtual = 0;
    this.carregarProjetos();
  }

  aoMudarPaginacao(evento: { pagina: number; tamanho: number }): void {
    this.meta.paginaAtual = evento.pagina;
    this.meta.tamanho = evento.tamanho;
    this.carregarProjetos();
  }

  private exibirErro(msg: string): void {
    void Swal.fire('Erro!', msg, 'error');
  }
}
