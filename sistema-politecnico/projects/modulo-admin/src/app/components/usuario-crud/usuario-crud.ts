import { Component } from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormInput} from 'shared-core';
import {CommonModule} from '@angular/common';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-usuario-crud',
  imports: [ReactiveFormsModule, FormInput, CommonModule],
  templateUrl: './usuario-crud.html',
  styleUrl: './usuario-crud.scss'
})
export class UsuarioCRUD {

}
