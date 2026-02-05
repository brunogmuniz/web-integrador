import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { DocenteDTO } from "../../../../dto/Docente.dto";
import { DocenteService } from "../../../../services/docente-service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-visualizar-docente',
  templateUrl: './visualizar-docente.component.html',
})
export class VisualizarDocenteComponent implements OnInit {

  docentes: DocenteDTO[] = [];

  constructor(
    private docenteService: DocenteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarDocentes();
  }

  carregarDocentes(): void {
    this.docenteService.listarTodos().subscribe({
      next: (data) => this.docentes = data,
      error: (err) => console.error('Erro ao carregar docentes', err)
    });
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
            this.carregarDocentes();
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
