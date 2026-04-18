import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Usuario } from 'app-core';
import { PORTAIS, PortalKeyOuDesconhecido } from 'app-core';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
  private cachedRoles: Set<string> | null = null;
  private lastTokenComputed: string | null = null;

  constructor(private readonly oauthService: OAuthService) {}

  public possuiRoleAdmin(usuario: Usuario | null): boolean {
    return this.possuiAlgumaRole(new Set(PORTAIS.admin.roles), usuario);
  }

  public possuiRoleEnsino(usuario: Usuario | null): boolean {
    return this.possuiAlgumaRole(new Set(PORTAIS.ensino.roles), usuario);
  }

  public podeAcessarPortal(portal: PortalKeyOuDesconhecido, usuario: Usuario | null): boolean {
    switch (portal) {
      case 'admin':
        return this.possuiRoleAdmin(usuario);
      case 'ensino':
        return this.possuiRoleEnsino(usuario);
      case 'root':
        return true;
      default:
        return false;
    }
  }

  public invalidarCacheDeRoles(): void {
    this.cachedRoles = null;
    this.lastTokenComputed = null;
  }

  private possuiAlgumaRole(rolesEsperadas: Set<string>, usuario: Usuario | null): boolean {
    const roles = this.obterRolesAtuais(usuario);
    for (const role of rolesEsperadas) {
      if (roles.has(role)) {
        return true;
      }
    }
    return false;
  }

  private obterRolesAtuais(usuario: Usuario | null): Set<string> {
    const accessToken = this.oauthService.getAccessToken();

    if (this.cachedRoles && this.lastTokenComputed === accessToken) {
      return this.cachedRoles;
    }

    const roles = new Set<string>();

    for (const permissao of usuario?.permissoes ?? []) {
      roles.add(permissao);
    }

    const claims = this.oauthService.getIdentityClaims() as Record<string, unknown> | null;
    const realmAccess = claims?.['realm_access'] as { roles?: string[] } | undefined;
    for (const role of realmAccess?.roles ?? []) {
      this.adicionarRolePadronizada(roles, role);
    }

    if (accessToken) {
      for (const role of this.extrairRolesDoToken(accessToken)) {
        this.adicionarRolePadronizada(roles, role);
      }
    }

    this.cachedRoles = roles;
    this.lastTokenComputed = accessToken;
    return roles;
  }

  private adicionarRolePadronizada(rolesSet: Set<string>, role: string): void {
    rolesSet.add(role);
    rolesSet.add(role.toUpperCase());
    rolesSet.add(`ROLE_${role.toUpperCase()}`);
  }

  private extrairRolesDoToken(token: string): string[] {
    try {
      const payload = token.split('.')[1];
      if (!payload) {
        return [];
      }

      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = atob(base64);
      const claims = JSON.parse(json) as { realm_access?: { roles?: string[] } };
      return claims.realm_access?.roles ?? [];
    } catch (error) {
      console.error('[AuthorizationService] Erro crítico ao decodificar roles do JWT. Token possivelmente corrompido.', error);
      return [];
    }
  }
}
