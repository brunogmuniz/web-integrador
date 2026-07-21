import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import {
  CursoDTO,
  CursoService,
  DisciplinaCurriculoDTO,
  DocenteDTO,
  DocenteService,
  EstruturaCurricularDTO,
  EstruturaCurricularService,
  OfertaDTO,
  OfertaService,
  SelectOption
} from 'app-core';

export interface DisciplinaOfertaItemDTO {
  uuidDisciplina: string;
  uuidDisciplinaCurriculo: string;
  docentesTeorica?: string[];
  docentesPratica?: string[];
}

export interface OfertaSalvarDTO {
  uuidOferta: string;
  uuidCurso?: string;
  uuidEstruturaCurricular: string;
  disciplinas: DisciplinaOfertaItemDTO[];
}

export interface DisciplinaOfertaView extends DisciplinaCurriculoDTO {
  docentesTeorica: string[];
  docentesPratica: string[];
  docenteTeoricaSelecionado: string | null;
  docentePraticaSelecionado: string | null;
}

export interface GrupoDisciplina<T extends DisciplinaCurriculoDTO> {
  readonly nome: string;
  readonly disciplinas: T[];
}

interface DisciplinaOfertaEdicaoContexto {
  uuidOferta: string;
  uuidCurso: string;
  uuidEstruturaCurricular: string;
}

const DISCIPLINA_OFERTA_EDICAO_CONTEXTO_KEY = 'disciplinaOfertaEdicaoContexto';

@Component({
  selector: 'app-cadastrar-disciplina-oferta',
  templateUrl: './cadastrar-disciplina-oferta.component.html',
  styleUrls: ['../disciplina-oferta.component.scss']
})
export class CadastrarDisciplinaOfertaComponent implements OnInit, OnDestroy {
  public form!: FormGroup;
  public ofertas: OfertaDTO[] = [];
  public cursos: CursoDTO[] = [];
  public curriculos: EstruturaCurricularDTO[] = [];
  public docentes: DocenteDTO[] = [];

  public disciplinasDisponiveis: DisciplinaCurriculoDTO[] = [];
  public disciplinasSelecionadas: DisciplinaOfertaView[] = [];
  public disciplinaSelecionadaUuid: string | null = null;
  public loading = false;
  public importandoDisciplinas = false;
  public carregandoOfertasImportacao = false;
  public carregandoCombinacao = false;
  public combinacaoExistente = false;
  public modalImportacaoAberto = false;
  public ofertaOrigemImportacaoUuid = '';

  public gruposDisponiveisView: GrupoDisciplina<DisciplinaCurriculoDTO>[] = [];
  public gruposSelecionadasView: GrupoDisciplina<DisciplinaOfertaView>[] = [];
  public opcoesOfertas: SelectOption[] = [];
  public opcoesCursos: SelectOption[] = [];
  public opcoesCurriculos: SelectOption[] = [];
  public opcoesDisciplinasDisponiveis: SelectOption[] = [];
  public opcoesOfertasImportacao: SelectOption[] = [];

  private destroy$ = new Subject<void>();
  private ofertaEdicaoUuid?: string;
  private rotaRetornoAposSalvar?: string[];
  private opcoesDocentesDisponiveisCache = new Map<string, SelectOption[]>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ofertaService: OfertaService,
    private cursoService: CursoService,
    private estruturaService: EstruturaCurricularService,
    private docenteService: DocenteService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarDadosIniciais();
    this.observarMudancasFormulario();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private inicializarFormulario(): void {
    this.form = this.fb.group({
      oferta:    [null, Validators.required],
      curso:     [null, Validators.required],
      curriculo: [null, Validators.required]
    });
  }

  private carregarDadosIniciais(): void {
    this.ofertaEdicaoUuid = this.route.snapshot.paramMap.get('uuid') || undefined;

    forkJoin({
      ofertas:  this.ofertaService.buscarParaSelecao(),
      cursos:   this.cursoService.findAll(0, 500),
      docentes: this.docenteService.findAll(0, 500)
    }).subscribe({
      next: (res) => {
        this.ofertas  = (res.ofertas || []).filter(o => o.ativo || o.uuid === this.ofertaEdicaoUuid);
        this.cursos   = (res.cursos.conteudo   || []).filter(c => c.ativo !== false);
        this.docentes =  res.docentes.conteudo || [];
        this.opcoesDocentesDisponiveisCache.clear();
        this.atualizarOpcoesOfertasECursos();
        if (this.ofertaEdicaoUuid) {
          this.carregarOfertaParaEdicao(this.ofertaEdicaoUuid);
        }
      },
      error: (err) => {
        console.error('Falha ao carregar dependências da tela', err);
        void Swal.fire('Erro', 'Não foi possível carregar os dados auxiliares.', 'error');
      }
    });
  }

