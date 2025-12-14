import { Component, OnInit } from '@angular/core';
import { DisciplinaService } from "../../../../app-core/src/lib/services/disciplina-service";
import { DisciplinaDTO } from "../../../../app-core/src/lib/dto/Disciplina.dto";
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
      error: (err) => console.error('Erro ao carregar disciplinas', err)
    });
  }

  confirmarExclusao(id: number): void {
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
        this.excluir(id);
      }
    });
  }

  private excluir(id: number): void {
    this.disciplinaService.delete(id).subscribe({
      next: () => {
        void Swal.fire('Excluído!', 'A disciplina foi removida.', 'success');
        this.carregarDisciplinas();
      },
      error: () => Swal.fire('Erro', 'Não foi possível excluir o registro.', 'error')
    });
  }
}
