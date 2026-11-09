import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import {
  DisciplinaImportacaoService,
  SelectOption,
  SubareaConhecimentoService,
  SubareaConhecimentoDTO,
  UploadPlanilhaComponent
} from 'app-core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-importar-disciplinas',
  templateUrl: './disciplinas.component.html'
})
export class DisciplinasComponent implements OnInit {
  @ViewChild(UploadPlanilhaComponent) uploadComponent!: UploadPlanilhaComponent;

  isUploading = false;
  subareaId: number | null = null;
  subareas: SubareaConhecimentoDTO[] = [];
  opcoesSubareas: SelectOption[] = [];

  constructor(
    private readonly importService: DisciplinaImportacaoService,
    private readonly subareaService: SubareaConhecimentoService
  ) {}

  ngOnInit(): void {
    this.carregarSubareas();
  }

  private carregarSubareas(): void {
    this.subareaService.findAll(0, 500).subscribe({
      next: (res) => {
        this.subareas = res.conteudo;
        this.opcoesSubareas = this.subareas.map(subarea => ({
          id: subarea.id as number,
          label: subarea.nome || ''
        }));
      },
      error: (err) => {
        console.error('Erro ao carregar departamentos:', err);
        void Swal.fire('Erro', 'Não foi possível carregar a lista de departamentos.', 'error');
      }
    });
  }

  processarImportacao(arquivo: File): void {
    if (!this.subareaId) {
      void Swal.fire('Atenção', 'Selecione uma subárea antes de iniciar a importação.', 'warning');
      return;
    }

    this.isUploading = true;
    this.importService.importar(arquivo, this.subareaId)
      .pipe(
        finalize(() => {
          this.isUploading = false;
          if (this.uploadComponent) this.uploadComponent.limpar();
        })
      )
      .subscribe({
        next: () => void Swal.fire('Sucesso', 'Disciplinas importadas com sucesso!', 'success'),
        error: (err: HttpErrorResponse) => void Swal.fire('Falha na importação', this.extrairErroApi(err), 'error')
      });
  }

  mostrarInstrucoesDisciplinas(): void {
    void Swal.fire({
      icon: 'warning',
      title: 'Formato esperado',
      html: `
      <p style="text-align:left; margin: 0;">
        A planilha deve conter as seguintes colunas:
      </p>
      <ul style="text-align:left; margin-top: 8px; padding-left: 20px;">
        <li><strong>codigo_disciplina</strong></li>
        <li><strong>nome</strong></li>
        <li><strong>carga_horaria</strong></li>
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