  private observarMudancasFormulario(): void {
    this.form.get('oferta')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((oferta: OfertaDTO | null) => this.lidarComMudancaDeOferta(oferta));

    this.form.get('curso')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((curso: CursoDTO | null) => this.lidarComMudancaDeCurso(curso));

    this.form.get('curriculo')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((curriculo: EstruturaCurricularDTO | null) => this.lidarComMudancaDeCurriculo(curriculo));
  }

  private lidarComMudancaDeOferta(oferta: OfertaDTO | null): void {
    this.ofertaOrigemImportacaoUuid = '';
    this.atualizarOpcoesOfertasImportacao();

    if (!oferta?.uuid) {
      this.disciplinasSelecionadas = [];
      this.combinacaoExistente = false;
      this.atualizarViews();
      return;
    }

    this.carregarDisciplinasDaCombinacaoAtual();
  }

  private lidarComMudancaDeCurso(curso: CursoDTO | null): void {
    this.curriculos = [];
    this.atualizarOpcoesCurriculos();
    this.resetarSelecaoDisciplinas();
    this.form.get('curriculo')?.setValue(null, { emitEvent: false });

    if (!curso?.id) return;

    this.estruturaService.findByCurso(curso.id).subscribe({
      next:  curriculos => {
        this.curriculos = (curriculos || []).filter(c => c.ativo);
        this.atualizarOpcoesCurriculos();
      },
      error: (err) => {
        console.error('Falha ao carregar currículos', err);
        void Swal.fire('Erro', 'Não foi possível carregar os currículos do curso.', 'error');
      }
    });
  }

  private lidarComMudancaDeCurriculo(curriculo: EstruturaCurricularDTO | null): void {
    this.resetarSelecaoDisciplinas();
    this.disciplinasDisponiveis = curriculo?.disciplinasCurriculo || [];
    this.atualizarViews();
    this.carregarDisciplinasDaCombinacaoAtual();
  }

  private carregarDisciplinasDaCombinacaoAtual(): void {
    const oferta = this.form.get('oferta')?.value as OfertaDTO | null;
    const curso = this.form.get('curso')?.value as CursoDTO | null;
    const curriculo = this.form.get('curriculo')?.value as EstruturaCurricularDTO | null;

    if (!oferta?.uuid || !curso?.uuid || !curriculo?.uuid) {
      return;
    }

    if (this.disciplinasDisponiveis.length === 0) {
      this.disciplinasSelecionadas = [];
      this.combinacaoExistente = false;
      this.atualizarViews();
      return;
    }

    this.carregandoCombinacao = true;
    this.ofertaService.buscarDisciplinasPorCombinacao(oferta.uuid, curso.uuid, curriculo.uuid).subscribe({
      next: lote => {
        this.disciplinasSelecionadas = this.montarDisciplinasSelecionadas(lote);
        this.combinacaoExistente = this.disciplinasSelecionadas.length > 0;
        this.carregandoCombinacao = false;
        this.atualizarViews();
      },
      error: err => {
        this.carregandoCombinacao = false;
        console.error('Falha ao carregar disciplinas ofertadas para a combinação selecionada', err);
        void Swal.fire('Erro', 'Não foi possível carregar as disciplinas ofertadas para esta combinação.', 'error');
      }
    });
  }

  private carregarOfertaParaEdicao(uuidOferta: string): void {
    this.ofertaService.buscarDisciplinas(uuidOferta).subscribe({
      next: lote => this.preencherOfertaParaEdicao(lote),
      error: err => {
        console.error('Falha ao carregar disciplinas ofertadas', err);
        void Swal.fire('Erro', 'Não foi possível carregar as disciplinas desta oferta.', 'error');
      }
    });
  }

