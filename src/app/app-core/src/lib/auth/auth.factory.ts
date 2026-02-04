import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { LoginService } from '../services/login.service';
import { firstValueFrom, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

export function initializeAppFactory(
  oauthService: OAuthService,
  config: AuthConfig,
  loginService: LoginService
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
            catchError(() => of(null))
          )
        );
      } else {
        const params = new URLSearchParams(window.location.search);
        if (!params.has('code')) oauthService.initLoginFlow();
      }
    } catch (error) {
      console.error('Erro', error);
    }
  };
}
