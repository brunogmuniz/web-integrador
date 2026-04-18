import { Component, OnInit } from '@angular/core';
import { DocenteService } from "app-core/lib/services/docente-service";
import { DocenteDetalheDTO } from "app-core/lib/dto/DocenteDetalhe.dto";
import { RespostaPaginada } from "app-core/lib/dto/paginacao/resposta-paginada.dto";
import Swal from "sweetalert2";
import {DocenteSubAreaPercentualDTO} from "app-core";

interface MetadadosPaginacao {
  paginaAtual: number;
  tamanho: number;
  totalElementos: number;
  totalPaginas: number;
}

@Component({
  selector: 'app-visualizar-docente-encargos',
  templateUrl: './visualizar-docente-encargos.component.html',
  styleUrls: ['./visualizar-docente-encargos.component.scss']
})
export class VisualizarDocenteEncargosComponent implements OnInit {

  public listaDocentesDetalhados: DocenteDetalheDTO[] = [];
  public loading: boolean = false;

  public meta: MetadadosPaginacao = {
    paginaAtual: 0,
    tamanho: 15,
    totalElementos: 0,
    totalPaginas: 0
  };

  constructor(private docenteService: DocenteService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  public aoMudarPaginacao(evento: { pagina: number; tamanho: number }): void {
    this.meta.paginaAtual = evento.pagina;
    this.meta.tamanho = evento.tamanho;
    this.carregarDados();
  }

  public trackByDocenteUuid(_index: number, item: DocenteDetalheDTO): string {
    return item.uuid;
  }

  public getNomesAreas(subAreas: DocenteSubAreaPercentualDTO[] | undefined): string[] {
    if (!subAreas || !Array.isArray(subAreas) || subAreas.length === 0) {
      return [];
    }
   console.log('Inspecionando subArea:', subAreas[0]);

    return Array.from(new Set(subAreas.map((sub: any) =>
      sub.nomeSubArea || sub.nomeArea || sub.nome || sub.subarea?.nome || 'Área sem nome'
    )));
  }

  public carregarDados(): void {
    this.loading = true;
    this.docenteService.listarTodosDetalhado(this.meta.paginaAtual, this.meta.tamanho).subscribe({
      next: (res: RespostaPaginada<DocenteDetalheDTO>) => {
        this.listaDocentesDetalhados = res.conteudo || [];
        this.meta = res.meta;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        void Swal.fire('Erro', 'Falha ao carregar a lista de docentes e seus encargos.', 'error');
      }
    });
  }

  public onDelete(uuidDocente: string): void {
    Swal.fire({
      title: 'Limpar Encargos?',
      text: 'Esta ação removerá TODOS os vínculos deste docente com suas respectivas subáreas.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, limpar tudo!',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.executarExclusaoDeEncargos(uuidDocente);
      }
    });
  }

  private executarExclusaoDeEncargos(uuidDocente: string): void {
    this.loading = true;
    this.docenteService.atualizarEncargos(uuidDocente, []).subscribe({
      next: () => {
        this.loading = false;
        void Swal.fire('Sucesso', 'Todos os encargos do docente foram removidos!', 'success');
        this.carregarDados();
      },
      error: (err) => {
        this.loading = false;
        this.handleDeleteError(err);
      }
    });
  }

  private handleDeleteError(err: any): void {
    let mensagem = 'Não foi possível remover os encargos.';
    if (err.status === 409) {
      mensagem = 'Conflito: Este vínculo possui dependências ativas no sistema.';
    } else if (err.status === 404) {
      mensagem = 'O docente especificado não foi encontrado.';
    }
    void Swal.fire('Erro', mensagem, 'error');
  }
}
