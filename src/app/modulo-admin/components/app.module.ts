import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {AuthConfig, OAuthModule, OAuthService, OAuthStorage} from "angular-oauth2-oidc";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {environment} from "../../../environments/enviroment";
import { AppCoreModule, FormInput, APP_AUTH_CONFIG, initializeAppFactory, LoginService} from 'app-core';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import {LayoutModule} from "./layout/layout.module";
import {PrincipalComponent} from "./principal/principal.component";
import { CommonModule } from '@angular/common';

const authConfig: AuthConfig = {
  issuer: 'http://localhost:8081/realms/ufsm',
  clientId: 'webClient',
  redirectUri: 'http://localhost:4200/',
  responseType: 'code',
  scope: 'openid profile email offline_access',
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
  bootstrap: [AppComponent]
})
export class AppModule { }
