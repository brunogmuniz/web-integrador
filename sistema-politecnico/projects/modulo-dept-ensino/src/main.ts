import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { KeycloakService } from 'shared-core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';

const keycloak = new KeycloakService();

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    { provide: KeycloakService, useValue: keycloak }
  ]
});
