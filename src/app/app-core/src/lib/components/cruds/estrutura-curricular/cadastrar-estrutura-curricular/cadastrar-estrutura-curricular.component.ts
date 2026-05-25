import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from "sweetalert2";
import { EstruturaCurricularService } from "app-core/lib/services/estrutura-curricular-service";
import { CursoService } from "app-core/lib/services/curso-service";
import { DisciplinaService } from "app-core/lib/services/disciplina-service";
import { EstruturaCurricularDTO } from "app-core/lib/dto/EstruturaCurricular.dto";
import { CursoDTO } from "app-core/lib/dto/Curso.dto";
import { DisciplinaDTO } from "app-core/lib/dto/Disciplina.dto";

@Component({
  selector: 'app-cadastrar-estrutura-curricular',
  templateUrl: './cadastrar-estrutura-curricular.component.html',
  styleUrls: ['../estrutura-curricular.component.scss']
})
export class CadastrarEstruturaCurricularComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public listaCursos: CursoDTO[] = [];
  public listaDisciplinas: DisciplinaDTO[] = [];
  public listaOpcoesSemestre: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  public isEdicao: boolean = false;
  public loading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private service: EstruturaCurricularService,
    private cursoService: CursoService,
    private disciplinaService: DisciplinaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      uuid: [undefined],
      codigo: ['', Validators.required],
      ano: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      curso: [null, Validators.required],
      ativo: [true],
      disciplinasCurriculo: this.fb.array([])
    });
  }

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('id') || this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.isEdicao = true;
    }
    this.carregarDependencias(uuid);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private carregarDependencias(uuidEstrutura: string | null): void {
    this.loading = true;

    const reqCursos$ = this.cursoService.findAll(0, 500);
    const reqDisciplinas$ = this.disciplinaService.findAll(0, 500);
    const reqEstrutura$ = uuidEstrutura ? this.service.findById(uuidEstrutura) : of(null);

    forkJoin({
      cursos: reqCursos$,
      disciplinas: reqDisciplinas$,
      estrutura: reqEstrutura$
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.listaCursos = (res.cursos as any)?.conteudo || res.cursos || [];
          this.listaDisciplinas = (res.disciplinas as any)?.conteudo || res.disciplinas || [];

          if (res.estrutura) {
            this.preencherFormulario(res.estrutura);
          }
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          console.error('Erro no carregamento paralelo:', err);
          void Swal.fire('Erro', 'Falha de comunicação com o servidor ao carregar dados auxiliares.', 'error');
          this.cancelar();
        }
      });
  }

  private preencherFormulario(res: any): void {
    this.disciplinasCurriculo.clear();

    let cursoEncontrado = this.listaCursos.find(c => c.uuid === res.cursoUuid);
    if (!cursoEncontrado && res.cursoId) {
      cursoEncontrado = this.listaCursos.find(c => c.id === res.cursoId);
    }

    this.form.patchValue({
      uuid: res.uuid,
      codigo: res.codigo,
      ano: res.ano,
      curso: cursoEncontrado,
      ativo: res.ativo
    });

    const disciplinasCurriculo = res.disciplinasCurriculo || res.ofertas || [];
    if (Array.isArray(disciplinasCurriculo)) {
      disciplinasCurriculo.forEach((o: any) => {
        let discObj = this.listaDisciplinas.find(d => d.uuid === o.disciplinaUuid);
        if (!discObj && o.disciplinaId) {
          discObj = this.listaDisciplinas.find(d => d.id === o.disciplinaId);
        }
        this.adicionarDisciplinaCurriculoComDados({ ...o, disciplinaObj: discObj });
      });
    }
  }

  get disciplinasCurriculo(): FormArray {
    return this.form.get('disciplinasCurriculo') as FormArray;
  }

  public adicionarDisciplinaCurriculo(): void {
    this.adicionarDisciplinaCurriculoComDados(null);
  }

  public adicionarDisciplinaCurriculoComDados(dados: any | null): void {
    const group = this.fb.group({
      id: [dados?.id || null],
      uuid: [dados?.uuid || null],
      disciplina: [dados?.disciplinaObj || null, Validators.required],
      semestre: [dados?.semestre || null, Validators.required],
      maxProfessoresPratica: [dados?.maxProfessoresPratica ?? dados?.numProfessoresPratica ?? 1, [Validators.required, Validators.min(0)]],
      maxProfessoresTeorica: [dados?.maxProfessoresTeorica ?? dados?.numProfessoresTeorica ?? 1, [Validators.required, Validators.min(0)]],
      cargaHorariaTeorica: [dados?.cargaHorariaTeorica ?? 0, [Validators.required, Validators.min(0)]],
      cargaHorariaPratica: [dados?.cargaHorariaPratica ?? 0, [Validators.required, Validators.min(0)]],
      tutoria: [dados?.tutoria || false]
    });
    this.disciplinasCurriculo.push(group);
  }

  public removerDisciplinaCurriculo(index: number): void {
    this.disciplinasCurriculo.removeAt(index);
  }

  public salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      void Swal.fire('Aviso', 'Preencha todos os campos obrigatórios corretamente.', 'warning');
      return;
    }

    const formValue = this.form.value;

    if (!formValue.curso?.id) {
      void Swal.fire('Erro', 'O Curso selecionado não possui ID válido. Recarregue a página.', 'error');
      return;
    }

    try {
      const dto: EstruturaCurricularDTO = {
        ano: formValue.ano,
        codigo: formValue.codigo,
        ativo: formValue.ativo,
        cursoId: formValue.curso.id,
        disciplinasCurriculo: this.disciplinasCurriculo.value.map((o: any) => {
          if (!o.disciplina?.id) {
            throw new Error('A disciplina selecionada não possui ID válido. Remova e adicione novamente.');
          }
          return {
            id: o.id,
            uuid: o.uuid,
            disciplinaId: o.disciplina.id,
            disciplinaUuid: o.disciplina.uuid,
            semestre: o.semestre,
            maxProfessoresPratica: o.maxProfessoresPratica,
            maxProfessoresTeorica: o.maxProfessoresTeorica,
            cargaHorariaTeorica: o.cargaHorariaTeorica,
            cargaHorariaPratica: o.cargaHorariaPratica,
            tutoria: o.tutoria
          };
        })
      };

      const uuid = this.form.get('uuid')?.value;
      this.loading = true;

      const requisicao$ = (this.isEdicao && uuid)
        ? this.service.update(uuid, dto)
        : this.service.save(dto);

      requisicao$.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.loading = false;
          void Swal.fire({
            title: 'Sucesso!',
            text: `Estrutura Curricular ${this.isEdicao ? 'atualizada' : 'cadastrada'} com sucesso!`,
            icon: 'success',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#1BC5BD'
          }).then(() => this.cancelar());
        },
        error: (err: any) => {
          this.loading = false;
          console.error('Erro na submissão:', err);
          void Swal.fire('Erro', 'Ocorreu um erro ao salvar a estrutura no servidor.', 'error');
        }
      });

    } catch (e: any) {
      this.loading = false;
      void Swal.fire('Erro de Validação', e.message, 'error');
    }
  }

  public cancelar(): void {
    void this.router.navigate(['/estrutura-curricular/visualizar']);
  }

  public compararCursos(c1: any, c2: any): boolean {
    if (c1 && c2 && c1.id && c2.id) return c1.id === c2.id;
    return c1 && c2 ? c1.uuid === c2.uuid : c1 === c2;
  }

  public compararDisciplinas(d1: any, d2: any): boolean {
    if (d1 && d2 && d1.id && d2.id) return d1.id === d2.id;
    return d1 && d2 ? d1.uuid === d2.uuid : d1 === d2;
  }
}
