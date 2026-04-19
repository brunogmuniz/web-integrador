import { DOCUMENT } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Usuario } from '../model/usuario.model';
import { UsuarioUtil } from '../utils/usuario-util';
import { API_URL } from './usuario.service';
import { StorageService } from './storage.service';
import { AuthorizationService } from './authorization.service';
import { PortalNavigationService } from './portal-navigation.service';
import { PortalKey } from '../auth/portal.config';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private readonly STORAGE_KEY = 'usuario_logado';
  private readonly baseUrl: string;
  private userSubject = new BehaviorSubject<Usuario | null>(this.storage.getItem<Usuario>(this.STORAGE_KEY));
  public user$ = this.userSubject.asObservable();

  constructor(
    private readonly oauthService: OAuthService,
    private readonly http: HttpClient,
    private readonly storage: StorageService,
    private readonly authzService: AuthorizationService,
    private readonly portalNavService: PortalNavigationService,
    @Inject(DOCUMENT) private readonly document: Document,
    @Optional() @Inject(API_URL) apiUrl?: string
  ) {
    this.baseUrl = `${apiUrl ?? environment.apiUrl}/usuarios`;
  }

  public getUsuarioLogado(): Usuario | null {
    return this.userSubject.getValue();
  }

  public estaAutenticado(): boolean {
    return this.oauthService.hasValidAccessToken();
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
    this.authzService.invalidarCacheDeRoles();
    this.userSubject.next(usuario);
  }

  public iniciarLogin(destino = this.document.location.href): void {
    this.portalNavService.prepararDestinoPreLogin(destino);
    this.oauthService.initLoginFlow();
  }

  public tratarPosLogin(): void {
    const location = this.document.location;
    const destinoSalvo = this.portalNavService.obterDestinoSalvo();
    const usuario = this.getUsuarioLogado();
    const portalAtual = this.portalNavService.obterPortalAtual();

    if (this.deveIrParaAtualizarCadastro(usuario, location.pathname)) {
      this.portalNavService.redirecionarParaAtualizacaoDeCadastro(location.origin);
      return;
    }

    if (portalAtual !== 'root') {
      this.portalNavService.tratarPosLoginNoPortal(portalAtual, usuario, destinoSalvo, location.href);
      return;
    }

    this.portalNavService.tratarPosLoginNoRoot(usuario, destinoSalvo, location.href);
  }

  public logout(): void {
    this.storage.clear();

    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('[LoginService] Falha ao limpar storage nativo', e);
    }

    const cookies = this.document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const nomeCookie = cookies[i].split('=')[0].trim();
      
      const cookiesProtegidos = ['id_token', 'access_token', 'nonce', 'session_state'];
      
      if (!cookiesProtegidos.includes(nomeCookie)) {
        this.document.cookie = `${nomeCookie}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
      }
    }

    this.authzService.invalidarCacheDeRoles();
    this.userSubject.next(null);
    this.oauthService.logOut();
  }


  public irParaPortal(portal: PortalKey): void {
    this.portalNavService.irParaPortal(portal);
  }

  public irParaSemPermissao(): void {
    this.portalNavService.irParaSemPermissao();
  }

  public obterPortaisAcessiveis(): PortalKey[] {
    return this.portalNavService.obterPortaisAcessiveis(this.getUsuarioLogado());
  }

  private deveIrParaAtualizarCadastro(usuario: Usuario | null, pathname: string): boolean {
    const precisaAtualizar = !usuario
      || usuario.pendenciaAtualizacao === true
      || UsuarioUtil.isCadastroExpirado(usuario.ultimaAtualizacaoCadastro);

    return precisaAtualizar && !pathname.startsWith('/atualizar-cadastro');
  }
}
