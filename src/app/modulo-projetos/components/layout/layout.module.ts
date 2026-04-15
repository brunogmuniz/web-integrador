import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from '../utils/header/header.component';
import { MenuLateralComponent } from '../utils/menu-lateral/menu-lateral.component';
import {AppCoreModule} from "app-core";

@NgModule({
  declarations: [
    LayoutComponent,
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
    HeaderComponent,
    MenuLateralComponent
  ]
})
export class LayoutModule { }
