import {Component, OnInit} from '@angular/core';
import {
  CursoDTO,
  CursoService,
  FormInput,
  DisciplinaService,
  DisciplinaDTO,
  SubareaConhecimentoService
} from "shared-core";

import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {SubareaConhecimentoDTO} from 'shared-core/src/lib/dto/SubareaConhecimento.dto';

@Component({
  selector: 'app-disciplina-crud',
    imports: [
        FormInput,
        ReactiveFormsModule,
        FormInput,
        CommonModule,
         HttpClientModule,
    ],
  providers:[DisciplinaService, SubareaConhecimentoService],
  templateUrl: './disciplina-crud.html',
  styleUrl: './disciplina-crud.scss'
})
export class DisciplinaCrud implements OnInit {
  disciplinaForm!: FormGroup;

  subAreas: SubareaConhecimentoDTO[] = [];

  disciplinas: DisciplinaDTO[] = [];

  constructor(public fb: FormBuilder, private disciplinaService: DisciplinaService, private subAreaService: SubareaConhecimentoService) {
  }

  ngOnInit(): void {
    this.disciplinaForm = this.fb.group({
      nome: ['', Validators.required],
      codigoDisciplina: ['', Validators.required],
      cargaHoraria: ['', Validators.required],
      subArea: ['', Validators.required]
    });
    this.loadCursos();
  }
  loadCursos(): void {
    this.disciplinaService.listarTodos().subscribe(data => {
      this.disciplinas = data as DisciplinaDTO[];
    })
  }
  loadSubAreas(): void {
    this.subAreaService.listarTodos().subscribe(data => {
      this.subAreas = data as SubareaConhecimentoDTO[];
    })
  }

  get c() {
    return this.disciplinaForm.controls as { [key: string]: FormControl };
  }

  onDelete(id: number): void {
    this.disciplinaService.delete(id).subscribe(res => {})
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
