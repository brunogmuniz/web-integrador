import { Component, OnInit } from '@angular/core';
import { CursoDTO, MetadadosPaginacao, RespostaPaginada } from "app-core";
import { CursoService } from "app-core";
import Swal from 'sweetalert2';

@Component({
  selector: 'lib-visualizar-curso',
  templateUrl: './visualizar-curso.component.html',
  styleUrls: ['./visualizar-curso.component.scss']
})
export class VisualizarCursoComponent implements OnInit {
  cursos: CursoDTO[] = [];

  meta: MetadadosPaginacao = {
    paginaAtual: 0,
    tamanho: 15,
    totalElementos: 0,
    totalPaginas: 0
  };

  nivelLabel: Record<string, string> = {
    MEDIO: 'Médio',
    TECNICO: 'Técnico',
    GRADUACAO: 'Graduação',
    POS_GRADUACAO: 'PÓS'
  };

  constructor(private cursoService: CursoService) {}

  ngOnInit(): void {
    this.carregarCursos();
  }

  carregarCursos(): void {
    this.cursoService.findAll(this.meta.paginaAtual, this.meta.tamanho).subscribe({
      next: (res: RespostaPaginada<CursoDTO>) => {
        this.cursos = res.conteudo;
        this.meta = res.meta;
      },
      error: (err: Error) => {
        console.error('Falha ao carregar a página de cursos:', err);
        this.exibirErro('Não foi possível carregar a lista de cursos.');
      }
    });
  }

  aoMudarPaginacao(evento: { pagina: number; tamanho: number }): void {
    this.meta.paginaAtual = evento.pagina;
    this.meta.tamanho = evento.tamanho;
    this.carregarCursos();
  }

  onDelete(uuid: string | undefined): void {
    if (!uuid) return;

    Swal.fire({
      title: 'Tem certeza?',
      text: 'Esse curso será excluído permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cursoService.delete(uuid).subscribe({
          next: () => {
            this.exibirSucesso('Curso excluído com sucesso!');
            this.carregarCursos();
          },
          error: (err) => {
            console.error(err);
            this.exibirErro('Não foi possível excluir o curso. Verifique se existem dependências vinculadas.');
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
