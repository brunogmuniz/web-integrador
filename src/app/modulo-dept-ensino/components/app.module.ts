import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthConfig, OAuthModule, OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { APP_AUTH_CONFIG, AppCoreModule, initializeAppFactory, LoginService } from 'app-core';
import { environment } from '../../../environments/enviroment';
import { AppRoutingModule } from './app-routing.module';
import { LayoutModule } from './layout/layout.module';
import { AppComponent } from './app.component';
import { PrincipalComponent } from './principal/principal.component';
import { AreaTabelaComponent } from './utils/area-tabela/area-tabela';
import { AnaliseDasMediasComponent } from './principal/analise-das-medias/analise-das-medias.component';
import { VisualizarAnaliseDasMediasComponent } from './principal/analise-das-medias/visualizar-analise-das-medias/visualizar-analise-das-medias.component';
import { NgOptimizedImage } from '@angular/common';

const authConfig: AuthConfig = {
  issuer: 'http://localhost:8081/realms/ufsm',
  clientId: 'webClient',
  redirectUri: 'http://localhost:4203/',
  responseType: 'code',
  scope: 'openid profile email offline_access',
  showDebugInformation: !environment.production,
};

export function storageFactory(): OAuthStorage {
  return typeof window !== 'undefined' ? localStorage : ({} as OAuthStorage);
}

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    AnaliseDasMediasComponent,
    VisualizarAnaliseDasMediasComponent,
    AreaTabelaComponent
  ],
  imports: [
    BrowserModule,
    NgOptimizedImage,
    FormsModule,
    AppRoutingModule,
    LayoutModule,
    AppCoreModule,
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
    provideNgxMask({ dropSpecialCharacters: true }),
    {
      provide: APP_AUTH_CONFIG,
      useValue: authConfig
    },
    {
      provide: OAuthStorage,
      useFactory: storageFactory
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (oauthService: OAuthService, config: AuthConfig, loginService: LoginService) =>
        initializeAppFactory(oauthService, config, loginService),
      deps: [OAuthService, APP_AUTH_CONFIG, LoginService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
