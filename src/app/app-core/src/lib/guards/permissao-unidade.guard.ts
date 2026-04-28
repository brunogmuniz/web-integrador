import { inject } from '@angular/core';
import { CanActivateFn, Data, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AcessoUnidadeService } from '../services/acesso-unidade.service';

export interface PermissaoUnidadeRequisitos {
  permissoes?: string[];
  tiposUnidade?: string[];
  papeis?: string[];
  redirectTo?: string;
}

export const comPermissaoUnidade = (requisitos: PermissaoUnidadeRequisitos): Data => ({
  acessoUnidade: requisitos
});

export const permissaoUnidadeGuard: CanActivateFn = (route): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const acessoUnidadeService = inject(AcessoUnidadeService);
  const requisitos = (route.data?.['acessoUnidade'] as PermissaoUnidadeRequisitos | undefined) ?? {};
  const permissoesEsperadas = requisitos.permissoes
    ?? (route.data?.['permissoesUnidade'] as string[] | undefined)
    ?? [];
  const tiposUnidadeEsperados = requisitos.tiposUnidade
    ?? (route.data?.['tiposUnidade'] as string[] | undefined)
    ?? [];
  const papeisEsperados = requisitos.papeis
    ?? (route.data?.['papeisUnidade'] as string[] | undefined)
    ?? [];
  const redirectTo = requisitos.redirectTo ?? '/';

  return acessoUnidadeService.validarAcessoNaUnidadeAtiva(
    permissoesEsperadas,
    tiposUnidadeEsperados,
    papeisEsperados
  ).pipe(
    map(possuiPermissao => possuiPermissao ? true : router.createUrlTree([redirectTo])),
    catchError(() => of(router.createUrlTree([redirectTo])))
  );
};
