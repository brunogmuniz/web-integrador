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
import { DisciplinaCurriculoDTO } from "app-core/lib/dto/DisciplinaCurriculo.dto";

interface DisciplinaCurriculoFormView {
  readonly index: number;
  readonly control: FormGroup;
}

interface GrupoDisciplinaCurriculoFormView {
  readonly nome: string;
  readonly disciplinas: DisciplinaCurriculoFormView[];
}

interface GrupoDisciplinaCurriculoOpcaoView {
  readonly nome: string;
  readonly disciplinas: DisciplinaCurriculoDTO[];
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
  public listaDisciplinasCurriculoOpcoes: DisciplinaCurriculoDTO[] = [];
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
    this.listaDisciplinasCurriculoOpcoes = Array.isArray(disciplinasCurriculo) ? disciplinasCurriculo : [];

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

  public get gruposDisciplinasCurriculoView(): GrupoDisciplinaCurriculoFormView[] {
    const grupos = new Map<number | null, DisciplinaCurriculoFormView[]>();

    this.disciplinasCurriculo.controls.forEach((control, index) => {
      const semestre = this.normalizarSemestre(control.get('semestre')?.value);
      if (semestre === null) {
        return;
      }

      const disciplinas = grupos.get(semestre) || [];
      disciplinas.push({ index, control: control as FormGroup });
      grupos.set(semestre, disciplinas);
    });

    return Array.from(grupos.entries())
      .sort(([semestreA], [semestreB]) => {
        return Number(semestreA) - Number(semestreB);
      })
      .map(([semestre, disciplinas]) => ({
        nome: this.formatarSemestre(semestre as number),
        disciplinas
      }));
  }

  public get disciplinasCurriculoSemGrupoView(): DisciplinaCurriculoFormView[] {
    return this.disciplinasCurriculo.controls
      .map((control, index) => ({ index, control: control as FormGroup }))
      .filter(item => this.normalizarSemestre(item.control.get('semestre')?.value) === null);
  }

  public get gruposDisciplinasDisponiveisView(): GrupoDisciplinaCurriculoOpcaoView[] {
    return this.agruparDisciplinasCurriculo(this.listaDisciplinasCurriculoOpcoes);
  }

  public gruposDisciplinasDisponiveisPorItemView(index: number): GrupoDisciplinaCurriculoOpcaoView[] {
    return this.agruparDisciplinasCurriculo(
      this.listaDisciplinasCurriculoOpcoes.filter(opcao => !this.disciplinaCurriculoJaSelecionadaEmOutroItem(index, opcao))
    );
  }

  public disciplinasBaseDisponiveisPorItemView(index: number): DisciplinaDTO[] {
    return this.listaDisciplinas.filter(disciplina => !this.disciplinaJaSelecionadaEmOutroItem(index, disciplina));
  }

