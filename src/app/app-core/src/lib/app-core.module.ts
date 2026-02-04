import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormInput } from './components/form-input-padrao/form-input-padrao';
import { ImageProfileComponent } from './components/image-profile/image-profile.component';

@NgModule({
  declarations: [
    ImageProfileComponent
  ],
  imports: [
    CommonModule,
    FormInput
  ],
  exports: [
    FormInput,
    ImageProfileComponent
  ]
})
export class AppCoreModule { }
