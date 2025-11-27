import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import {
  FormInput,
  DisciplinaService,
  DisciplinaDTO,
  SubareaConhecimentoService
} from "shared-core";
import { SubareaConhecimentoDTO } from 'shared-core/src/lib/dto/SubareaConhecimento.dto';

@Component({
  selector: 'app-disciplina-crud',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormInput,
    CommonModule,
    HttpClientModule,
  ],
  providers: [DisciplinaService, SubareaConhecimentoService],
  templateUrl: './disciplina-crud.html',
  styleUrl: './disciplina-crud.scss'
})
export class DisciplinaCrud implements OnInit {
  disciplinaForm!: FormGroup;
  subAreas: SubareaConhecimentoDTO[] = [];
  disciplinas: DisciplinaDTO[] = [];

  constructor(
    public fb: FormBuilder,
    private disciplinaService: DisciplinaService,
    private subAreaService: SubareaConhecimentoService
  ) {}

  ngOnInit(): void {
    this.disciplinaForm = this.fb.group({
      nome: ['', Validators.required],
      codigoDisciplina: ['', Validators.required],
      cargaHoraria: ['', Validators.required],
      subArea: ['', Validators.required]
    });
    this.loadDisciplinas();
    this.loadSubAreas();
  }

  loadDisciplinas(): void {
    this.disciplinaService.findAll().subscribe((data: any) => {
      this.disciplinas = data.content || data;
    });
  }

  loadSubAreas(): void {
    this.subAreaService.listarTodos().subscribe((data: any) => {
      this.subAreas = data.content || data;
    });
  }

  get c() {
    return this.disciplinaForm.controls as { [key: string]: FormControl };
  }

  onDelete(id: number): void {
    this.disciplinaService.delete(id).subscribe(res => {});
  }

  onSubmit(): void {
    if (this.disciplinaForm.valid) {
      this.disciplinaService.create(this.disciplinaForm.value).subscribe(
        (resposta) => {
          console.log('Formulário Válido e Submetido:', this.disciplinaForm.value);
          console.log('Resposta do servidor:', resposta);
        },
        (erro) => {
          console.error('Erro ao criar Disciplina:', erro);
        }
      );
    } else {
      console.warn('Formulário Inválido. Verifique os campos.');
      this.disciplinaForm.markAllAsTouched();
    }
  }
}
