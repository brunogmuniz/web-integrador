import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioDTO } from '../dto/Usuario.dto';
import { ResponseDto } from '../dto/response.dto';
import { Usuario } from '../model/usuario.model';
import { Mensagem } from '../model/mensagem.model';
import { TokenStatus } from '../dto/token-status';
import { OAuthService } from 'angular-oauth2-oidc';
import {environment} from "../../../../../environments/enviroment";

export const API_URL = new InjectionToken<string>('API_URL');

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private readonly apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(
    private http: HttpClient,
    private oauthService: OAuthService,
    @Optional() @Inject(API_URL) apiUrl?: string
  ) {
    if (apiUrl) {
      this.apiUrl = `${apiUrl}/usuarios`;
    }
  }


  login(email: string, senha: string): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(`${this.apiUrl}/auth/login`, { email, senha });
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
    const user = localStorage.getItem('usuario_logado');
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

  getCargoLogado(): string {
    const claims = this.oauthService.getIdentityClaims() as any;
    if (claims && claims.tipoPerfil) {
      return claims.tipoPerfil;
    }
    const user = this.getUsuarioLogado();
    return user?.tipoPerfil ?? '';
  }

  hasPermission(permission: string[]): boolean {
    const usuario = this.getUsuarioLogado();
    if (!usuario || !usuario.permissoes) return false;
    return usuario.permissoes.some(perm => permission.includes(perm));
  }

  statusToken(token: string): Observable<TokenStatus> {
    return this.http.get<TokenStatus>(`${this.apiUrl}/redefinir-senha/${token}`);
  }

  editarNome(usuario: Usuario): Observable<Mensagem> {
    return this.http.post<Mensagem>(`${this.apiUrl}/editarNome`, usuario);
  }

  alterarSenha(usuario: Usuario): Observable<Mensagem> {
    return this.http.post<Mensagem>(`${this.apiUrl}/alterarSenha`, usuario);
  }

  completarCadastro(uuid: string, dados: Partial<UsuarioDTO>): Observable<UsuarioDTO> {
    return this.http.put<UsuarioDTO>(`${this.apiUrl}/${uuid}/completar-cadastro`, dados);
  }
}
