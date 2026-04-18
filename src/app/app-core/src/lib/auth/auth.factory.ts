import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { LoginService } from '../services/login.service';
import { AcessoUnidadeService } from '../services/acesso-unidade.service';
import { firstValueFrom, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

export function initializeAppFactory(
  oauthService: OAuthService,
  config: AuthConfig,
  loginService: LoginService,
  acessoUnidadeService: AcessoUnidadeService
): () => Promise<void> {
  return async () => {
    oauthService.configure(config);

    try {
      const parametrosUrl = new URLSearchParams(window.location.search);
      const isCallbackAutenticacao = parametrosUrl.has('code') || parametrosUrl.has('state');
      await oauthService.loadDiscoveryDocumentAndTryLogin();

      if (isCallbackAutenticacao) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const possuiAcessoValido = oauthService.hasValidAccessToken();

      if (possuiAcessoValido) {
        const usuarioSincronizado = await firstValueFrom(
          loginService.sincronizarUsuarioComBanco().pipe(
            timeout(5000),
            catchError((error: unknown) => {
              if (error instanceof HttpErrorResponse && error.status === 401) {
                console.warn('[AuthFactory] Sincronização cancelada: Token rejeitado pela API (401 Unauthorized). O usuário será redirecionado em breve.');
                return of(null);
              }
              console.error('[AuthFactory] Sincronização bloqueada por falha interna ou de rede:', error);
              return of(null);
            })
          )
        );

        if (usuarioSincronizado) {
          try {
            await firstValueFrom(
              acessoUnidadeService.carregarMeusAcessos(false, { fallbackOnError: false }).pipe(
                timeout(5000)
              )
            );
          } catch (error: unknown) {
            console.warn('[AuthFactory] Limitação transitória na recuperação de unidades:', error);
          }

          if (isCallbackAutenticacao) {
            loginService.tratarPosLogin();
          }
        }
      }
    } catch (error: unknown) {
      console.error('[AuthFactory] Colapso vital na orquestração com o Identity Provider:', error);
    }
  };
}
