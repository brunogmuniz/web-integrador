import { Component } from '@angular/core';
import {CursoDTO, DocenteDTO, DocenteService, FormInput} from "shared-core";
import {NgForOf} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-docente-crud',
    imports: [
        FormInput,
        ReactiveFormsModule,
        HttpClientModule
    ],
  providers: [DocenteService],
  templateUrl: './docente-crud.html',
  styleUrl: './docente-crud.scss'
})
export class DocenteCrud {
  docenteForm!: FormGroup;
  docentes: DocenteDTO[] = [];

  constructor(public fb: FormBuilder,  private docenteService: DocenteService) {
  }

  ngOnInit(): void {
    this.docenteForm = this.fb.group({
      nome: ['', Validators.required],
      matricula: ['', Validators.required, Validators.pattern('^[0-9]{4}$')],
      cargaHorariaSemestral: ['', Validators.required],
      tipoVaga: ['', Validators.required],
      tipoFormacao: ['', Validators.required],
      licenciatura: [''],
      origemVaga: ['', Validators.required],
      departamento: ['', Validators.required]
    });
    this.loadDocentes();
  }
  loadDocentes(): void {
    this.docenteService.listarTodos().subscribe(data => {
      this.docentes = data as DocenteDTO[];
    })
  }

  get c() {
    return this.docenteForm.controls as { [key: string]: FormControl };
  }

  onDelete(id: number): void {
    this.docenteService.delete(id).subscribe(res => {})
  }



  onSubmit(): void {
    if (this.docenteForm.valid) {
      this.docenteService.create(this.docenteForm.value).subscribe(
        (resposta) => {
          console.log('Formulário Válido e Submetido:', this.docenteForm.value);
          console.log('Resposta do servidor:', resposta);
        },
        (erro) => {
          console.error('Erro ao criar Docente:', erro);
        }
      );
    } else {
      console.warn('Formulário Inválido. Verifique os campos.');
      this.docenteForm.markAllAsTouched();
    }
  }
}
