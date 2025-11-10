import {Component, OnInit} from '@angular/core';
import {AreaConhecimentoDTO, AreaConhecimentoService, FormInput, SubareaConhecimentoService} from "shared-core";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import { Observable } from 'rxjs';
import {SubareaConhecimentoDTO} from 'shared-core/src/lib/dto/SubareaConhecimento.dto';

@Component({
  selector: 'app-subarea-conhecimento-crud',
  imports: [
    FormInput,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
  ],
  providers: [SubareaConhecimentoService, AreaConhecimentoService],
  templateUrl: './subarea-conhecimento.html',
  styleUrl: './subarea-conhecimento.scss'
})
export class SubareaConhecimento implements OnInit {
  subAreaForm!: FormGroup;

  subAreas: SubareaConhecimentoDTO[] = [];

  areasDeConhecimento$!: Observable<AreaConhecimentoDTO[]>;

  constructor(
    public fb: FormBuilder,
    private areaService: SubareaConhecimentoService,
    private areaConhecimentoService: AreaConhecimentoService
  ) {}

  ngOnInit(): void {
    this.subAreaForm = this.fb.group({
      nome: ['', Validators.required],
      sigla: ['', Validators.required],
      cargaHoraria: ['', Validators.required],
      areaConhecimentoId: [null, Validators.required],
    });
    this.loadSubAreas();
    this.areasDeConhecimento$ = this.areaConhecimentoService.listarTodos();
  }

  loadSubAreas(): void {
    this.areaService.listarTodos().subscribe(data => {
      this.subAreas = data as SubareaConhecimentoDTO[];
    })
  }

  onDelete(id: number): void {
    this.areaService.delete(id).subscribe(data => {})
  }

  get c() {
    return this.subAreaForm.controls as { [key: string]: FormControl };
  }

  onSubmit(): void {
    if (this.subAreaForm.valid) {
      this.areaService.create(this.subAreaForm.value).subscribe(
        (resposta) => {
          console.log('Formulário Válido e Submetido:', this.subAreaForm.value);
          console.log('Resposta do servidor:', resposta);
        },
        (erro) => {
          console.error('Erro ao criar subárea:', erro);
        }
      );
    } else {
      console.warn('Formulário Inválido. Verifique os campos.');
      this.subAreaForm.markAllAsTouched();
    }
  }
}
