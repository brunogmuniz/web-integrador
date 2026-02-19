import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD:src/app/app-core/src/lib/components/cruds/disciplina/visualizar-disciplina/visualizar-disciplina.component.ts
import { DisciplinaService } from "../../../../services/disciplina-service";
import { DisciplinaDTO } from "../../../../dto/Disciplina.dto";
=======
import { DisciplinaService } from "app-core";
import { DisciplinaDTO } from "app-core";
>>>>>>> origin/Refatoracao:src/app/modulo-admin/components/disciplina/visualizar-disciplina/visualizar-disciplina.component.ts
import Swal from "sweetalert2";

@Component({
  selector: 'app-visualizar-disciplina',
  templateUrl: './visualizar-disciplina.component.html',
  styleUrls: ['./visualizar-disciplina.component.scss']
})
export class VisualizarDisciplinaComponent implements OnInit {
  disciplinas: DisciplinaDTO[] = [];

  constructor(private disciplinaService: DisciplinaService) {}

  ngOnInit(): void {
    this.carregarDisciplinas();
  }

  carregarDisciplinas(): void {
    this.disciplinaService.findAll().subscribe({
      next: (res) => this.disciplinas = res,
      error: (err) => console.error(err)
    });
  }

  confirmarExclusao(uuid: string | null | undefined): void {

    if (!uuid) {
      void Swal.fire('Erro', 'Identificador inválido.', 'error');
      return;
    }

    Swal.fire({
      title: 'Tem certeza?',
      text: "Esta ação não poderá ser revertida!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.excluir(uuid);
      }
    });
  }

  private excluir(uuid: string): void {
    this.disciplinaService.delete(uuid).subscribe({
      next: () => {
        void Swal.fire('Excluído!', 'A disciplina foi removida.', 'success');
        this.carregarDisciplinas();
      },
      error: (err) => {
        console.error();
        void Swal.fire('Erro', 'Não foi possível excluir o registro.', 'error');
      }
    });
  }
}
