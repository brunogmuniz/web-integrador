import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription, catchError, finalize, forkJoin, of, switchMap, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { AnaliseParamsDTO } from 'app-core/lib/dto/analiseParams.dto';
import { AreaMediaDTO } from 'app-core/lib/dto/areaMedia.dto';
import { OfertaDTO } from 'app-core/lib/dto/Oferta.dto';
import { AnaliseService } from 'app-core/lib/services/analise.service';
import { OfertaService } from 'app-core/lib/services/oferta-service';

@Component({
  selector: 'app-analise-das-medias',
  templateUrl: './visualizar-analise-das-medias.component.html',
  styleUrls: ['./visualizar-analise-das-medias.component.css'],
})
export class VisualizarAnaliseDasMediasComponent implements OnInit, OnDestroy {
  private readonly analiseService = inject(AnaliseService);
  private readonly ofertaService = inject(OfertaService);
  private readonly route = inject(ActivatedRoute);

  private readonly stateSubject = new BehaviorSubject<AreaMediaDTO | AreaMediaDTO[] | null>(null);
  readonly data$ = this.stateSubject.asObservable();

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  private readonly recarregarAnaliseSubject = new Subject<void>();
  private readonly destroySubject = new Subject<void>();

  error$: Observable<string | null> = of(null);
  ofertas: OfertaDTO[] = [];
  ofertasSelecionadas: OfertaDTO[] = [];
  ofertaSelecionadaUuid = '';
  ofertaSelecionada?: OfertaDTO;
  limparOfertaAdicionarToken = 0;

  private routeSub!: Subscription;
  private areaUuid: string | null = null;

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.areaUuid = params.get('uuid');
      this.carregarOfertas();
    });

    this.recarregarAnaliseSubject.pipe(
      switchMap(() => this.executarRequisicaoAnalise()),
      takeUntil(this.destroySubject)
    ).subscribe(resultado => {
      if (resultado) {
        this.stateSubject.next(resultado);
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  adicionarOferta(): void {
    const oferta = this.ofertaSelecionada;
    if (!oferta?.uuid || this.ofertasSelecionadas.some(item => item.uuid === oferta.uuid)) {
      return;
    }

    this.ofertasSelecionadas = this.ordenarOfertas([...this.ofertasSelecionadas, oferta]);
    this.limparOfertaParaAdicionar();
    this.buscarAnalise();
  }

  removerOferta(oferta: OfertaDTO): void {
    if (this.ofertasSelecionadas.length <= 1) {
      void Swal.fire('Aviso', 'Mantenha pelo menos uma oferta para fazer a análise.', 'warning');
      return;
    }

    void Swal.fire({
      title: 'Remover oferta?',
      text: `A coluna ${this.formatarOferta(oferta)} será removida da análise.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Remover',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (!result.isConfirmed) {
        return;
      }

      this.ofertasSelecionadas = this.ofertasSelecionadas.filter(item => item.uuid !== oferta.uuid);
      this.buscarAnalise();
    });
  }

  formatarOferta(oferta: OfertaDTO): string {
    return `${oferta.ano}/${oferta.semestre}`;
  }

  selecionarOfertaAdicionar(oferta: OfertaDTO | null): void {
    if (!oferta?.uuid) {
      this.ofertaSelecionadaUuid = '';
      this.ofertaSelecionada = undefined;
      return;
    }

    this.ofertaSelecionadaUuid = oferta.uuid;
    this.ofertaSelecionada = oferta;
  }

  get ofertasSelecionadasUuids(): string[] {
    return this.ofertasSelecionadas
      .map(oferta => oferta.uuid)
      .filter((uuid): uuid is string => !!uuid);
  }

  private carregarOfertas(): void {
    this.loadingSubject.next(true);
    this.error$ = of(null);
    this.limparOfertaParaAdicionar();

    forkJoin({
      ofertas: this.ofertaService.buscarParaSelecao(),
      ofertasMaisRecentes: this.ofertaService.buscarMaisRecentes()
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.stateSubject.next(null);
        this.ofertas = [];
        this.ofertasSelecionadas = [];
        this.limparOfertaParaAdicionar();
        this.error$ = of(this.extrairMensagemErro(error, 'Ocorreu um erro ao carregar as ofertas.'));
        return of(null);
      }),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(resposta => {
      if (!resposta) {
        return;
      }

      this.ofertas = this.ordenarOfertas(resposta.ofertas || []);
      this.ofertasSelecionadas = this.ordenarOfertas(resposta.ofertasMaisRecentes || []);
      this.buscarAnalise();
    });
  }

  private buscarAnalise(): void {
    if (this.ofertasSelecionadas.length === 0) {
      this.stateSubject.next(null);
      this.error$ = of(this.ofertas.length === 0
        ? 'Nenhuma oferta válida cadastrada para processar a análise.'
        : 'Selecione ao menos uma oferta para processar a análise.');
      return;
    }

    this.recarregarAnaliseSubject.next();
  }

  private montarParametros(): AnaliseParamsDTO {
    return {
      anosSemestres: this.ofertasSelecionadas.map(oferta => ({
        ano: oferta.ano,
        semestre: oferta.semestre,
        cargaHoraria: 0,
        demandaDocente: 0
      })),
      ofertaUuids: this.ofertasSelecionadas
        .map(oferta => oferta.uuid)
        .filter((uuid): uuid is string => !!uuid),
      docentesArea: []
    };
  }

  private executarRequisicaoAnalise(): Observable<AreaMediaDTO | AreaMediaDTO[] | null> {
    this.loadingSubject.next(true);
    this.error$ = of(null);

    const request$: Observable<AreaMediaDTO | AreaMediaDTO[]> = this.areaUuid
      ? this.analiseService.analisarArea(this.areaUuid, this.montarParametros())
      : this.analiseService.analisarTodas(this.montarParametros());

    const mensagemErro = this.areaUuid
      ? 'Ocorreu um erro ao processar a análise da área.'
      : 'Ocorreu um erro ao carregar a análise do departamento.';

    return request$.pipe(
      catchError((error: HttpErrorResponse) => {
        this.stateSubject.next(null);
        this.error$ = of(this.extrairMensagemErro(error, mensagemErro));
        return of(null);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  private limparOfertaParaAdicionar(): void {
    this.ofertaSelecionadaUuid = '';
    this.ofertaSelecionada = undefined;
    this.limparOfertaAdicionarToken++;
  }

  private extrairMensagemErro(error: HttpErrorResponse, fallback: string): string {
    if (error.error?.message) {
      return error.error.message;
    }

    if (error.status === 400) {
      return 'Revise as ofertas selecionadas para processar a análise.';
    }

    return fallback;
  }

  private ordenarOfertas(ofertas: OfertaDTO[]): OfertaDTO[] {
    return [...ofertas].sort((a, b) => {
      const anoDiff = this.parseAnoOferta(b) - this.parseAnoOferta(a);
      if (anoDiff !== 0) {
        return anoDiff;
      }
      return this.parseSemestreOferta(b) - this.parseSemestreOferta(a);
    });
  }

  private parseAnoOferta(oferta: OfertaDTO): number {
    return Number.parseInt(oferta.ano, 10);
  }

  private parseSemestreOferta(oferta: OfertaDTO): number {
    return Number.parseInt(oferta.semestre, 10);
  }
}
