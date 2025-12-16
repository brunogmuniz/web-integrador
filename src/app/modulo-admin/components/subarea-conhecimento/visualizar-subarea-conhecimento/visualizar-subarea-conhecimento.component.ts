import { Component, OnInit } from '@angular/core';
import { SubareaConhecimentoDTO } from "../../../../app-core/src/lib/dto/SubareaConhecimento.dto";
import { ActivatedRoute, Router } from "@angular/router";
import { SubareaConhecimentoService } from "../../../../app-core/src/lib/services/subarea-conhecimento-service";
import Swal from 'sweetalert2';

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
      error: (err) => console.error('Erro ao carregar subÁreas:', err)
    });
  }


  onDelete(id: number): void {
    void Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja realmente excluir esta subárea?',
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
        this.subAreaService.delete(id).subscribe({
          next: () => {
            void Swal.fire('Sucesso', 'Subárea excluída com sucesso!', 'success');
            this.carregarDados();
          },
          error: (err) => {
            console.error('Erro ao excluir subárea:', err);
            void Swal.fire('Erro', 'Não foi possível excluir a subárea. Tente novamente mais tarde.', 'error');
          }
        });
      }
    });
  }

}
