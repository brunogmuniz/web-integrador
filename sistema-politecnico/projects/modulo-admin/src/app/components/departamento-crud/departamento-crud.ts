import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormInput, DepartamentoService, CursoDTO} from 'shared-core';
import {NgForOf} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {DepartamentoDTO} from 'shared-core/src/lib/dto/Departamento.dto';


@Component({
  selector: 'app-departamento-crud',
  imports: [
    FormInput,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [DepartamentoService],
  templateUrl: './departamento-crud.html',
  styleUrl: './departamento-crud.scss'
})
export class DepartamentoCrud implements OnInit {
  departamentoForm!: FormGroup;

  departamentos: DepartamentoDTO[] = [];
  constructor(public fb: FormBuilder, private departamentoService: DepartamentoService) {
  }

  ngOnInit(): void {
    this.departamentoForm = this.fb.group({
      nome: ['', Validators.required],
      sigla: ['', Validators.required],
    });
  }

  get c() {
    return this.departamentoForm.controls as { [key: string]: FormControl };
  }
onDelete(id: number) {
    this.departamentoService.delete(id).subscribe()
}
  onSubmit(): void {
    if (this.departamentoForm.valid) {
      this.departamentoService.create(this.departamentoForm.value).subscribe()
      console.log('Formulário Válido:', this.departamentoForm.value);
    }
  }
}
