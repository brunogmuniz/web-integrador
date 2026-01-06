import { Component } from '@angular/core';
import {OAuthService} from "angular-oauth2-oidc";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'modulo-admin';

  constructor(private oauthService: OAuthService) {
    this.oauthService.configure({
      issuer: 'http://localhost:8081/realms/ufsm',
      clientId: 'webClient',
      redirectUri: window.location.origin + '/',
      responseType: 'code',
      scope: 'openid profile email offline_access',
      showDebugInformation: true,
      timeoutFactor: 0.01,
    })
    this.oauthService.loadDiscoveryDocumentAndLogin();
  }
}
