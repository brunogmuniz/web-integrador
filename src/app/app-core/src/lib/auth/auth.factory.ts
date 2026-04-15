import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { LoginService } from '../services/login.service';
import { AcessoUnidadeService } from '../services/acesso-unidade.service';
import {firstValueFrom, of, throwError} from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

export function initializeAppFactory(
  oauthService: OAuthService,
  config: AuthConfig,
  loginService: LoginService,
  acessoUnidadeService: AcessoUnidadeService
): () => Promise<void> {
  return async () => {
    oauthService.configure(config);
    oauthService.setupAutomaticSilentRefresh();

    try {
      const isLoggedIn = await oauthService.loadDiscoveryDocumentAndLogin();
      if (isLoggedIn || oauthService.hasValidAccessToken()) {
        await firstValueFrom(
          loginService.sincronizarUsuarioComBanco().pipe(
            timeout(5000),
            catchError((error) => {
              console.error('[AuthFactory] Erro crítico ao sincronizar usuário com a base:', error);
              loginService.iniciarLogin();
              return throwError(() => error);
            })
          )
        );

        try {
          await firstValueFrom(
            acessoUnidadeService.carregarMeusAcessos(false, { fallbackOnError: false }).pipe(
              timeout(5000)
            )
          );
        } catch (error) {
          console.warn('Nao foi possivel carregar os acessos da unidade apos o login.', error);
        }

        loginService.tratarPosLogin();
      } else {
        const params = new URLSearchParams(window.location.search);
        if (!params.has('code')) loginService.iniciarLogin();
      }
    } catch (error) {
      console.error(error);
    }
  };
}
