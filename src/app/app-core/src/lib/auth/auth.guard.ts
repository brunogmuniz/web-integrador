import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private oauthService: OAuthService) {}
  canActivate(): boolean {

    if (this.oauthService.hasValidAccessToken()) {
      return true;
    }

    const url = window.location.search;
    if (url.includes('code=') && url.includes('state=')) {
      return true;
    }

    this.oauthService.initLoginFlow();
    return false;
  }
}
