import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  private keycloak: Keycloak | undefined;

  init(loginRequired = true): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.keycloak = new Keycloak({
        url: 'http://localhost:8080/',
        realm: 'ufsm',
        clientId: 'account-console'
      });

      this.keycloak
        .init({
          onLoad: loginRequired ? 'login-required' : 'check-sso',
          checkLoginIframe: false
        })
        .then(authenticated => resolve(authenticated))
        .catch(err => reject(err));
    });
  }

  getToken(): string | undefined {
    return this.keycloak?.token;
  }

  logout(): void {
    this.keycloak?.logout();
  }
}
