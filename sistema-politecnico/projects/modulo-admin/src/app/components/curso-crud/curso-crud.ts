import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormInput } from 'shared-core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-curso-crud',
  standalone: true,
  imports: [ReactiveFormsModule, FormInput, CommonModule],
  templateUrl: './curso-crud.html',
  styleUrls: ['./curso-crud.scss']
})
export class CursoCRUD implements OnInit {

  disciplinaForm!: FormGroup;
  niveis = ['Graduação', 'Pós-graduação', 'Técnico'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.disciplinaForm = this.fb.group({
      nome: ['', Validators.required],
      sigla: ['', Validators.required],
      anoCurriculo: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      cargaHoraria: ['', Validators.required],
      nivel: ['', Validators.required]
    });
  }

  get c() {
    return this.disciplinaForm.controls as { [key: string]: FormControl };
  }

  onSubmit(): void {
    if (this.disciplinaForm.valid) {
      console.log('Formulário Válido:', this.disciplinaForm.value);
    }
  }
}
