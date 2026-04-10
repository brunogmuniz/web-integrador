import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HeaderComponent } from '../utils/header/header.component';
import { MenuLateralComponent } from '../utils/menu-lateral/menu-lateral.component';
import {AppCoreModule} from "app-core";

@NgModule({
  declarations: [
    LayoutComponent,
    NavbarComponent,
    HeaderComponent,
    MenuLateralComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AppCoreModule
  ],
  exports: [
    LayoutComponent,
    NavbarComponent,
    HeaderComponent,
    MenuLateralComponent
  ]
})
export class LayoutModule { }
