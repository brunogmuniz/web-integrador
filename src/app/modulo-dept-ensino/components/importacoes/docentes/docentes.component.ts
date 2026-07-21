import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { DocenteImportacaoService, DepartamentoService, DepartamentoDTO, SelectOption, UploadPlanilhaComponent } from 'app-core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-importar-docentes',
  templateUrl: './docentes.component.html'
})
export class DocentesComponent implements OnInit {
  @ViewChild(UploadPlanilhaComponent) uploadComponent!: UploadPlanilhaComponent;

  isUploading = false;
  departamentoId: number | null = null;
  departamentos: DepartamentoDTO[] = [];
  opcoesDepartamentos: SelectOption[] = [];

  constructor(
    private readonly importService: DocenteImportacaoService,
    private readonly departamentoService: DepartamentoService
  ) {}

  ngOnInit(): void {
    this.carregarDepartamentos();
  }

  private carregarDepartamentos(): void {
    this.departamentoService.findAll(0, 500).subscribe({
      next: (res) => {
        this.departamentos = res.conteudo;
        this.opcoesDepartamentos = this.departamentos.map(departamento => ({
          id: departamento.id as number,
          label: departamento.nome || ''
        }));
      },
      error: (err) => {
        console.error('Erro ao carregar departamentos:', err);
        void Swal.fire('Erro', 'Não foi possível carregar a lista de departamentos.', 'error');
      }
    });
  }

  processarImportacao(arquivo: File): void {
    if (!this.departamentoId) {
      void Swal.fire('Atenção', 'Selecione um departamento antes de importar.', 'warning');
      return;
    }

    this.isUploading = true;

    this.importService.importar(arquivo, this.departamentoId)
      .pipe(
        finalize(() => {
          this.isUploading = false;
          if (this.uploadComponent) this.uploadComponent.limpar();
        })
      )
      .subscribe({
        next: () => void Swal.fire('Sucesso', 'Docentes importados com sucesso!', 'success'),
        error: (err: HttpErrorResponse) => void Swal.fire('Erro na importação', this.extrairErroApi(err), 'error')
      });
  }

  mostrarInstrucoesDocentes(): void {
    void Swal.fire({
      icon: 'warning',
      title: 'Formato esperado',
      html: `
      <p style="text-align:left; margin: 0;">
        A planilha deve conter as seguintes colunas:
      </p>
      <ul style="text-align:left; margin-top: 8px; padding-left: 20px;">
        <li><strong>matr_externa</strong></li>
        <li><strong>nome_docente</strong></li>
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
