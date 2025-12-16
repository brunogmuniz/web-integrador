import {Component, OnInit} from '@angular/core';
import {DocenteService} from "../../../../app-core/src/lib/services/docente-service";
import {DocenteDetalheDTO} from "../../../../app-core/src/lib/dto/DocenteDetalhe.dto";
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
  trackByDocenteId(index: number, item: DocenteDetalheDTO) {
    return item.idDocente;
  }

  carregarDados(): void {
    this.docenteService.listarTodosDetalhado().subscribe({
      next: (detalhes) => {
        this.listaDocentesDetalhados = detalhes.filter(d => !!d);
      },
      error: (err) => console.error('Erro ao carregar detalhes', err)
    });
  }

  getNomesAreas(subAreas: any[]): string[] {
    if (!subAreas) return [];
    return Array.from(new Set(subAreas.map(sub => sub.nomeArea)));
  }
  onDelete(id: number): void {
    void Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja realmente excluir este docente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-light-secondary me-3'
      }
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.docenteService.delete(id).subscribe({
          next: () => {
            void Swal.fire('Sucesso', 'Docente excluído com sucesso!', 'success');
            this.carregarDados();
          },
          error: (err) => {
            if (err.status === 500 || err.status === 409) {
              void Swal.fire(
                'Atenção',
                'Não é possível excluir este docente pois ele possui encargos ou vínculos ativos.',
                'warning'
              );
            } else {
              void Swal.fire(
                'Erro',
                'Não foi possível excluir o docente. Tente novamente mais tarde.',
                'error'
              );
            }
            console.error(err);
          }
        });
      }
    });
  }
}
