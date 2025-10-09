import {Component, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {AuthService} from '../app-core/service/auth';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.scss',
  imports: [ReactiveFormsModule, CommonModule]
})

export class LoginComponent implements OnInit {
  errorMessage: string = '';

  loginForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router, private titleService: Title, private fb: FormBuilder) { }

  ngOnInit() {
    this.titleService.setTitle('Login - Bolicheiro');
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.errorMessage = ''; // Limpa a mensagem de erro anterior

    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      this.loginForm.markAllAsTouched();
      return;
    }

    const { usuario, senha } = this.loginForm.value;

    this.authService.login(usuario, senha).subscribe({
      next: () => {
        const role = this.authService.getUserRole();

        if (role === 'ROLE_DEPT_ENSINO') {
          this.router.navigate(['/dept-ensino']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        // ERRO NO LOGIN (tratamento mockado)
        this.errorMessage = 'Credenciais inválidas ou erro no servidor. Tente novamente.';
        console.error('Erro de Login:', err);
      }
    });
  }

}
