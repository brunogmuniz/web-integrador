import {Component, OnInit} from '@angular/core';
import {AreaConhecimentoDTO} from "../../../../app-core/src/lib/dto/AreaConhecimento.dto";
import {AreaConhecimentoService} from "../../../../app-core/src/lib/services/area-conhecimento-service";

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
    if (confirm('Tem certeza que deseja excluir esta área?')) {
      this.areaService.delete(id).subscribe({
        next: () => {
          this.areas = this.areas.filter(a => a.id !== id);
        },
        error: (err) => console.error('Erro ao deletar área:', err)
      });
    }
  }
}
