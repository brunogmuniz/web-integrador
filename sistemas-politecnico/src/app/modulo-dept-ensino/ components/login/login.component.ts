import {Component, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {AuthService} from '../../service/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Validators} from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  errorMessage: string = '';
  anoAtual: string ="2025"

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
