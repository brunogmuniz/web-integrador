import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AreaConhecimentoDTO, CursoService, FormInput} from 'shared-core';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {AreaConhecimentoService} from 'shared-core';
import {HttpClientModule} from '@angular/common/http';
import {SubareaConhecimentoDTO} from 'shared-core/src/lib/dto/SubareaConhecimento.dto';

@Component({
  selector: 'app-area-conhecimento-crud',
  imports: [
    FormInput,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
  ],
  providers: [AreaConhecimentoService],
  templateUrl: './area-conhecimento-crud.html',
  styleUrl: './area-conhecimento-crud.scss'
})
export class AreaConhecimentoCrud implements OnInit {

  areaForm!: FormGroup;

  areas: AreaConhecimentoDTO[] = [];

  constructor(public fb: FormBuilder, private areaService: AreaConhecimentoService) {
  }

  ngOnInit(): void {
    this.areaForm = this.fb.group({
      nome: ['', Validators.required],
      sigla: ['', Validators.required],
      cargaHoraria: ['', Validators.required],
    });
    this.loadAreas();
  }

  get c() {
    return this.areaForm.controls as { [key: string]: FormControl };
  }

  loadAreas(): void {
    this.areaService.listarTodos().subscribe(data => {
      this.areas = data as AreaConhecimentoDTO[];
    })
  }

  onDelete(id: number): void {
    this.areaService.delete(id).subscribe(res => {})
  }


  onSubmit(): void {
    if (this.areaForm.valid) {
      this.areaService.create(this.areaForm.value).subscribe(
        (resposta) => {
          console.log('Formulário Válido e Submetido:', this.areaForm.value);
          console.log('Resposta do servidor:', resposta);
        },
        (erro) => {
          console.error('Erro ao criar área:', erro);
        }
      );
    } else {
      console.warn('Formulário Inválido. Verifique os campos.');
      this.areaForm.markAllAsTouched();
    }
  }
}
