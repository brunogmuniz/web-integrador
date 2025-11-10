import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {CursoDTO, FormInput} from 'shared-core';
import { CommonModule } from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CursoService} from 'shared-core'


@Component({
  selector: 'app-curso-crud',
  standalone: true,
  providers: [CursoService],
  imports: [ReactiveFormsModule, FormInput, CommonModule, HttpClientModule],
  templateUrl: './curso-crud.html',
  styleUrls: ['./curso-crud.scss']
})
export class CursoCRUD implements OnInit {

  cursoForm!: FormGroup;
  niveis = ['Graduação', 'Pós-graduação', 'Técnico', 'Ensino Médio'];

  cursos: CursoDTO[] = [];

  constructor(public fb: FormBuilder, private cursoService: CursoService) {
  }

  ngOnInit(): void {
    this.cursoForm = this.fb.group({
      nome: ['', Validators.required],
      sigla: ['', Validators.required],
      anoCurriculo: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      cargaHoraria: ['', Validators.required],
      nivel: ['', Validators.required]
    });
    this.loadCursos();
  }
   loadCursos(): void {
    this.cursoService.listarTodos().subscribe(data => {
      this.cursos = data as CursoDTO[];
    })
   }

  get c() {
    return this.cursoForm.controls as { [key: string]: FormControl };
  }

  onDelete(id: number): void {
    this.cursoService.delete(id).subscribe(res => {})
  }



  onSubmit(): void {
    if (this.cursoForm.valid) {
      this.cursoService.create(this.cursoForm.value).subscribe(
        (resposta) => {
          console.log('Formulário Válido e Submetido:', this.cursoForm.value);
          console.log('Resposta do servidor:', resposta);
        },
        (erro) => {
          console.error('Erro ao criar Curso:', erro);
        }
      );
    } else {
      console.warn('Formulário Inválido. Verifique os campos.');
      this.cursoForm.markAllAsTouched();
    }
  }
}
