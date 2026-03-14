import { Component, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { CursoImportacaoService, UploadPlanilhaComponent } from 'app-core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-importar-cursos',
  templateUrl: './cursos.component.html'
})
export class CursosComponent {
  @ViewChild(UploadPlanilhaComponent) uploadComponent!: UploadPlanilhaComponent;

  isUploading = false;

  constructor(private readonly importService: CursoImportacaoService) {}

  processarImportacao(arquivo: File): void {
    this.isUploading = true;

    this.importService.importar(arquivo)
      .pipe(
        finalize(() => {
          this.isUploading = false;
          if (this.uploadComponent) this.uploadComponent.limpar();
        })
      )
      .subscribe({
        next: () => void Swal.fire('Sucesso', 'Cursos importados com sucesso!', 'success'),
        error: (err: HttpErrorResponse) => void Swal.fire('Falha na importação', this.extrairErroApi(err), 'error')
      });
  }

  mostrarInstrucoesCursos(): void {
    void Swal.fire({
      icon: 'warning',
      title: 'Formato esperado',
      html: `
      <p style="text-align:left; margin: 0;">
        A planilha deve conter as seguintes colunas:
      </p>
      <ul style="text-align:left; margin-top: 8px; padding-left: 20px;">
        <li><strong>cod_curso</strong></li>
      </ul>
    `,
      confirmButtonText: 'Certo!',
      confirmButtonColor: '#3abf94',
    });
  }

  private extrairErroApi(err: HttpErrorResponse): string {
    if (err.error instanceof ProgressEvent) return 'Falha de conexão com o servidor ou bloqueio de CORS.';
    if (err.error?.message) return err.error.message;
    if (typeof err.error === 'string') return err.error;
    return 'Ocorreu um erro desconhecido ao comunicar com o servidor.';
  }
}
