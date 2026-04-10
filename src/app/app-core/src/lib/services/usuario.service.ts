import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { UsuarioDTO } from '../dto/Usuario.dto';
import { Usuario } from '../model/usuario.model';
import { OAuthService } from 'angular-oauth2-oidc';
import {environment} from "../../../../../environments/enviroment";

export const API_URL = new InjectionToken<string>('API_URL');

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private readonly apiUrl = `${environment.apiUrl}/usuarios`;
  public readonly eventoUsuarioAtualizado = new Subject<Usuario>();

  constructor(
    private http: HttpClient,
    private oauthService: OAuthService,
    @Optional() @Inject(API_URL) apiUrl?: string
  ) {
    if (apiUrl) {
      this.apiUrl = `${apiUrl}/usuarios`;
    }
  }

  logout(): void {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario_logado');
  }

  setUsuarioLogado(usuario: Usuario, token: string): void {
    localStorage.setItem('usuario_logado', JSON.stringify(usuario));
    localStorage.setItem('token', token);
    this.eventoUsuarioAtualizado.next(usuario);
  }

  getUsuarioLogado(): Usuario | null {
    const user = localStorage.getItem('usuario_logado');
    return user ? JSON.parse(user) : null;
  }

  isLogged(): boolean {
    return !!localStorage.getItem('token');
  }

  getNomeLogado(): string {
    const user = this.getUsuarioLogado();
    if (user && user.nome) {
      return user.nome;
    }

    const claims = this.oauthService.getIdentityClaims() as any;
    return claims?.name || '';
  }

  getCargoLogado(): string {
    const claims = this.oauthService.getIdentityClaims() as any;
    if (claims && claims.tipoPerfil) {
      return claims.tipoPerfil;
    }
    const user = this.getUsuarioLogado();
    return user?.tipoPerfil ?? '';
  }

  completarCadastro(uuid: string, dados: Partial<UsuarioDTO>): Observable<UsuarioDTO> {
    return this.http.put<UsuarioDTO>(`${this.apiUrl}/${uuid}/completar-cadastro`, dados);
  }
}
