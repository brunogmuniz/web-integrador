import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-planilha',
  templateUrl: './upload-planilha.component.html',
  styleUrls: ['./upload-planilha.component.css']
})
export class UploadPlanilhaComponent {
  @Input() titulo: string = 'Importar Arquivo';
  @Input() subtitulo: string = 'Selecione a planilha no formato .CSV';
  @Input() textoBotao: string = 'Importar';
  @Input() isLoading: boolean = false;
  @Input() disableSubmit: boolean = false;

  @Output() fileSubmit = new EventEmitter<File>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  selectedFile: File | null = null;

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const files = element.files;

    if (files && files.length > 0) {
      const file = files[0];

      const isCsvType = file.type === 'text/csv' || file.type === 'application/vnd.ms-excel';
      const isCsvExtension = file.name.toLowerCase().endsWith('.csv');

      if (!isCsvType && !isCsvExtension) {
        void Swal.fire('Formato inválido', 'Por favor, anexe um arquivo .csv válido.', 'warning');
        this.limpar();
        return;
      }
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.selectedFile) {
      this.fileSubmit.emit(this.selectedFile);
    }
  }

  public limpar(): void {
    this.selectedFile = null;
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
