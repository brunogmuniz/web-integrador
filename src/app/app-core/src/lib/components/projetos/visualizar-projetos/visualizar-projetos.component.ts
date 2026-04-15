import { Component } from '@angular/core';
import { MetadadosPaginacao, RespostaPaginada } from "app-core/lib/dto/paginacao/resposta-paginada.dto";
import Swal from "sweetalert2";
import { ProjetosDTO } from "app-core/lib/dto/Projetos.dto";
import { ProjetoService } from "app-core/lib/services/projetos/projeto.service";

@Component({
  selector: 'lib-visualizar-projetos',
  templateUrl: './visualizar-projetos.component.html',
  styleUrls: ['./visualizar-projetos.component.css']
})
export class VisualizarProjetosComponent {

  projetos: ProjetosDTO[] = [];

  meta: MetadadosPaginacao = {
    paginaAtual: 0,
    tamanho: 15,
    totalElementos: 0,
    totalPaginas: 0
  };

  constructor(private projetosService: ProjetoService) {}

  ngOnInit(): void {
    this.carregarProjetos();
  }

  carregarProjetos(): void {
    this.projetosService.findAll(this.meta.paginaAtual, this.meta.tamanho).subscribe({
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

  aoMudarPaginacao(evento: { pagina: number; tamanho: number }): void {
    this.meta.paginaAtual = evento.pagina;
    this.meta.tamanho = evento.tamanho;
    this.carregarProjetos();
  }

  private exibirErro(msg: string): void {
    void Swal.fire('Erro!', msg, 'error');
  }
}
