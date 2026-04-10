import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AtualizarCadastroComponent } from './atualizar-cadastro.component';
import { FormInput } from '../form-input-padrao/form-input-padrao';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

const routes: Routes = [
  {
    path: '',
    component: AtualizarCadastroComponent
  }
];

@NgModule({
  declarations: [
    AtualizarCadastroComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FormInput,
    NgxMaskDirective,
    NgxMaskPipe
  ]
})
export class AtualizarCadastroModule { }
