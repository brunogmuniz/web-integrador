import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrincipalComponent } from './principal/principal.component';

import { AnaliseDasMedias } from './principal/analise-das-medias/analise-das-medias';
import { AreaTabelaComponent } from './principal/analise-das-medias/utils/area-tabela/area-tabela';
import { MenuLateralComponent } from './principal/analise-das-medias/utils/menu-lateral/menu-lateral.component';
import { HeaderComponent } from './principal/analise-das-medias/utils/header/header.component';


@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    AnaliseDasMedias,
    AreaTabelaComponent,
    MenuLateralComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
