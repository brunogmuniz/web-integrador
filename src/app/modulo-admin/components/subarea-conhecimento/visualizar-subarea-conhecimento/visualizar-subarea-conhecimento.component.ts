import {Component, OnInit} from '@angular/core';
import {SubareaConhecimentoDTO} from "../../../../app-core/src/lib/dto/SubareaConhecimento.dto";
import {ActivatedRoute, Router} from "@angular/router";
import {SubareaConhecimentoService} from "../../../../app-core/src/lib/services/subarea-conhecimento-service";

@Component({
  selector: 'app-visualizar-subarea-conhecimento',
  templateUrl: './visualizar-subarea-conhecimento.component.html',
  styleUrls: ['./visualizar-subarea-conhecimento.component.scss']
})
export class VisualizarSubareaConhecimentoComponent implements OnInit {
  subArea: SubareaConhecimentoDTO | null = null;
  subAreas: SubareaConhecimentoDTO[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private subAreaService: SubareaConhecimentoService
  ) {}


  ngOnInit(): void {
    this.carregarDados();
  }
  trackBySubId(index: number, sub: SubareaConhecimentoDTO) {
    return sub.id;
  }
  carregarDados(): void {
    this.subAreaService.listarTodos().subscribe({
      next: (detalhes) => {
        this.subAreas = detalhes.filter(d => !!d);
      },
      error: (err) => console.error('Erro ao carregar subAreas', err)
    });
  }

  editar(): void {
    if (this.subArea?.id) {
      void this.router.navigate(['/sub-area/editar', this.subArea.id]);
    }
  }

  voltar(): void {
    void this.router.navigate(['/sub-area']);
  }
}
