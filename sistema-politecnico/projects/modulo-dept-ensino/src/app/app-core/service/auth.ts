import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
// >> IMPORTAÇÃO CORRETA: map É ESSENCIAL PARA RESOLVER O ERRO TS2322
import { delay, tap, map } from 'rxjs/operators';

// Tipos Mockados
type UserRole = 'ROLE_ALUNO' | 'ROLE_PROFESSOR' | 'ROLE_DEPT_ENSINO' | 'ROLE_ADMIN';
type MockUser = { role: UserRole, username: string, token: string };

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private mockCurrentUser: MockUser | null = null;

  private readonly LOGIN_API_URL = '/api/v1/auth/login';

  constructor() {
    this.loadUserStateFromStorage();
  }

  private loadUserStateFromStorage(): void {
    const role = localStorage.getItem('mockUserRole');
    const username = localStorage.getItem('mockUsername');
    const token = localStorage.getItem('mockUserToken');

    if (role && username && token) {
      this.mockCurrentUser = { role: role as UserRole, username, token };
    }
  }

  // MÉTODO LOGIN CORRIGIDO: Agora retorna Observable<void> corretamente.
  login(usuario: string, senha: string): Observable<void> {

    const MOCK_CREDENTIALS: { [key: string]: MockUser } = {
      'teste': { role: 'ROLE_ADMIN', username: 'teste', token: 'jwt-token-teste-default' },
      'ensino': { role: 'ROLE_DEPT_ENSINO', username: 'ensino', token: 'jwt-token-dept' },
      'admin': { role: 'ROLE_ADMIN', username: 'admin', token: 'jwt-token-admin' }
    };

    const user = MOCK_CREDENTIALS[usuario];

    if (user && senha === '123') {

      return of(user).pipe(
        delay(500),
        tap((loggedInUser) => {
          this.mockCurrentUser = loggedInUser;
          localStorage.setItem('mockUserRole', loggedInUser.role);
          localStorage.setItem('mockUsername', loggedInUser.username);
          localStorage.setItem('mockUserToken', loggedInUser.token);
        }),

        // CORREÇÃO FINAL: Mapeia o MockUser para 'void', resolvendo o TS2322.
        map(() => {})
      );
    } else {
      return throwError(() => new Error('Credenciais inválidas ou erro na API mockada.'));
    }
  }

  isAuthenticated(): boolean {
    return !!this.mockCurrentUser && !!this.mockCurrentUser.token;
  }

  getUserRole(): UserRole | null {
    return this.mockCurrentUser ? this.mockCurrentUser.role : null;
  }

  getToken(): string | null {
    return this.mockCurrentUser ? this.mockCurrentUser.token : null;
  }

  logout(): void {
    this.mockCurrentUser = null;
    localStorage.removeItem('mockUserRole');
    localStorage.removeItem('mockUsername');
    localStorage.removeItem('mockUserToken');
  }
}
