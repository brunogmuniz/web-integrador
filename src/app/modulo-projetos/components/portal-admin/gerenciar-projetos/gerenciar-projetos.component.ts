import { Component, OnInit } from '@angular/core';
import { ProjetosDTO } from "app-core/lib/dto/Projetos.dto";
import { MetadadosPaginacao, RespostaPaginada } from "app-core/lib/dto/paginacao/resposta-paginada.dto";
import { ProjetoService } from "app-core/lib/services/projetos/projeto.service";
import Swal from "sweetalert2";

@Component({
  selector: 'lib-gerenciar-projetos',
  templateUrl: './gerenciar-projetos.component.html',
  styleUrls: ['./gerenciar-projetos.component.css']
})
export class GerenciarProjetosComponent implements OnInit {

  projetos: ProjetosDTO[] = [];
  termoBusca: string = '';

  meta: MetadadosPaginacao = {
    paginaAtual: 0,
    tamanho: 15,
    totalElementos: 0,
    totalPaginas: 0
  };

  constructor(private projetoService: ProjetoService) {}

  ngOnInit(): void {
    this.carregarProjetos();
  }

  carregarProjetos(): void {
    this.projetoService.findAll(this.meta.paginaAtual, this.meta.tamanho, this.termoBusca).subscribe({
      next: (res: RespostaPaginada<ProjetosDTO>) => {
        this.projetos = res.conteudo;
        this.meta = res.meta;
      },
      error: (err: Error) => {
        console.error('Falha ao carregar a página de projetos:', err);
        this.exibirErro('Não foi possível carregar a lista de projetos.');
      }
    });
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

  onDelete(id: number | undefined): void {
    if (!id) return;

    Swal.fire({
      title: 'Tem certeza?',
      text: 'Esse projeto será excluído permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.projetoService.delete(id).subscribe({
          next: () => {
            this.exibirSucesso('Projeto excluído com sucesso!');
            this.carregarProjetos();
          },
          error: () => {
            this.exibirErro('Falha ao excluir o projeto.');
          }
        });
      }
    });
  }

  private exibirSucesso(msg: string): void {
    void Swal.fire('Sucesso!', msg, 'success');
  }

  private exibirErro(msg: string): void {
    void Swal.fire('Erro!', msg, 'error');
  }
}
