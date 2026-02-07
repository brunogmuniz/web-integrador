import {Component, OnInit} from '@angular/core';
import {DocenteService} from "app-core";
import {DocenteDetalheDTO} from "app-core";
import Swal from "sweetalert2";

@Component({
  selector: 'app-visualizar-docente-encargos',
  templateUrl: './visualizar-docente-encargos.component.html',
  styleUrls: ['./visualizar-docente-encargos.component.scss']
})
export class VisualizarDocenteEncargosComponent implements OnInit {
  listaDocentesDetalhados: DocenteDetalheDTO[] = [];

  constructor(private docenteService: DocenteService) {}

  ngOnInit(): void {
    this.carregarDados();
  }
  trackByDocenteUuid(index: number, item: DocenteDetalheDTO) {
    return item.uuidDocente;
  }

  carregarDados(): void {
    this.docenteService.listarTodosDetalhado().subscribe({
      next: (detalhes) => {
        this.listaDocentesDetalhados = detalhes.filter(d => !!d);
      },
      error: (err) => console.error(err)
    });
  }

  getNomesAreas(subAreas: any[]): string[] {
    if (!subAreas) return [];
    return Array.from(new Set(subAreas.map(sub => sub.nomeArea)));
  }

  onDelete(uuidDocente: string): void {
    void Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja realmente excluir este docente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.docenteService.delete(uuidDocente.toString()).subscribe({
          next: () => {
            void Swal.fire('Sucesso', 'Docente excluído com sucesso!', 'success');
            this.carregarDados();
          },
          error: (err) => {
            this.handleDeleteError(err);
          }
        });
      }
    });
  }
  private handleDeleteError(err: any) {
    const isConflict = err.status === 500 || err.status === 409;
    void Swal.fire(
      isConflict ? 'Atenção' : 'Erro',
      isConflict ? 'Não é possível excluir pois possui encargos ativos.' : 'Erro ao excluir o docente.',
      isConflict ? 'warning' : 'error'
    );
  }
}
