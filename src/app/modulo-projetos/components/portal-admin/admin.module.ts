import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MenuLateralComponent } from "./utils/menu-lateral/menu-lateral.component";
import { HeaderComponent } from "./utils/header/header.component";

@NgModule({
  declarations: [
    MenuLateralComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    MenuLateralComponent,
    HeaderComponent
  ]
})
export class AdminModule { }
