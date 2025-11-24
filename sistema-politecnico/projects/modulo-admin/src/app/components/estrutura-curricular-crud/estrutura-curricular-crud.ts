import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  EstruturaCurricularService,
  EstruturaCurricularDTO,
  OfertaDisciplinaDTO,
  FormInput,
  CursoService,
  DisciplinaService,
  CursoDTO,
  DisciplinaDTO
} from 'shared-core';

interface PeriodoVisual {
  periodos: number;
  semestre: number;
}
interface OfertaVisual {
  disciplinaId: number;
  disciplinaNome: string;
  periodosLista: PeriodoVisual[];
}

@Component({
  selector: 'app-estrutura-curricular-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormInput],
  providers: [EstruturaCurricularService, CursoService, DisciplinaService],
  templateUrl: './estrutura-curricular-crud.html',
  styleUrls: ['./estrutura-curricular-crud.scss']
})
export class EstruturaCurricularCrud implements OnInit {

  estruturaForm!: FormGroup;
  periodoForm!: FormGroup;

  exibirFormOferta: boolean = false;
  erroSemestreDuplicado: boolean = false;

  cursosDisponiveis: CursoDTO[] = [];
  listaDisciplinas: DisciplinaDTO[] = [];

  ofertasAdicionadas: OfertaVisual[] = [];
  periodosTemporarios: PeriodoVisual[] = [];

  ofertaAtualControl = new FormControl(null);

  constructor(
    private fb: FormBuilder,
    private service: EstruturaCurricularService,
    private cursoService: CursoService,
    private disciplinaService: DisciplinaService
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.carregarListasAuxiliares();
  }

  initForms(): void {
    this.estruturaForm = this.fb.group({
      idCurso: [null, Validators.required],
      codigo: ['', Validators.required],
      ano: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]]
    });

    this.periodoForm = this.fb.group({
      periodos: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      semestre: [null, Validators.required]
    });
  }

  get c() { return this.estruturaForm.controls as { [key: string]: FormControl }; }
  get p() { return this.periodoForm.controls as { [key: string]: FormControl }; }

  carregarListasAuxiliares() {
    this.cursoService.listarTodos().subscribe({
      next: (dados) => {
        this.cursosDisponiveis = dados;
      },
      error: (err) => console.error('Erro ao carregar cursos', err)
    });

    this.disciplinaService.listarTodos().subscribe({
      next: (dados) => {
        this.listaDisciplinas = dados;
      },
      error: (err) => console.error('Erro ao carregar disciplinas', err)
    });
  }

  iniciarNovaOferta() {
    this.exibirFormOferta = true;
    this.ofertaAtualControl.reset();
    this.periodosTemporarios = [];
  }

  cancelarOferta() {
    this.exibirFormOferta = false;
    this.ofertaAtualControl.reset();
    this.periodosTemporarios = [];
  }

  confirmarOferta() {
    const disciplina: any = this.ofertaAtualControl.value;
    if (!disciplina) return;

    this.ofertasAdicionadas.push({
      disciplinaId: disciplina.id,
      disciplinaNome: disciplina.nome,
      periodosLista: [...this.periodosTemporarios]
    });

    this.cancelarOferta();
  }

  removerOferta(index: number) {
    this.ofertasAdicionadas.splice(index, 1);
  }

  prepararModalPeriodo() {
    this.periodoForm.reset();
    this.erroSemestreDuplicado = false;
  }

  adicionarPeriodoAoGrid() {
    if (this.periodoForm.invalid) return;

    const val = this.periodoForm.value;
    const novoPeriodo: PeriodoVisual = {
      periodos: Number(val.periodos),
      semestre: Number(val.semestre)
    };

    if (this.periodosTemporarios.some(p => p.semestre === novoPeriodo.semestre)) {
      this.erroSemestreDuplicado = true;
      return;
    }

    this.periodosTemporarios.push(novoPeriodo);

    document.getElementById('btn-close-modal')?.click();
  }

  removerPeriodoTemporario(index: number) {
    this.periodosTemporarios.splice(index, 1);
  }

  onSubmit() {
    if (this.estruturaForm.invalid) {
      this.estruturaForm.markAllAsTouched();
      return;
    }

    const formVal = this.estruturaForm.value;

    const listaOfertasDTO: OfertaDisciplinaDTO[] = [];

    this.ofertasAdicionadas.forEach(oferta => {
      oferta.periodosLista.forEach(periodo => {
        listaOfertasDTO.push({
          idDisciplina: oferta.disciplinaId,
          semestre: periodo.semestre,
          periodos: periodo.periodos
        });
      });
    });

    const dtoEnvio: EstruturaCurricularDTO = {
      idCurso: formVal.idCurso,
      codigo: formVal.codigo,
      ano: String(formVal.ano),
      ativo: true,
      ofertas: listaOfertasDTO
    };

    this.service.create(dtoEnvio).subscribe({
      next: (res) => {
        console.log('Sucesso:', res);
        this.estruturaForm.reset();
        this.ofertasAdicionadas = [];
        this.cancelarOferta();
      },
      error: (err) => console.error('Erro:', err)
    });
  }

  voltar() {
    window.history.back();
  }
}
