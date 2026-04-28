import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { environment } from '../../../../../environments/environment';
import { UsuarioDTO } from '../dto/Usuario.dto';
import { Usuario } from '../model/usuario.model';

export const API_URL = new InjectionToken<string>('API_URL');

const CHAVE_STORAGE_USUARIO = 'usuario_logado';
const CHAVE_STORAGE_TOKEN = 'token';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly urlBaseApi: string;
  public readonly eventoUsuarioAtualizado = new Subject<Usuario>();

  constructor(
    private readonly http: HttpClient,
    private readonly oauthService: OAuthService,
    @Optional() @Inject(API_URL) urlApiInjetada?: string
  ) {
    const urlBase = urlApiInjetada ? urlApiInjetada : environment.apiUrl;
    this.urlBaseApi = `${urlBase}/usuarios`;
  }

  public logout(): void {
    localStorage.removeItem(CHAVE_STORAGE_USUARIO);
    localStorage.removeItem(CHAVE_STORAGE_TOKEN);
    localStorage.removeItem('usuario');
  }

  public setUsuarioLogado(usuario: Usuario, token: string): void {
    localStorage.setItem(CHAVE_STORAGE_USUARIO, JSON.stringify(usuario));
    localStorage.setItem(CHAVE_STORAGE_TOKEN, token);
    this.eventoUsuarioAtualizado.next(usuario);
  }

  public getUsuarioLogado(): Usuario | null {
    const usuarioArmazenado = localStorage.getItem(CHAVE_STORAGE_USUARIO);

    if (!usuarioArmazenado) {
      return null;
    }

    try {
      return JSON.parse(usuarioArmazenado) as Usuario;
    } catch (erro) {
      console.error('Falha estrutural ao converter os dados do usuário armazenados no localStorage', erro);
      return null;
    }
  }

  public getNomeLogado(): string {
    const usuarioArmazenado = this.getUsuarioLogado();
    if (usuarioArmazenado && usuarioArmazenado.nome) {
      return usuarioArmazenado.nome;
    }

    const reivindicacoesIdentidade = this.oauthService.getIdentityClaims() as Record<string, any>;
    return reivindicacoesIdentidade?.['name'] || '';
  }

  public getCargoLogado(): string {
    const reivindicacoesIdentidade = this.oauthService.getIdentityClaims() as Record<string, any>;
    if (reivindicacoesIdentidade && reivindicacoesIdentidade['tipoPerfil']) {
      return reivindicacoesIdentidade['tipoPerfil'];
    }

    const usuarioArmazenado = this.getUsuarioLogado();
    return usuarioArmazenado?.tipoPerfil ?? '';
  }

  public completarCadastro(uuidUsuario: string, dadosAtualizados: Partial<UsuarioDTO>): Observable<UsuarioDTO> {
    return this.http.put<UsuarioDTO>(`${this.urlBaseApi}/${uuidUsuario}/completar-cadastro`, dadosAtualizados);
  }
}
