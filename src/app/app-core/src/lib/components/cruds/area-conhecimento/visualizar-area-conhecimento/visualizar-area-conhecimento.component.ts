import {Component, OnInit} from '@angular/core';
import {AreaConhecimentoDTO} from "../../../../dto/AreaConhecimento.dto";
import {AreaConhecimentoService} from "../../../../services/area-conhecimento-service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-visualizar-area-conhecimento',
  templateUrl: './visualizar-area-conhecimento.component.html',
  styleUrls: ['./visualizar-area-conhecimento.component.scss']
})
export class VisualizarAreaConhecimentoComponent implements OnInit {
  areas: AreaConhecimentoDTO[] = [];

  constructor(private areaService: AreaConhecimentoService) {}

  ngOnInit(): void {
    this.loadAreas();
  }

  loadAreas(): void {
    this.areaService.listarTodos().subscribe({
      next: (data) => {
        this.areas = data;
      },
      error: (err) => {
        console.error('Erro ao carregar áreas:', err);
      }
    });
  }

  onDelete(id: number): void {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Essa área de conhecimento será excluída permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.areaService.delete(id).subscribe({
          next: () => {
            this.areas = this.areas.filter(a => a.id !== id);

            Swal.fire({
              title: 'Excluída!',
              text: 'Área removida com sucesso.',
              icon: 'success',
              timer: 1800,
              showConfirmButton: false
            });
          },
          error: () => {
            Swal.fire({
              title: 'Erro!',
              text: 'Não foi possível excluir a área.',
              icon: 'error'
            });
          }
        });
      }
    });
  }

}
