import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ImportarPlanilhaService } from 'app-core/lib/services/importar-planilha-service';

@Component({
  selector: 'app-visualizar-importar-planilha',
  templateUrl: './visualizar-importar-planilha.component.html',
  styleUrls: ['./visualizar-importar-planilha.component.css']
})
export class VisualizarImportarPlanilhaComponent {
  arquivo?: File;
  importando: boolean = false;

  constructor(private importarPlanilhaService: ImportarPlanilhaService) {}

  ngOnInit(): void {}

  importarCSV(): void {
    if (!this.arquivo) {
      Swal.fire({ icon: 'warning', title: 'Atenção', text: 'Anexe um arquivo' });
      return;
    }

    this.importando = true;
    this.importarPlanilhaService.salvarPorCSV(this.arquivo).subscribe({
      next: (data: boolean) => {
        this.importando = false;
        Swal.fire({
          icon: data ? 'success' : 'error',
          title: data ? 'Importado com Sucesso!' : 'Falha na importação',
        });
      },
      error: () => {
        this.importando = false;
        Swal.fire({ icon: 'error', title: 'Erro inesperado ao importar' });
      }
    });
  }

  addObjeto(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files?.length) {
      this.arquivo = files[0];
    }
  }
}
