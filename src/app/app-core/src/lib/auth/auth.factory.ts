import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';

export function initializeAppFactory(oauthService: OAuthService, config: AuthConfig): () => Promise<boolean> {
  return () => new Promise(resolve => {
    oauthService.configure(config);
    oauthService.setupAutomaticSilentRefresh();
    oauthService.loadDiscoveryDocumentAndLogin()
      .then((isLoggedIn) => {

        if (isLoggedIn || oauthService.hasValidAccessToken()) {
          resolve(true);
        } else {
          const url = window.location.search;
          const isCallback = (url.includes('code=') && url.includes('state='));

          if (!isCallback) {
            oauthService.initLoginFlow();
            resolve(false);
          } else {
            resolve(true);
          }
        }
      })
      .catch(() => {
        resolve(true);
      });
  });
}