  public get possuiDisciplinasCurriculoAgrupadas(): boolean {
    return this.gruposDisciplinasDisponiveisView.length > 0;
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

  public aplicarDisciplinaCurriculo(index: number, opcao: DisciplinaCurriculoDTO | null): void {
    if (!opcao) {
      this.disciplinasCurriculo.at(index).patchValue({
        disciplina: null,
        semestre: null
      });
      return;
    }

    const disciplina = this.listaDisciplinas.find(d => d.id === opcao.disciplinaId || d.uuid === opcao.disciplinaUuid);
    if (disciplina && this.disciplinaJaSelecionadaEmOutroItem(index, disciplina)) {
      this.limparDisciplinaCurriculo(index);
      void Swal.fire('Aviso', 'Esta disciplina ja foi adicionada ao curriculo.', 'warning');
      return;
    }

    this.disciplinasCurriculo.at(index).patchValue({
      disciplina: disciplina || null,
      semestre: opcao.semestre,
      maxProfessoresPratica: opcao.maxProfessoresPratica ?? 1,
      maxProfessoresTeorica: opcao.maxProfessoresTeorica ?? 1,
      cargaHorariaTeorica: opcao.cargaHorariaTeorica ?? disciplina?.cargaHorariaTeorica ?? 0,
      cargaHorariaPratica: opcao.cargaHorariaPratica ?? disciplina?.cargaHorariaPratica ?? 0,
      tutoria: opcao.tutoria || false
    });
  }

  public aplicarDisciplinaBase(index: number, disciplina: DisciplinaDTO | null): void {
    if (!disciplina) {
      this.disciplinasCurriculo.at(index).patchValue({
        disciplina: null,
        semestre: null
      });
      return;
    }

    if (this.disciplinaJaSelecionadaEmOutroItem(index, disciplina)) {
      this.limparDisciplinaCurriculo(index);
      void Swal.fire('Aviso', 'Esta disciplina ja foi adicionada ao curriculo.', 'warning');
      return;
    }

    this.disciplinasCurriculo.at(index).patchValue({
      disciplina,
      cargaHorariaTeorica: disciplina.cargaHorariaTeorica ?? 0,
      cargaHorariaPratica: disciplina.cargaHorariaPratica ?? 0
    });
  }

  public encontrarDisciplinaBaseSelecionada(index: number): DisciplinaDTO | null {
    return this.disciplinasCurriculo.at(index).get('disciplina')?.value || null;
  }

  public encontrarDisciplinaCurriculoSelecionada(index: number): DisciplinaCurriculoDTO | null {
    const group = this.disciplinasCurriculo.at(index);
    const disciplina = group.get('disciplina')?.value as DisciplinaDTO | null;
    const semestre = this.normalizarSemestre(group.get('semestre')?.value);

    if (!disciplina || semestre === null) {
      return null;
    }

    return this.listaDisciplinasCurriculoOpcoes.find(opcao =>
      (opcao.disciplinaId === disciplina.id || opcao.disciplinaUuid === disciplina.uuid) &&
      opcao.semestre === semestre
    ) || null;
  }

  public removerDisciplinaCurriculo(index: number): void {
    this.disciplinasCurriculo.removeAt(index);
  }

  public formatarSemestre(semestre: number): string {
    return `${semestre}º Semestre`;
  }

  public trackByGrupo(_index: number, grupo: GrupoDisciplinaCurriculoFormView): string {
    return grupo.nome;
  }

  public trackByGrupoOpcao(_index: number, grupo: GrupoDisciplinaCurriculoOpcaoView): string {
    return grupo.nome;
  }

  public trackByDisciplinaCurriculo(_index: number, item: DisciplinaCurriculoFormView): number {
    return item.index;
  }

  public trackByDisciplinaCurriculoOpcao(_index: number, item: DisciplinaCurriculoDTO): string {
    return item.uuid || `${item.disciplinaId}-${item.semestre}`;
  }

  private normalizarSemestre(semestre: unknown): number | null {
    const valor = Number(semestre);
    return Number.isFinite(valor) && valor > 0 ? valor : null;
  }

  private limparDisciplinaCurriculo(index: number): void {
    this.disciplinasCurriculo.at(index).patchValue({
      disciplina: null,
      semestre: null
    });
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

  private disciplinaCurriculoJaSelecionadaEmOutroItem(index: number, opcao: DisciplinaCurriculoDTO): boolean {
    const chave = this.obterChaveDisciplinaCurriculo(opcao);
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

  private obterChaveDisciplinaCurriculo(opcao: DisciplinaCurriculoDTO): string | null {
    return opcao.disciplinaId != null ? `id:${opcao.disciplinaId}` : opcao.disciplinaUuid ? `uuid:${opcao.disciplinaUuid}` : null;
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

  private agruparDisciplinasCurriculo(disciplinas: DisciplinaCurriculoDTO[]): GrupoDisciplinaCurriculoOpcaoView[] {
    const regulares = disciplinas
      .filter(d => d.tipoDisciplina !== 'DCG' && this.normalizarSemestre(d.semestre) !== null)
      .sort((a, b) => Number(a.semestre || 0) - Number(b.semestre || 0));

    const dcgs = disciplinas.filter(d => d.tipoDisciplina === 'DCG');
    const grupos: GrupoDisciplinaCurriculoOpcaoView[] = [];
    const semestresUnicos = Array.from(new Set(regulares.map(d => d.semestre)));

    semestresUnicos.forEach(semestre => {
      grupos.push({
        nome: this.formatarSemestre(semestre),
        disciplinas: regulares.filter(d => d.semestre === semestre)
      });
    });

    if (dcgs.length > 0) {
      grupos.push({ nome: 'DCG', disciplinas: dcgs });
    }

    return grupos;
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

  public compararCursos(c1: any, c2: any): boolean {
    if (c1 && c2 && c1.id && c2.id) return c1.id === c2.id;
    return c1 && c2 ? c1.uuid === c2.uuid : c1 === c2;
  }

  public compararDisciplinas(d1: any, d2: any): boolean {
    if (d1 && d2 && d1.id && d2.id) return d1.id === d2.id;
    return d1 && d2 ? d1.uuid === d2.uuid : d1 === d2;
  }
}
