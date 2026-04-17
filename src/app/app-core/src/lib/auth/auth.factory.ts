import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { LoginService } from '../services/login.service';
import { AcessoUnidadeService } from '../services/acesso-unidade.service';
import { firstValueFrom, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

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

      const hasToken = await oauthService.loadDiscoveryDocumentAndTryLogin();

      if (hasToken) {
        const usuarioSincronizado = await firstValueFrom(
          loginService.sincronizarUsuarioComBanco().pipe(
            timeout(5000),
            catchError((error: unknown) => {
              const erroFormatado = error instanceof Error ? error.message : String(error);
              console.error('[AuthFactory] Sincronização bloqueada por falha na API ou conexão:', erroFormatado);
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
            const erroAcessoFormatado = error instanceof Error ? error.message : String(error);
            console.warn('[AuthFactory] Limitação transitória na recuperação de unidades:', erroAcessoFormatado);
          }

          if (isCallbackAutenticacao) {
            loginService.tratarPosLogin();
          }
        }
      }
    } catch (error: unknown) {
      const erroFatal = error instanceof Error ? error.message : String(error);
      console.error('[AuthFactory] Colapso vital na orquestração com o Identity Provider:', erroFatal);
    }
  };
}
