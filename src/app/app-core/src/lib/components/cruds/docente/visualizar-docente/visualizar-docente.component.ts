import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
<<<<<<< HEAD:src/app/app-core/src/lib/components/cruds/docente/visualizar-docente/visualizar-docente.component.ts
import { DocenteDTO } from "../../../../dto/Docente.dto";
import { DocenteService } from "../../../../services/docente-service";
=======
import { DocenteDTO } from "app-core";
import { DocenteService } from "app-core";
>>>>>>> origin/Refatoracao:src/app/modulo-admin/components/docente/visualizar-docente/visualizar-docente.component.ts
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
      error: (err) => console.error(err)
    });
  }


  onDelete(uuid: string | undefined): void {
    if (!uuid) {
      void Swal.fire('Erro', 'Identificador do docente inválido.', 'error');
      return;
    }

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
        this.docenteService.delete(uuid).subscribe({
          next: () => {
            void Swal.fire('Sucesso', 'Docente excluído com sucesso!', 'success');
            this.carregarDocentes();
          },
          error: (err) => this.handleDeleteError(err)
        });
      }
    });
  }
  private handleDeleteError(err: any): void {
    const isConflict = err.status === 500 || err.status === 409;
    void Swal.fire(
      isConflict ? 'Atenção' : 'Erro',
      isConflict ? 'Não é possível excluir este docente pois ele possui encargos ou vínculos ativos.' : 'Erro ao excluir o docente.',
      isConflict ? 'warning' : 'error'
    );
  }
}
