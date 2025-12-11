import { Component, OnInit } from '@angular/core';
import Swal from "sweetalert2";
import { EstruturaCurricularService } from "../../../../app-core/src/lib/services/estrutura-curricular-service";

@Component({
  selector: 'app-visualizar-estrutura-curricular',
  templateUrl: './visualizar-estrutura.component.html',
})
export class VisualizarEstruturaCurricularComponent implements OnInit {
  estruturas: any[] = [];

  constructor(private estruturaService: EstruturaCurricularService) {}

  ngOnInit(): void {
    this.carregarEstruturas();
  }

  carregarEstruturas(): void {
    this.estruturaService.listarTodos().subscribe({
      next: (data: any) => this.estruturas = data.content || data,
      error: (err) => console.error('Erro ao carregar estruturas curriculares', err)
    });
  }

  onDelete(id: number): void {
    void Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja realmente excluir esta estrutura curricular?',
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
        this.estruturaService.delete(id).subscribe({
          next: () => {
            void Swal.fire('Sucesso', 'Estrutura curricular excluída com sucesso!', 'success');
            this.carregarEstruturas();
          },
          error: (err) => {
            if (err.status === 500 || err.status === 409) {
              void Swal.fire('Atenção', 'Não é possível excluir esta estrutura pois ela possui ofertas ou vínculos ativos.', 'warning');
            } else {
              void Swal.fire('Erro', 'Não foi possível excluir a estrutura. Tente novamente mais tarde.', 'error');
            }
            console.error(err);
          }
        });
      }
    });
  }
}
