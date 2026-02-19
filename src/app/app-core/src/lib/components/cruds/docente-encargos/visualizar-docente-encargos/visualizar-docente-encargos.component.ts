<<<<<<< HEAD:src/app/app-core/src/lib/components/cruds/docente-encargos/visualizar-docente-encargos/visualizar-docente-encargos.component.ts
import {Component, OnInit} from '@angular/core';
import {DocenteService} from "../../../../services/docente-service";
import {DocenteDetalheDTO} from "../../../../dto/DocenteDetalhe.dto";
import Swal from "sweetalert2";
=======
import { Component, OnInit } from '@angular/core';
import { DocenteService, DocenteDetalheDTO } from 'app-core';
import Swal from 'sweetalert2';
>>>>>>> origin/Refatoracao:src/app/modulo-admin/components/docente-encargos/visualizar-docente-encargos/visualizar-docente-encargos.component.ts

@Component({
  selector: 'app-visualizar-docente-encargos',
  templateUrl: './visualizar-docente-encargos.component.html',
  styleUrls: ['./visualizar-docente-encargos.component.scss']
})
export class VisualizarDocenteEncargosComponent implements OnInit {

  public listaDocentesDetalhados: DocenteDetalheDTO[] = [];
  public loading: boolean = false;

  constructor(private docenteService: DocenteService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  public trackByDocenteUuid(index: number, item: DocenteDetalheDTO): string {
    return item.uuid;
  }

  public getNomesAreas(subAreas: any[]): string[] {
    if (!subAreas) return [];
    return Array.from(new Set(subAreas.map(sub => sub.nomeArea)));
  }

  public carregarDados(): void {
    this.loading = true;
    this.docenteService.listarTodosDetalhado().subscribe({
      next: (detalhes: any) => {
        const lista = Array.isArray(detalhes) ? detalhes : detalhes.content || [];
        this.listaDocentesDetalhados = lista.filter((d: DocenteDetalheDTO) => !!d);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Erro', 'Falha ao carregar a lista de docentes.', 'error');
      }
    });
  }

  public onDelete(uuidVinculo: string): void {
    Swal.fire({
      title: 'Remover Encargo?',
      text: 'Esta ação removerá o vínculo do docente com esta subárea.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, remover!',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.executarExclusao(uuidVinculo);
      }
    });
  }

  private executarExclusao(uuid: string): void {
    this.loading = true;
    this.docenteService.deleteVinculoSubArea(uuid).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire('Sucesso', 'Vínculo removido com sucesso!', 'success');
        this.carregarDados();
      },
      error: (err) => {
        this.loading = false;
        this.handleDeleteError(err);
      }
    });
  }

  private handleDeleteError(err: any): void {
    let mensagem = 'Não foi possível remover o encargo.';
    if (err.status === 409) {
      mensagem = 'Conflito: Este vínculo possui dependências ativas no sistema.';
    } else if (err.status === 404) {
      mensagem = 'O registro não foi encontrado.';
    }
    Swal.fire('Erro', mensagem, 'error');
  }
}
