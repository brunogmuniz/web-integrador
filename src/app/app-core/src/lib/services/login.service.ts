import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Usuario } from '../model/usuario.model';
import { StorageService } from './storage.service';
import { API_URL } from './usuario.service'; 

@Injectable({ providedIn: 'root' })
export class LoginService {
  private readonly STORAGE_KEY = 'usuario_logado';
  private readonly baseUrl: string;
  private userSubject = new BehaviorSubject<Usuario | null>(this.storage.getItem<Usuario>(this.STORAGE_KEY));

  constructor(
    private readonly oauthService: OAuthService,
    private readonly http: HttpClient,
    private readonly storage: StorageService,
    @Inject(API_URL) private readonly apiUrl: string 
  ) {
    this.baseUrl = this.apiUrl + '/usuarios';
  }

  public getUsuarioLogado(): Usuario | null {
    return this.userSubject.getValue();
  }

  public sincronizarUsuarioComBanco(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/me`).pipe(
      tap(usuario => {
        this.atualizarSessaoUsuario(usuario);
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
  public logout(): void {
    this.storage.removeItem(this.STORAGE_KEY);
    this.userSubject.next(null);
    this.oauthService.logOut();
  }
}