  private preencherOfertaParaEdicao(lote: OfertaSalvarDTO): void {
    const contexto = this.getContextoEdicao(lote.uuidOferta);
    if (contexto) {
      this.rotaRetornoAposSalvar = ['/oferta/disciplinas', contexto.uuidOferta];
    }

    const oferta = this.ofertas.find(item => item.uuid === lote.uuidOferta);
    const uuidCurso = contexto?.uuidCurso || lote.uuidCurso;
    const uuidEstruturaCurricular = contexto?.uuidEstruturaCurricular || lote.uuidEstruturaCurricular;
    const curso = this.cursos.find(item => item.uuid === uuidCurso);

    if (oferta) {
      this.form.get('oferta')?.setValue(oferta, { emitEvent: false });
    }

    if (!curso?.id) {
      return;
    }

    this.form.get('curso')?.setValue(curso, { emitEvent: false });
    this.estruturaService.findByCurso(curso.id).subscribe({
      next: curriculos => {
        this.curriculos = (curriculos || []).filter(curriculo => curriculo.ativo || curriculo.uuid === uuidEstruturaCurricular);
        this.atualizarOpcoesCurriculos();
        const curriculo = this.curriculos.find(item => item.uuid === uuidEstruturaCurricular);
        if (!curriculo) {
          return;
        }

        this.form.get('curriculo')?.setValue(curriculo, { emitEvent: false });
        this.disciplinasDisponiveis = curriculo.disciplinasCurriculo || [];
        this.disciplinasSelecionadas = this.montarDisciplinasSelecionadas(lote);
        this.combinacaoExistente = this.disciplinasSelecionadas.length > 0;
        this.atualizarViews();
        this.limparContextoEdicao();
      },
      error: err => {
        console.error('Falha ao carregar currículos', err);
        void Swal.fire('Erro', 'Não foi possível carregar os currículos do curso.', 'error');
      }
    });
  }

  private getContextoEdicao(uuidOferta: string): DisciplinaOfertaEdicaoContexto | null {
    const contextoJson = sessionStorage.getItem(DISCIPLINA_OFERTA_EDICAO_CONTEXTO_KEY);
    if (!contextoJson) {
      return null;
    }

    try {
      const contexto = JSON.parse(contextoJson) as DisciplinaOfertaEdicaoContexto;
      return contexto.uuidOferta === uuidOferta ? contexto : null;
    } catch {
      this.limparContextoEdicao();
      return null;
    }
  }

  private limparContextoEdicao(): void {
    sessionStorage.removeItem(DISCIPLINA_OFERTA_EDICAO_CONTEXTO_KEY);
  }

  private montarDisciplinasSelecionadas(lote: OfertaSalvarDTO): DisciplinaOfertaView[] {
    return (lote.disciplinas || [])
      .map(item => {
        const disciplina = this.disciplinasDisponiveis.find(disponivel => disponivel.uuid === item.uuidDisciplinaCurriculo);
        if (!disciplina) {
          return undefined;
        }

        return {
          ...disciplina,
          docentesTeorica: item.docentesTeorica || [],
          docentesPratica: item.docentesPratica || [],
          docenteTeoricaSelecionado: null,
          docentePraticaSelecionado: null
        } as DisciplinaOfertaView;
      })
      .filter((item): item is DisciplinaOfertaView => !!item);
  }

  private resetarSelecaoDisciplinas(): void {
    this.disciplinasDisponiveis  = [];
    this.disciplinasSelecionadas = [];
    this.combinacaoExistente = false;
    this.atualizarViews();
  }

  public adicionarDisciplina(): void {
    if (!this.disciplinaSelecionadaUuid) return;

    const disciplina  = this.disciplinasDisponiveis.find(d => d.uuid === this.disciplinaSelecionadaUuid);
    const jaAdicionada = this.disciplinasSelecionadas.some(d => d.uuid === this.disciplinaSelecionadaUuid);

    if (!disciplina || jaAdicionada) return;

    const novaDisciplina: DisciplinaOfertaView = {
      ...disciplina,
      docentesTeorica:            [],
      docentesPratica:            [],
      docenteTeoricaSelecionado:  null,
      docentePraticaSelecionado:  null
    };

    this.disciplinasSelecionadas = [...this.disciplinasSelecionadas, novaDisciplina];
    this.disciplinaSelecionadaUuid = null;
    this.atualizarViews();
  }

  public abrirModalImportacao(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      void Swal.fire('Aviso', 'Selecione oferta, curso e currículo antes de importar disciplinas.', 'warning');
      return;
    }

