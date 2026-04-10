import { InjectionToken } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';

export const APP_AUTH_CONFIG = new InjectionToken<AuthConfig>('APP_AUTH_CONFIG');
