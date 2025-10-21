import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../../app-core/service/auth';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-login.html',
  styleUrls: ['./form-login.scss']
})
export class FormLoginComponent implements OnInit {

  loginForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Login');
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { usuario, senha } = this.loginForm.value;

    this.authService.login(usuario, senha).subscribe({
      next: () => this.router.navigate(['/layout']),
      error: (err) => {
        this.errorMessage = err.error?.message || 'Falha no login. Verifique suas credenciais.';
      }
    });
  }

  togglePasswordVisibility(): void {
    const input = document.getElementById('senha') as HTMLInputElement;
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
  }
}