    this.ofertaOrigemImportacaoUuid = '';
    this.modalImportacaoAberto = true;
    this.carregarOfertasParaImportacao();
  }

  public fecharModalImportacao(): void {
    if (this.importandoDisciplinas) {
      return;
    }

    this.modalImportacaoAberto = false;
  }

  public get ofertasDisponiveisParaImportacao(): OfertaDTO[] {
    const ofertaDestino = this.form.get('oferta')?.value as OfertaDTO | null;
    return this.ofertas
      .filter(oferta => oferta.uuid && oferta.uuid !== ofertaDestino?.uuid)
      .sort((a, b) => {
        const anoDiff = Number(b.ano) - Number(a.ano);
        if (anoDiff !== 0) {
          return anoDiff;
        }
        return Number(b.semestre) - Number(a.semestre);
      });
  }

  private carregarOfertasParaImportacao(): void {
    this.carregandoOfertasImportacao = true;
    this.atualizarOpcoesOfertasImportacao();

    this.ofertaService.findAll(0, 500)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          const ofertas = res.conteudo || [];
          this.ofertas = ofertas.filter(oferta => oferta.ativo || oferta.uuid === this.ofertaEdicaoUuid);
          this.atualizarOpcoesOfertasECursos();
          this.atualizarOpcoesOfertasImportacao();
          this.carregandoOfertasImportacao = false;
        },
        error: err => {
          this.carregandoOfertasImportacao = false;
          console.error('Falha ao carregar ofertas para importação', err);
          void Swal.fire('Erro', 'Não foi possível carregar as ofertas para importação.', 'error');
        }
      });
  }

  public opcoesDocentesDisponiveis(uuidsSelecionados: string[]): SelectOption[] {
    const chaveCache = this.obterChaveCacheDocentesDisponiveis(uuidsSelecionados);
    const opcoesCacheadas = this.opcoesDocentesDisponiveisCache.get(chaveCache);
    if (opcoesCacheadas) {
      return opcoesCacheadas;
    }

    const opcoes = this.getDocentesDisponiveis(uuidsSelecionados).map(docente => ({
      id: docente.uuid || null,
      label: docente.nome || ''
    }));
    this.opcoesDocentesDisponiveisCache.set(chaveCache, opcoes);
    return opcoes;
  }

  public importarDisciplinasDaOferta(): void {
    const ofertaDestino = this.form.get('oferta')?.value as OfertaDTO | null;
    const curso = this.form.get('curso')?.value as CursoDTO | null;
    const curriculo = this.form.get('curriculo')?.value as EstruturaCurricularDTO | null;

    if (!ofertaDestino?.uuid || !curso?.uuid || !curriculo?.uuid || !this.ofertaOrigemImportacaoUuid) {
      void Swal.fire('Aviso', 'Selecione oferta, curso, currículo e a oferta de origem para importar.', 'warning');
      return;
    }

    const ofertaOrigem = this.ofertasDisponiveisParaImportacao.find(oferta => oferta.uuid === this.ofertaOrigemImportacaoUuid);
    if (!ofertaOrigem?.uuid) {
      void Swal.fire('Aviso', 'Selecione uma oferta de origem válida para importar.', 'warning');
      return;
    }

    this.importandoDisciplinas = true;
    this.ofertaService.importarDisciplinasPorCombinacao(
      ofertaDestino.uuid,
      curso.uuid,
      curriculo.uuid,
      ofertaOrigem.uuid
    ).subscribe({
      next: () => {
        this.importandoDisciplinas = false;
        this.modalImportacaoAberto = false;
        this.ofertaOrigemImportacaoUuid = '';
        void Swal.fire('Sucesso', 'Disciplinas importadas com sucesso.', 'success');
        this.carregarDisciplinasDaCombinacaoAtual();
      },
      error: err => {
        this.importandoDisciplinas = false;
        const message = err?.error?.message || 'Não foi possível importar as disciplinas da oferta selecionada.';
        void Swal.fire('Erro', message, 'error');
      }
    });
  }

  public removerDisciplinaPorUuid(uuid?: string): void {
    if (!uuid) return;
    this.disciplinasSelecionadas = this.disciplinasSelecionadas.filter(d => d.uuid !== uuid);
    this.atualizarViews();
  }

  public adicionarDocente(disciplina: DisciplinaOfertaView, tipo: 'teorica' | 'pratica'): void {
    if (tipo === 'teorica') {
      const uuid = disciplina.docenteTeoricaSelecionado;
      if (!uuid || disciplina.docentesTeorica.includes(uuid) || this.limiteDocentesAtingido(disciplina, tipo)) return;
      disciplina.docentesTeorica = [...disciplina.docentesTeorica, uuid];
      disciplina.docenteTeoricaSelecionado = null;
    } else {
      const uuid = disciplina.docentePraticaSelecionado;
      if (!uuid || disciplina.docentesPratica.includes(uuid) || this.limiteDocentesAtingido(disciplina, tipo)) return;
      disciplina.docentesPratica = [...disciplina.docentesPratica, uuid];
      disciplina.docentePraticaSelecionado = null;
    }
    this.disciplinasSelecionadas = [...this.disciplinasSelecionadas];
    this.opcoesDocentesDisponiveisCache.clear();
    this.atualizarViews();
  }

  public removerDocente(disciplina: DisciplinaOfertaView, tipo: 'teorica' | 'pratica', uuid: string): void {
    if (tipo === 'teorica') {
      disciplina.docentesTeorica = disciplina.docentesTeorica.filter(u => u !== uuid);
    } else {
      disciplina.docentesPratica = disciplina.docentesPratica.filter(u => u !== uuid);
    }
    this.disciplinasSelecionadas = [...this.disciplinasSelecionadas];
    this.opcoesDocentesDisponiveisCache.clear();
    this.atualizarViews();
  }

  public getDocentesDisponiveis(uuidsSelecionados: string[]): DocenteDTO[] {
    return this.docentes.filter(d => !uuidsSelecionados.includes(d.uuid!));
  }

  private obterChaveCacheDocentesDisponiveis(uuidsSelecionados: string[]): string {
    return `${this.docentes.length}:${[...uuidsSelecionados].sort().join('|')}`;
  }

  public getLimiteDocentes(disciplina: DisciplinaOfertaView, tipo: 'teorica' | 'pratica'): number {
    const limite = tipo === 'teorica' ? disciplina.maxProfessoresTeorica : disciplina.maxProfessoresPratica;
    return Number(limite ?? 0);
  }

  public limiteDocentesAtingido(disciplina: DisciplinaOfertaView, tipo: 'teorica' | 'pratica'): boolean {
    const selecionados = tipo === 'teorica' ? disciplina.docentesTeorica : disciplina.docentesPratica;
    return selecionados.length >= this.getLimiteDocentes(disciplina, tipo);
  }

  public docenteSelectDesabilitado(disciplina: DisciplinaOfertaView, tipo: 'teorica' | 'pratica'): boolean {
    const uuidsSelecionados = tipo === 'teorica' ? disciplina.docentesTeorica : disciplina.docentesPratica;
    return this.limiteDocentesAtingido(disciplina, tipo)
      || this.opcoesDocentesDisponiveis(uuidsSelecionados).length === 0;
  }

  public getNomeDocente(uuid: string): string {
    return this.docentes.find(d => d.uuid === uuid)?.nome ?? uuid;
  }

  public salvar(): void {
    if (!this.isFormularioValido()) return;

    const payload = this.construirPayloadSalvamento();
    this.loading = true;

    this.ofertaService.salvarDisciplinas(payload).subscribe({
      next:  ()  => this.tratarSucessoSalvamento(),
      error: (err: any) => this.tratarErroSalvamento(err)
    });
  }

  private isFormularioValido(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      void Swal.fire('Aviso', 'Selecione oferta, curso, currículo e ao menos uma disciplina.', 'warning');
      return false;
    }

    if (this.disciplinasSelecionadas.length === 0) {
      void Swal.fire('Aviso', 'Nenhuma disciplina vinculada.', 'warning');
      return false;
    }

    const disciplinasInvalidas = this.disciplinasSelecionadas.filter(d =>
      d.docentesTeorica.length > this.getLimiteDocentes(d, 'teorica') ||
      d.docentesPratica.length > this.getLimiteDocentes(d, 'pratica')
    );

    if (disciplinasInvalidas.length > 0) {
      void Swal.fire('Aviso', 'A quantidade de docentes excede o limite definido na estrutura curricular.', 'warning');
      return false;
    }

    return true;
  }

  private construirPayloadSalvamento(): OfertaSalvarDTO {
    const oferta    = this.form.value.oferta    as OfertaDTO;
    const curso     = this.form.value.curso     as CursoDTO;
    const curriculo = this.form.value.curriculo as EstruturaCurricularDTO;

    const disciplinas: DisciplinaOfertaItemDTO[] = this.disciplinasSelecionadas.map(d => ({
      uuidDisciplina:         d.disciplinaUuid            || '',
      uuidDisciplinaCurriculo: d.uuid                     || '',
      docentesTeorica:         d.docentesTeorica,
      docentesPratica:         d.docentesPratica
    }));

    return {
      uuidOferta:              oferta.uuid    || '',
      uuidCurso:               curso.uuid     || '',
      uuidEstruturaCurricular: curriculo.uuid || '',
      disciplinas
    };
  }

  private tratarSucessoSalvamento(): void {
    this.loading = false;
    void Swal.fire('Sucesso', 'Disciplinas ofertadas com sucesso.', 'success').then(() => {
      void this.router.navigate(['/oferta/visualizar']);
    });
  }

  private tratarErroSalvamento(err: any): void {
    this.loading = false;
    console.error('Falha ao salvar disciplinas ofertadas', err);
    const message = err?.error?.message || 'Não foi possível salvar as disciplinas ofertadas. Tente novamente mais tarde.';
    void Swal.fire('Erro', message, 'error');
  }

  private atualizarViews(): void {
    const uuidsSelecionadas = new Set(this.disciplinasSelecionadas.map(disciplina => disciplina.uuid));
    const disciplinasDisponiveisParaAdicionar = this.disciplinasDisponiveis
      .filter(disciplina => !uuidsSelecionadas.has(disciplina.uuid));

    this.gruposDisponiveisView  = this.agruparDisciplinas(disciplinasDisponiveisParaAdicionar);
    this.gruposSelecionadasView = this.agruparDisciplinas(this.disciplinasSelecionadas);
    this.atualizarOpcoesDisciplinasDisponiveis();
    this.atualizarOpcoesOfertasImportacao();
  }

  private atualizarOpcoesOfertasECursos(): void {
    this.opcoesOfertas = this.ofertas.map(oferta => ({
      id: oferta,
      label: `${oferta.ano}/${oferta.semestre}`
    }));

    this.opcoesCursos = this.cursos.map(curso => ({
      id: curso,
      label: `${curso.nome} (${curso.sigla})`
    }));
  }

  private atualizarOpcoesCurriculos(): void {
    this.opcoesCurriculos = this.curriculos.map(curriculo => ({
      id: curriculo,
      label: this.formatarCurriculo(curriculo),
      originalData: curriculo
    }));
  }

  private formatarCurriculo(curriculo: EstruturaCurricularDTO): string {
    return [curriculo.codigo, curriculo.ano]
      .filter(valor => valor !== undefined && valor !== null && String(valor).trim() !== '')
      .join(' - ');
  }

  private atualizarOpcoesDisciplinasDisponiveis(): void {
    this.opcoesDisciplinasDisponiveis = this.gruposDisponiveisView.flatMap(grupo =>
      grupo.disciplinas.map(disciplina => ({
        id: disciplina.uuid || null,
        label: `${grupo.nome} - ${disciplina.nomeDisciplina}`
      }))
    );
  }

  private atualizarOpcoesOfertasImportacao(): void {
    this.opcoesOfertasImportacao = this.ofertasDisponiveisParaImportacao.map(oferta => ({
      id: oferta.uuid || null,
      label: `${oferta.ano}/${oferta.semestre}`
    }));
  }

  public possuiCargaHoraria(cargaHoraria?: number | string): boolean {
    return Number(cargaHoraria || 0) > 0;
  }

  public trackByUuid(_index: number, item: DisciplinaCurriculoDTO): string {
    return item.uuid || '';
  }

  public trackByGrupo(_index: number, item: GrupoDisciplina<any>): string {
    return item.nome;
  }

  private agruparDisciplinas<T extends DisciplinaCurriculoDTO>(disciplinas: T[]): GrupoDisciplina<T>[] {
    const regulares = disciplinas
      .filter(d => d.tipoDisciplina !== 'DCG')
      .sort((a, b) => Number(a.semestre || 0) - Number(b.semestre || 0));

    const dcgs  = disciplinas.filter(d => d.tipoDisciplina === 'DCG');
    const grupos: GrupoDisciplina<T>[] = [];

    const semestresUnicos = Array.from(new Set(regulares.map(d => d.semestre)));

    semestresUnicos.forEach(semestre => {
      grupos.push({
        nome:        `${semestre}º Semestre`,
        disciplinas: regulares.filter(d => d.semestre === semestre)
      });
    });

    if (dcgs.length > 0) {
      grupos.push({ nome: 'DCG', disciplinas: dcgs });
    }

    return grupos;
  }
}
