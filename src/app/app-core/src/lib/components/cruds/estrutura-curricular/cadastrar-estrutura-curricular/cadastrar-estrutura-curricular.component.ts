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
import { SelectOption, SelectOptionValue } from 'app-core';

interface DisciplinaCurriculoFormView {
  readonly index: number;
  readonly control: FormGroup;
  readonly nomeGrupo?: string;
}

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
  public opcoesCursos: SelectOption[] = [];
  public opcoesSemestre: SelectOption[] = this.listaOpcoesSemestre.map(semestre => ({
    id: semestre,
    label: this.formatarSemestre(semestre)
  }));
  public isEdicao: boolean = false;
  public loading: boolean = false;
  private destroy$ = new Subject<void>();
  private opcoesDisciplinasBaseCache = new WeakMap<FormGroup, { chave: string; opcoes: SelectOption[] }>();

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
          this.atualizarOpcoesCursos();

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

  public get disciplinasCurriculoLinhaView(): DisciplinaCurriculoFormView[] {
    const semestresRenderizados = new Set<number>();

    return this.disciplinasCurriculo.controls
      .map((control, index) => ({ index, control: control as FormGroup }))
      .sort((itemA, itemB) => {
        const semestreA = this.normalizarSemestre(itemA.control.get('semestre')?.value);
        const semestreB = this.normalizarSemestre(itemB.control.get('semestre')?.value);

        if (semestreA === null && semestreB === null) {
          return itemA.index - itemB.index;
        }

        if (semestreA === null) {
          return -1;
        }

        if (semestreB === null) {
          return 1;
        }

        return semestreA === semestreB ? itemA.index - itemB.index : semestreA - semestreB;
      })
      .map(item => {
        const semestre = this.normalizarSemestre(item.control.get('semestre')?.value);
        if (semestre === null || semestresRenderizados.has(semestre)) {
          return item;
        }

        semestresRenderizados.add(semestre);
        return {
          ...item,
          nomeGrupo: this.formatarSemestre(semestre)
        };
      });
  }

  public disciplinasBaseDisponiveisPorItemView(index: number): DisciplinaDTO[] {
    return this.listaDisciplinas.filter(disciplina => !this.disciplinaJaSelecionadaEmOutroItem(index, disciplina));
  }

  public opcoesDisciplinasBasePorItem(group: FormGroup): SelectOption[] {
    const chave = this.obterChaveOpcoesDisciplinasBase(group);
    const cache = this.opcoesDisciplinasBaseCache.get(group);
    if (cache?.chave === chave) {
      return cache.opcoes;
    }

    const index = this.disciplinasCurriculo.controls.indexOf(group);
    const opcoes = this.disciplinasBaseDisponiveisPorItemView(index).map(disciplina => ({
      id: this.obterChaveDisciplina(disciplina),
      label: disciplina.nome || ''
    })).filter((opcao): opcao is SelectOption<string> => opcao.id !== null);

    this.opcoesDisciplinasBaseCache.set(group, { chave, opcoes });
    return opcoes;
  }

  public adicionarDisciplinaCurriculo(): void {
    this.adicionarDisciplinaCurriculoComDados(null);
  }

  public adicionarDisciplinaCurriculoComDados(dados: any | null): void {
    const disciplinaChave = this.obterChaveDisciplina(dados?.disciplinaObj);
    const group = this.fb.group({
      id: [dados?.id || null],
      uuid: [dados?.uuid || null],
      disciplina: [dados?.disciplinaObj || null, Validators.required],
      disciplinaChave: [disciplinaChave, Validators.required],
      semestre: [dados?.semestre || null, Validators.required],
      maxProfessoresPratica: [dados?.maxProfessoresPratica ?? dados?.numProfessoresPratica ?? 1, [Validators.required, Validators.min(0)]],
      maxProfessoresTeorica: [dados?.maxProfessoresTeorica ?? dados?.numProfessoresTeorica ?? 1, [Validators.required, Validators.min(0)]],
      cargaHorariaTeorica: [dados?.cargaHorariaTeorica ?? 0, [Validators.required, Validators.min(0)]],
      cargaHorariaPratica: [dados?.cargaHorariaPratica ?? 0, [Validators.required, Validators.min(0)]],
      tutoria: [dados?.tutoria || false]
    });
    this.disciplinasCurriculo.push(group);
    this.acompanharDisciplinaChave(group);
  }

  public aplicarDisciplinaBase(group: FormGroup, valorDisciplina: SelectOptionValue): void {
    const index = this.disciplinasCurriculo.controls.indexOf(group);
    if (index < 0) {
      return;
    }

    const disciplina = this.encontrarDisciplinaPorChave(valorDisciplina);

    if (!disciplina) {
      group.patchValue({
        disciplina: null,
        disciplinaChave: null
      }, { emitEvent: false });
      return;
    }

    if (this.disciplinaJaSelecionadaEmOutroItem(index, disciplina)) {
      this.limparDisciplinaCurriculo(index);
      void Swal.fire('Aviso', 'Esta disciplina ja foi adicionada ao curriculo.', 'warning');
      return;
    }

    group.patchValue({
      disciplina,
      disciplinaChave: this.obterChaveDisciplina(disciplina),
      cargaHorariaTeorica: disciplina.cargaHorariaTeorica ?? 0,
      cargaHorariaPratica: disciplina.cargaHorariaPratica ?? 0
    }, { emitEvent: false });
  }

  public removerDisciplinaCurriculo(index: number): void {
    this.disciplinasCurriculo.removeAt(index);
  }

  public formatarSemestre(semestre: number): string {
    return `${semestre}º Semestre`;
  }

  public trackByDisciplinaCurriculo(_index: number, item: DisciplinaCurriculoFormView): FormGroup {
    return item.control;
  }

  private normalizarSemestre(semestre: unknown): number | null {
    const valor = Number(semestre);
    return Number.isFinite(valor) && valor > 0 ? valor : null;
  }

  private limparDisciplinaCurriculo(index: number): void {
    this.disciplinasCurriculo.at(index).patchValue({
      disciplina: null,
      disciplinaChave: null,
      semestre: null
    }, { emitEvent: false });
  }

  private acompanharDisciplinaChave(group: FormGroup): void {
    group.get('disciplinaChave')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(valorDisciplina => this.aplicarDisciplinaBase(group, valorDisciplina));
  }

  private obterChaveOpcoesDisciplinasBase(group: FormGroup): string {
    const index = this.disciplinasCurriculo.controls.indexOf(group);
    const chavesSelecionadas = this.disciplinasCurriculo.controls
      .map((control, controlIndex) => {
        const prefixoLinhaAtual = controlIndex === index ? 'atual' : 'outra';
        return `${prefixoLinhaAtual}:${this.obterChaveDisciplina(control.get('disciplina')?.value) || ''}`;
      })
      .join('|');

    return `${this.listaDisciplinas.length}:${index}:${chavesSelecionadas}`;
  }

  private atualizarOpcoesCursos(): void {
    this.opcoesCursos = this.listaCursos.map(curso => ({
      id: curso,
      label: `${curso.nome} (${curso.sigla})`
    }));
  }

  private disciplinaJaSelecionadaEmOutroItem(index: number, disciplina: DisciplinaDTO): boolean {
    const chave = this.obterChaveDisciplina(disciplina);
    if (!chave) {
      return false;
    }

    return this.disciplinasCurriculo.controls.some((control, controlIndex) => {
      if (controlIndex === index) {
        return false;
      }

      return this.obterChaveDisciplina(control.get('disciplina')?.value) === chave;
    });
  }

  private obterChaveDisciplina(disciplina: DisciplinaDTO | null | undefined): string | null {
    if (!disciplina) {
      return null;
    }

    return disciplina.id != null ? `id:${disciplina.id}` : disciplina.uuid ? `uuid:${disciplina.uuid}` : null;
  }

  private encontrarDisciplinaPorChave(valorDisciplina: SelectOptionValue): DisciplinaDTO | null {
    if (typeof valorDisciplina !== 'string') {
      return null;
    }

    return this.listaDisciplinas.find(disciplina => this.obterChaveDisciplina(disciplina) === valorDisciplina) || null;
  }

  private encontrarNomeDisciplinaDuplicada(): string | null {
    const selecionadas = new Map<string, string>();

    for (const control of this.disciplinasCurriculo.controls) {
      const disciplina = control.get('disciplina')?.value as DisciplinaDTO | null;
      const chave = this.obterChaveDisciplina(disciplina);
      if (!chave) {
        continue;
      }

      if (selecionadas.has(chave)) {
        return disciplina?.nome || selecionadas.get(chave) || 'Disciplina';
      }

      selecionadas.set(chave, disciplina?.nome || 'Disciplina');
    }

    return null;
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

    const disciplinaDuplicada = this.encontrarNomeDisciplinaDuplicada();
    if (disciplinaDuplicada) {
      void Swal.fire('Aviso', `A disciplina "${disciplinaDuplicada}" ja foi adicionada ao curriculo.`, 'warning');
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

}
