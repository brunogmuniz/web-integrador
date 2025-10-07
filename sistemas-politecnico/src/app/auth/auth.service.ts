// src/app/auth/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs'; // 'of' é para simular a resposta da API
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private readonly TOKEN_KEY = 'auth_token';


  constructor(private http: HttpClient, private router: Router) { }


  login(usuario: string, senha: string): Observable<any> {

    // --- LÓGICA MOCKADA ---
    // No ambiente real, faríamos:
    // return this.http.post('http://api.seuprojeto.com/login', { usuario, senha });

    // Simulação de que, ao logar, o usuário é 'ROLE_DEPT_ENSINO'
    const mockTokenDeptEnsino = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoibGVnYWwiLCJyb2xlIjoiUk9MRV9ERVBUX0VOU0lOTyIsImlhdCI6MTUxNjIzOTA1MH0.XgW87N9H1jA2rS4eI8mR0k7zD3qP6D2LpL5E_5oF5Qk';

    // O 'of()' simula o retorno bem-sucedido de uma requisição HTTP
    return of({ token: mockTokenDeptEnsino }).pipe(
      tap((response: any) => {
        // Armazena o token após a "resposta" da API
        this.setToken(response.token);
      })
    );
  }

  /** * Verifica se o usuário tem um token (está logado).
   * Este é o método que o AuthGuard irá chamar.
   */
  public isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    // Retorna true se o token existe (!!) e é uma string válida
    return !!token;
  }

  /** * Simula a extração do papel (role) do usuário a partir do token.
   * Usado para redirecionamento após o login.
   */
  public getUserRole(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return null;

    // MOCK: Retornamos o papel fixo que definimos para este cenário
    return 'ROLE_DEPT_ENSINO';
  }

  /** Remove o token e redireciona para a tela de login. */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
}
