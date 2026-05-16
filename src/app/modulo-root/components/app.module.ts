import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthConfig, OAuthModule, OAuthService, OAuthStorage } from "angular-oauth2-oidc";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from "../../../environments/environment";
import {
  AcessoUnidadeService,
  AppCoreModule,
  FormInput,
  APP_AUTH_CONFIG,
  initializeAppFactory,
  LoginService,
  montarUrlPortal,
  SharedCookieOAuthStorage,
  API_URL
} from 'app-core';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { SelecionarModuloComponent } from './selecionar-modulo/selecionar-modulo.component';
import { SemPermissaoComponent } from './sem-permissao/sem-permissao.component';

const authConfig: AuthConfig = {
  issuer: environment.issuer,
  clientId: environment.clientId,
  redirectUri: montarUrlPortal('root'),
  responseType: environment.responseType,
  scope: environment.scope,
  showDebugInformation: !environment.production,
};

@NgModule({
  declarations: [
    AppComponent,
    SelecionarModuloComponent,
    SemPermissaoComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
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
      provide: APP_AUTH_CONFIG,
      useValue: authConfig
    },
    {
      provide: API_URL,
      useValue: environment.apiUrl
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
