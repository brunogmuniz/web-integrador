import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/enviroment';
import { AcessoUnidadeDTO } from '../dto/AcessoUnidade.dto';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class AcessoUnidadeService {
  private readonly apiUrl = `${environment.apiUrl}/usuarios/me/acessos-unidade`;
  private readonly unidadeAtivaStorageKey = 'unidade_ativa_uuid';
  private readonly acessosSubject = new BehaviorSubject<AcessoUnidadeDTO[] | null>(null);

  constructor(
    private readonly http: HttpClient,
    private readonly storage: StorageService
  ) {}

  public carregarMeusAcessos(
    forceRefresh = false,
    options: { fallbackOnError?: boolean } = {}
  ): Observable<AcessoUnidadeDTO[]> {
    const { fallbackOnError = true } = options;
    const cached = this.acessosSubject.getValue();
    if (!forceRefresh && cached) {
      return of(cached);
    }

    return this.http.get<AcessoUnidadeDTO[]>(this.apiUrl).pipe(
      tap(acessos => {
        this.acessosSubject.next(acessos);
        this.garantirUnidadeAtiva(acessos);
      }),
      catchError(error => {
        if (!fallbackOnError) {
          return throwError(() => error);
        }

        this.acessosSubject.next([]);
        this.limparUnidadeAtiva();
        return of([]);
      })
    );
  }

  public getAcessosSnapshot(): AcessoUnidadeDTO[] {
    return this.acessosSubject.getValue() ?? [];
  }

  public getUnidadeAtivaUuid(): string | null {
    return this.storage.getItem<string>(this.unidadeAtivaStorageKey);
  }

  public definirUnidadeAtiva(uuidUnidade: string): void {
    this.storage.setItem(this.unidadeAtivaStorageKey, uuidUnidade);
  }

  public limparUnidadeAtiva(): void {
    this.storage.removeItem(this.unidadeAtivaStorageKey);
  }

  public getAcessoUnidadeAtiva(): AcessoUnidadeDTO | null {
    const acessos = this.getAcessosSnapshot();
    const uuidAtiva = this.getUnidadeAtivaUuid();

    if (!acessos.length) {
      return null;
    }

    if (!uuidAtiva) {
      return acessos[0];
    }

    return acessos.find(acesso => acesso.unidadeUuid === uuidAtiva) ?? acessos[0];
  }

  public possuiPermissaoNaUnidadeAtiva(permissoesEsperadas: string[]): boolean {
    if (!permissoesEsperadas.length) {
      return true;
    }

    const acessoAtivo = this.getAcessoUnidadeAtiva();
    if (!acessoAtivo) {
      return false;
    }

    const permissoesNormalizadas = new Set(acessoAtivo.permissoes.map(permissao => permissao.toUpperCase()));
    return permissoesEsperadas.some(permissao => permissoesNormalizadas.has(permissao.toUpperCase()));
  }

  public possuiContextoNaUnidadeAtiva(
    tiposUnidadeEsperados: string[] = [],
    papeisEsperados: string[] = []
  ): boolean {
    const acessoAtivo = this.getAcessoUnidadeAtiva();
    if (!acessoAtivo) {
      return false;
    }

    const tipoOk = !tiposUnidadeEsperados.length
      || tiposUnidadeEsperados.some(tipo => tipo.toUpperCase() === (acessoAtivo.tipoUnidade ?? '').toUpperCase());

    const papelOk = !papeisEsperados.length
      || papeisEsperados.some(papel => papel.toUpperCase() === (acessoAtivo.papel ?? '').toUpperCase());

    return tipoOk && papelOk;
  }

  public validarAcessoNaUnidadeAtiva(
    permissoesEsperadas: string[] = [],
    tiposUnidadeEsperados: string[] = [],
    papeisEsperados: string[] = []
  ): Observable<boolean> {
    return this.carregarMeusAcessos().pipe(
      map(() => {
        const possuiPermissao = this.possuiPermissaoNaUnidadeAtiva(permissoesEsperadas);
        const possuiContexto = this.possuiContextoNaUnidadeAtiva(tiposUnidadeEsperados, papeisEsperados);
        return possuiPermissao || possuiContexto;
      })
    );
  }

  private garantirUnidadeAtiva(acessos: AcessoUnidadeDTO[]): void {
    if (!acessos.length) {
      this.limparUnidadeAtiva();
      return;
    }

    const unidadeAtiva = this.getUnidadeAtivaUuid();
    const possuiUnidadeAtiva = unidadeAtiva
      ? acessos.some(acesso => acesso.unidadeUuid === unidadeAtiva)
      : false;

    if (!possuiUnidadeAtiva) {
      this.definirUnidadeAtiva(acessos[0].unidadeUuid);
    }
  }
}
