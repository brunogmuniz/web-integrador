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

    // return this.http.post('http://api.seuprojeto.com/login', { usuario, senha });

    // simulação de token
    const mockTokenDeptEnsino = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoibGVnYWwiLCJyb2xlIjoiUk9MRV9ERVBUX0VOU0lOTyIsImlhdCI6MTUxNjIzOTA1MH0.XgW87N9H1jA2rS4eI8mR0k7zD3qP6D2LpL5E_5oF5Qk';

    // caso feliz
    return of({ token: mockTokenDeptEnsino }).pipe(
      tap((response: any) => {
        // guarda o token
        this.setToken(response.token);
      })
    );
  }

 //verificação se o usuario tem token
  public isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return !!token;
  }

  //ver se ele tem autorização pra entrar no portal
  public getUserRole(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return null;

    // no caso so tem o role ensino
    return 'ROLE_DEPT_ENSINO';
  }

  //logout
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
}
