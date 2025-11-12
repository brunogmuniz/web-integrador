import { Component } from '@angular/core';
import {CursoDTO, EstruturaCurricularDTO, EstruturaCurricularService, FormInput} from "shared-core";
import {NgForOf} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-estrutura-curricular-crud',
    imports: [
        FormInput,
        NgForOf,
        ReactiveFormsModule,
      HttpClientModule
    ],
  providers: [EstruturaCurricularService],
  templateUrl: './estrutura-curricular-crud.html',
  styleUrl: './estrutura-curricular-crud.scss'
})
export class EstruturaCurricularCrud {
  estruturaForm!: FormGroup;

  estruturas: EstruturaCurricularDTO[] = [];

  constructor(public fb: FormBuilder, private estruturaService: EstruturaCurricularService) {
  }

  ngOnInit(): void {
    this.estruturaForm = this.fb.group({
      nome: ['', Validators.required],
      sigla: ['', Validators.required],
      anoCurriculo: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      cargaHoraria: ['', Validators.required],
      nivel: ['', Validators.required]
    });
    this.loadCursos();
  }
  loadCursos(): void {
    this.estruturaService.listarTodos().subscribe(data => {
      this.estruturas = data as EstruturaCurricularDTO[];
    })
  }

  get c() {
    return this.estruturaForm.controls as { [key: string]: FormControl };
  }

  onDelete(id: number): void {
    this.estruturaService.delete(id).subscribe(res => {})
  }



  onSubmit(): void {
    if (this.estruturaForm.valid) {
      this.estruturaService.create(this.estruturaForm.value).subscribe(
        (resposta) => {
          console.log('Formulário Válido e Submetido:', this.estruturaForm.value);
          console.log('Resposta do servidor:', resposta);
        },
        (erro) => {
          console.error('Erro ao criar Estrutura:', erro);
        }
      );
    } else {
      console.warn('Formulário Inválido. Verifique os campos.');
      this.estruturaForm.markAllAsTouched();
    }
  }
}
