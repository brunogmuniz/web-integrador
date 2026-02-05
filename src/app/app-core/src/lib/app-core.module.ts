import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FormInput } from './components/form-input-padrao/form-input-padrao';
import { ImageProfileComponent } from './components/image-profile/image-profile.component';

@NgModule({
  declarations: [
    ImageProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FormInput
  ],
  exports: [
    FormInput,
    ImageProfileComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class AppCoreModule { }
