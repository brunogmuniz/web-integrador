import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Usuario } from '../model/usuario.model';
import { API_URL } from './usuario.service';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private readonly STORAGE_KEY = 'usuario_logado';
  private readonly baseUrl: string;
  private userSubject = new BehaviorSubject<Usuario | null>(this.storage.getItem<Usuario>(this.STORAGE_KEY));

  constructor(
    private readonly oauthService: OAuthService,
    private readonly http: HttpClient,
    private readonly storage: StorageService,
    @Optional() @Inject(API_URL) apiUrl?: string
  ) {
    this.baseUrl = apiUrl ? `${apiUrl}/usuarios` : 'http://localhost:8080/usuarios';
  }

  public getUsuarioLogado(): Usuario | null {
    return this.userSubject.getValue();
  }

  public sincronizarUsuarioComBanco(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/me`).pipe(
      tap(usuarioCompleto => this.atualizarSessaoUsuario(usuarioCompleto)),
      catchError(err => {
        console.error('Erro na sincronização:', err);
        throw err;
      })
    );
  }

  public atualizarSessaoUsuario(usuario: Usuario): void {
    this.storage.setItem(this.STORAGE_KEY, usuario);
    this.userSubject.next(usuario);
  }

  public estaAutenticado(): boolean {
    return this.oauthService.hasValidAccessToken();
  }
}
