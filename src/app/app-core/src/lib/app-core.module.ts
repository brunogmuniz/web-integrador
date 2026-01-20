import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormInput } from './components/form-input-padrao/form-input-padrao';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormInput
  ],
  exports: [
    FormInput
  ]
})
export class AppCoreModule { }
