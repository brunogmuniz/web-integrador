import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioDto } from '../dto/Usuario.dto';
import { ResponseDto } from '../dto/response.dto';
import { Usuario } from '../model/usuario.model';
import { Mensagem } from '../model/mensagem.model';
import { TokenStatus } from '../dto/token-status';
import { OAuthService } from 'angular-oauth2-oidc';

export const API_URL = new InjectionToken<string>('API_URL');

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private readonly baseUrl: string = 'http://localhost:8080/usuarios';

  constructor(
    private http: HttpClient,
    private oauthService: OAuthService,
    @Optional() @Inject(API_URL) apiUrl?: string
  ) {
    if (apiUrl) {
      this.baseUrl = `${apiUrl}/usuarios`;
    }
  }

  login(email: string, senha: string): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(`${this.baseUrl}/auth/login`, { email, senha });
  }

  logout(): void {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  }

  setUsuarioLogado(usuario: Usuario, token: string): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('token', token);
  }

  getUsuarioLogado(): Usuario | null {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  }

  isLogged(): boolean {
    return !!localStorage.getItem('token');
  }

  getNomeLogado(): string {
    const claims = this.oauthService.getIdentityClaims() as any;
    if (claims && claims.name) {
      return claims.name;
    }
    const user = this.getUsuarioLogado();
    return user ? user.nome : '';
  }

  hasPermission(permission: string[]): boolean {
    const usuario = this.getUsuarioLogado();
    if (!usuario || !usuario.permissoes) return false;
    return usuario.permissoes.some(perm => permission.includes(perm));
  }

  statusToken(token: string): Observable<TokenStatus> {
    return this.http.get<TokenStatus>(`${this.baseUrl}/redefinir-senha/${token}`);
  }

  editarNome(usuario: Usuario): Observable<Mensagem> {
    return this.http.post<Mensagem>(`${this.baseUrl}/editarNome`, usuario);
  }

  alterarSenha(usuario: Usuario): Observable<Mensagem> {
    return this.http.post<Mensagem>(`${this.baseUrl}/alterarSenha`, usuario);
  }

  completarCadastro(id: number, dados: Partial<UsuarioDto>): Observable<UsuarioDto> {
    return this.http.put<UsuarioDto>(`${this.baseUrl}/${id}/completar-cadastro`, dados);
  }
}
