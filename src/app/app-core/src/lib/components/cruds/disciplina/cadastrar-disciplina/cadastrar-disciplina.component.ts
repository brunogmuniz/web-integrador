import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { DisciplinaService, SubareaConhecimentoService, SubareaConhecimentoDTO, DisciplinaDTO, SelectOption } from "app-core";

@Component({
  selector: 'app-cadastrar-disciplina',
  templateUrl: './cadastrar-disciplina.component.html',
  styleUrls: ['./cadastrar-disciplina.component.scss']
})
export class CadastrarDisciplinaComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public subareas: SubareaConhecimentoDTO[] = [];
  public opcoesSubareas: SelectOption[] = [];
  public opcoesTipoDisciplina: SelectOption[] = [
    { id: 'Regular', label: 'Regular' },
    { id: 'DCG', label: 'DCG' }
  ];
  public opcoesClassificacao: SelectOption[] = [
    { id: 'Acumulativa total', label: 'Acumulativa total' },
    { id: 'Acumulativa parcial', label: 'Acumulativa parcial' },
    { id: 'Estágio não supervisionado', label: 'Estágio não supervisionado' },
    { id: 'Estágio supervisionado', label: 'Estágio supervisionado' },
    { id: 'Trabalho de conclusão de curso', label: 'Trabalho de conclusão de curso' }
  ];
  public uuidDisciplina?: string;
  public loading: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private disciplinaService: DisciplinaService,
    private subareaService: SubareaConhecimentoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nome: [null, [Validators.required, Validators.minLength(3)]],
      codigoDisciplina: [null, Validators.required],
      numero: [null],
      classificacao: [null],
      subareaId: [null, Validators.required],
      cargaHorariaTeorica: [0, [Validators.required, Validators.min(0)]],
      cargaHorariaPratica: [0, [Validators.required, Validators.min(0)]],
      cargaHoraria: [{ value: 0, disabled: true }],
      tipoDisciplina: [null, Validators.required],
      ead: [false]
    });
  }

  ngOnInit(): void {
    this.configurarCalculoAutomatico();

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const uuid = params['id'] || params['uuid'];
      if (uuid) {
        this.uuidDisciplina = uuid;
      }
      this.carregarDadosIniciais(this.uuidDisciplina);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public get tituloCard(): string {
    return this.uuidDisciplina ? 'Editar Disciplina' : 'Nova Disciplina';
  }

  private carregarDadosIniciais(uuid?: string): void {
    this.loading = true;

    const subareasReq$ = this.subareaService.findAll(0, 500);
    const disciplinaReq$ = uuid ? this.disciplinaService.findById(uuid) : of(null);

    forkJoin({
      subareas: subareasReq$,
      disciplina: disciplinaReq$
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.subareas = res.subareas.conteudo || [];
          this.opcoesSubareas = this.subareas.map(subarea => ({
            id: subarea.id as number,
            label: subarea.nome || ''
          }));

          if (res.disciplina) {
            this.preencherFormulario(res.disciplina);
          }
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          console.error('Erro ao carregar dados da tela:', err);
          void Swal.fire('Erro', 'Não foi possível carregar as informações do servidor.', 'error');
          void this.router.navigate(['/disciplina/visualizar']);
        }
      });
  }

  private preencherFormulario(disciplina: DisciplinaDTO): void {
    this.form.patchValue(disciplina);
    this.form.get('cargaHoraria')?.setValue(disciplina.cargaHoraria || 0, { emitEvent: false });
  }

  private configurarCalculoAutomatico(): void {
    const ctrlTeorica = this.form.get('cargaHorariaTeorica');
    const ctrlPratica = this.form.get('cargaHorariaPratica');

    if (!ctrlTeorica || !ctrlPratica) return;

    ctrlTeorica.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.atualizarCargaTotal());
    ctrlPratica.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.atualizarCargaTotal());
  }

  private atualizarCargaTotal(): void {
    const teorica = Number(this.form.get('cargaHorariaTeorica')?.value) || 0;
    const pratica = Number(this.form.get('cargaHorariaPratica')?.value) || 0;
    this.form.get('cargaHoraria')?.setValue(teorica + pratica, { emitEvent: false });
  }

  public salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      void Swal.fire('Aviso', 'Preencha todos os campos obrigatórios em vermelho.', 'warning');
      return;
    }

    const formValue = this.form.getRawValue();
    const payload: DisciplinaDTO = {
      ...formValue,
      uuid: this.uuidDisciplina,
    };

    this.loading = true;
    const requisicao$ = this.uuidDisciplina
      ? this.disciplinaService.update(this.uuidDisciplina, payload)
      : this.disciplinaService.create(payload);

    requisicao$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.loading = false;
        void Swal.fire('Sucesso', 'Disciplina salva com sucesso!', 'success');
        void this.router.navigate(['/disciplina/visualizar']);
      },
      error: (err: any) => {
        this.loading = false;
        const msg = err.error?.message || 'Erro crítico ao salvar disciplina.';
        console.error('Erro na submissão:', err);
        void Swal.fire('Erro', msg, 'error');
      }
    });
  }

  public cancelar(): void {
    void this.router.navigate(['/disciplina/visualizar']);
  }
}
