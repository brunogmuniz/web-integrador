import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrincipalComponent } from './principal/principal.component';
import { AnaliseDasMedias } from './principal/analise-das-medias/analise-das-medias';
import { AreaTabelaComponent } from './utils/area-tabela/area-tabela';
import { MenuLateralComponent } from './utils/menu-lateral/menu-lateral.component';
import { HeaderComponent } from './utils/header/header.component';
import {APP_AUTH_CONFIG, AppCoreModule, initializeAppFactory, LoginService} from "app-core";
import {HttpClient, HttpClientModule, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {AuthConfig, OAuthModule, OAuthService, OAuthStorage} from "angular-oauth2-oidc";
import {provideNgxMask} from "ngx-mask";
import {environment} from "../../../environments/enviroment";


const authConfig: AuthConfig = {
  issuer: 'http://localhost:8081/realms/ufsm',
  clientId: 'webClient',
  redirectUri: 'http://localhost:4203/',
  responseType: 'code',
  scope: 'openid profile email offline_access',
  showDebugInformation: !environment.production,
};

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    AnaliseDasMedias,
    AreaTabelaComponent,
    MenuLateralComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    AppCoreModule,
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
      provide: OAuthStorage,
      useValue: localStorage
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (oauthService: OAuthService, config: AuthConfig, loginService: LoginService) =>
        initializeAppFactory(oauthService, config, loginService),
      deps: [OAuthService, APP_AUTH_CONFIG, LoginService],
      multi: true
    },
    provideNgxMask({
      dropSpecialCharacters: true
    })
  ],
  exports: [
    MenuLateralComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
