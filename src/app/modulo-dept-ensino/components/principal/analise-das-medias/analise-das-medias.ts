import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, catchError, finalize, of, Subscription } from 'rxjs';
import { AnaliseService } from 'app-core/lib/services/analise.service';
import { AnaliseParamsDTO } from 'app-core/lib/dto/analiseParams.dto';
import { AnoSemestreDTO } from 'app-core/lib/dto/anoSemestre.dto';
import { AreaMediaDTO } from 'app-core/lib/dto/areaMedia.dto';

@Component({
  selector: 'app-analise-das-medias',
  templateUrl: './analise-das-medias.html',
  styleUrls: ['./analise-das-medias.css'],
})
export class AnaliseDasMediasComponent implements OnInit, OnDestroy {
  private readonly analiseService = inject(AnaliseService);
  private readonly route = inject(ActivatedRoute);

  private readonly stateSubject = new BehaviorSubject<AreaMediaDTO | AreaMediaDTO[] | null>(null);
  readonly data$ = this.stateSubject.asObservable();

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  error$: Observable<string | null> = of(null);
  private routeSub!: Subscription;

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const areaUuid = params.get('uuid');

      if (areaUuid) {
        this.processarRequisicao(
          this.analiseService.analisarArea(areaUuid, this.montarParametros()),
          'Ocorreu um erro ao processar a análise da área.'
        );
      } else {
        this.processarRequisicao(
          this.analiseService.analisarTodas(this.montarParametros()),
          'Ocorreu um erro ao carregar a análise do departamento.'
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  private montarParametros(): AnaliseParamsDTO {
    const anosSemestres: AnoSemestreDTO[] = [];
    const anoInicio = 2024;
    const anoFim = 2027;

    for (let ano = anoInicio; ano <= anoFim; ano++) {
      anosSemestres.push({ ano: ano.toString(), semestre: '1', cargaHoraria: 0, demandaDocente: 0 });
      anosSemestres.push({ ano: ano.toString(), semestre: '2', cargaHoraria: 0, demandaDocente: 0 });
    }

    return {
      anosSemestres,
      docentesArea: []
    };
  }

  private processarRequisicao(request$: Observable<AreaMediaDTO | AreaMediaDTO[]>, mensagemErro: string): void {
    this.loadingSubject.next(true);
    this.error$ = of(null);

    request$.pipe(
      catchError(() => {
        this.error$ = of(mensagemErro);
        return of(null);
      }),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe((resultado) => {
      if (resultado) this.stateSubject.next(resultado);
    });
  }
}
