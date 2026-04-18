import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthConfig, OAuthModule, OAuthService, OAuthStorage } from "angular-oauth2-oidc";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AcessoUnidadeService, AppCoreModule, FormInput, APP_AUTH_CONFIG, initializeAppFactory, LoginService, montarUrlPortal, SharedCookieOAuthStorage, API_URL } from 'app-core';
import { environment } from "../../../environments/environment";

import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { LayoutModule } from "./layout/layout.module";
import { PrincipalComponent } from "./principal/principal.component";
import { CommonModule } from '@angular/common';

const authConfig: AuthConfig = {

  issuer: environment.issuer,
  clientId: environment.clientId,

  redirectUri: window.location.origin + '/admin/',

  responseType: environment.responseType,
  scope: environment.scope,
  showDebugInformation: !environment.production,
};

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    LayoutModule,
    AppCoreModule,
    FormInput,
    NgxMaskDirective,
    NgxMaskPipe,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: [environment.apiUrl],
        sendAccessToken: true,
      },
    })
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: API_URL,
      useValue: environment.apiUrl
    },
    {
      provide: APP_AUTH_CONFIG,
      useValue: authConfig
    },
    {
      provide: OAuthStorage,
      useClass: SharedCookieOAuthStorage
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (oauthService: OAuthService, config: AuthConfig, loginService: LoginService, acessoUnidadeService: AcessoUnidadeService) =>
        initializeAppFactory(oauthService, config, loginService, acessoUnidadeService),
      deps: [OAuthService, APP_AUTH_CONFIG, LoginService, AcessoUnidadeService],
      multi: true
    },
    provideNgxMask({
      dropSpecialCharacters: true
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
