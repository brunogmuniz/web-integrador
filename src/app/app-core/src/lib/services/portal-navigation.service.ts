import { DOCUMENT } from '@angular/common';
import { Injectable, Inject } from '@angular/core';
import { StorageService } from './storage.service';
import { AuthorizationService } from './authorization.service';
import { Usuario } from 'app-core';
import { montarUrlPortal, PORTAIS, PortalKey, PortalKeyOuDesconhecido } from 'app-core';

@Injectable({ providedIn: 'root' })
export class PortalNavigationService {
  private readonly REDIRECT_DESTINATION_KEY = 'redirect_destino_portal';

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly storage: StorageService,
    private readonly authzService: AuthorizationService
  ) {}

  public obterPortaisAcessiveis(usuario: Usuario | null): PortalKey[] {
    return (Object.keys(PORTAIS) as PortalKey[]).filter(portal => {
      return portal !== 'root' && this.authzService.podeAcessarPortal(portal, usuario);
    });
  }

  public salvarDestinoPortal(
    usuario: Usuario | null,
    portalPreferido: PortalKeyOuDesconhecido = this.obterPortalAtual()
  ): string {
    const destino = this.resolverDestinoPortal(usuario, portalPreferido);
    this.storage.setItem(this.REDIRECT_DESTINATION_KEY, destino);
    return destino;
  }

  public obterDestinoSalvo(): string | null {
    return this.storage.getItem<string>(this.REDIRECT_DESTINATION_KEY);
  }

  public limparDestinoSalvo(): void {
    this.storage.removeItem(this.REDIRECT_DESTINATION_KEY);
  }

  public irParaPortal(portal: PortalKey): void {
    const destinoSalvo = this.obterDestinoSalvo();
    const destinoDoPortalSelecionado = this.obterDestinoDoPortalSelecionado(portal, destinoSalvo);

    this.limparDestinoSalvo();

    const destinoFinal = destinoDoPortalSelecionado ?? this.obterUrlPortal(portal);
    this.redirecionarSeguro(destinoFinal);
  }

  public irParaSemPermissao(): void {
    const destino = `${this.obterUrlPortal('root')}sem-permissao`;
    this.storage.setItem(this.REDIRECT_DESTINATION_KEY, destino);
    this.redirecionarSeguro(destino);
  }

  public prepararDestinoPreLogin(destinoUrl: string): void {
    const portalDestino = this.obterPortalPorUrl(destinoUrl);
    const destinoParaSalvar = portalDestino === 'root' ? '' : destinoUrl;

    if (destinoParaSalvar && this.isDestinoSeguro(destinoParaSalvar)) {
      this.storage.setItem(this.REDIRECT_DESTINATION_KEY, destinoParaSalvar);
    } else {
      this.limparDestinoSalvo();
    }
  }

  public redirecionarParaAtualizacaoDeCadastro(origin: string): void {
    this.document.location.href = `${origin}/atualizar-cadastro`;
  }

  public tratarPosLoginNoPortal(
    portalAtual: Exclude<PortalKeyOuDesconhecido, 'root'>,
    usuario: Usuario | null,
    destinoSalvo: string | null,
    urlAtual: string
  ): void {
    if (!this.authzService.podeAcessarPortal(portalAtual, usuario)) {
      this.irParaSemPermissao();
      return;
    }

    if (!destinoSalvo || !this.isDestinoSeguro(destinoSalvo)) {
      return;
    }

    if (this.normalizarUrl(destinoSalvo) === this.normalizarUrl(urlAtual)) {
      this.limparDestinoSalvo();
      return;
    }

    if (this.mesmaRota(urlAtual, destinoSalvo)) {
      this.atualizarUrlSemReload(destinoSalvo);
      this.limparDestinoSalvo();
      return;
    }

    this.redirecionarSeguro(destinoSalvo);
  }

  public tratarPosLoginNoRoot(
    usuario: Usuario | null,
    destinoSalvo: string | null,
    urlAtual: string
  ): void {
    const portaisAcessiveis = this.obterPortaisAcessiveis(usuario);
    const destinoSalvoEhSeguro = destinoSalvo && this.isDestinoSeguro(destinoSalvo);

    if (destinoSalvoEhSeguro && this.normalizarUrl(destinoSalvo!) === this.normalizarUrl(urlAtual)) {
      this.limparDestinoSalvo();
      return;
    }

    if (!portaisAcessiveis.length || portaisAcessiveis.length > 1) {
      const destinoSelecao = `${this.obterUrlPortal('root')}selecionar-modulo`;
      if (this.normalizarUrl(destinoSelecao) !== this.normalizarUrl(urlAtual)) {
        this.redirecionarSeguro(destinoSelecao);
      }
      return;
    }

    const portalPreferido = this.obterPortalPorUrl(destinoSalvo);
    const destino = destinoSalvoEhSeguro ? destinoSalvo! : this.salvarDestinoPortal(
      usuario,
      portalPreferido === 'desconhecido' ? portaisAcessiveis[0] : portalPreferido
    );

    if (this.normalizarUrl(destino) === this.normalizarUrl(urlAtual)) {
      this.limparDestinoSalvo();
      return;
    }

    this.redirecionarSeguro(destino);
  }

  public obterPortalAtual(): PortalKeyOuDesconhecido {
    return this.obterPortalPorPorta(this.document.location.port);
  }

  private resolverDestinoPortal(
    usuario: Usuario | null,
    portalPreferido: PortalKeyOuDesconhecido = this.obterPortalAtual()
  ): string {
    const origemBase = this.obterOrigemBase();

    if (this.authzService.podeAcessarPortal(portalPreferido, usuario)) {
      return this.obterUrlPortal(portalPreferido, origemBase);
    }

    if (this.authzService.possuiRoleAdmin(usuario)) {
      return this.obterUrlPortal('admin', origemBase);
    }

    if (this.authzService.possuiRoleEnsino(usuario)) {
      return this.obterUrlPortal('ensino', origemBase);
    }

    return `${this.obterUrlPortal('root', origemBase)}sem-permissao`;
  }

  private normalizarUrl(url: string): string {
    return url.endsWith('/') ? url : `${url}/`;
  }

  private mesmaRota(urlAtual: string, destino: string): boolean {
    try {
      const atual = new URL(urlAtual);
      const alvo = new URL(destino);
      return atual.origin === alvo.origin && this.normalizarUrl(atual.pathname) === this.normalizarUrl(alvo.pathname);
    } catch {
      return false;
    }
  }

  private atualizarUrlSemReload(destino: string): void {
    this.document.defaultView?.history.replaceState({}, '', destino);
  }

  private obterOrigemBase(): string {
    const location = this.document.location;
    return `${location.protocol}//${location.hostname}`;
  }

  private obterPortalPorUrl(url: string | null): PortalKeyOuDesconhecido {
    if (!url) return 'desconhecido';
    try {
      return this.obterPortalPorPorta(new URL(url).port);
    } catch {
      return 'desconhecido';
    }
  }

  private obterPortalPorPorta(porta: string): PortalKeyOuDesconhecido {
    const portal = Object.values(PORTAIS).find(item => item.port === porta);
    return portal?.key ?? 'desconhecido';
  }

  private obterDestinoDoPortalSelecionado(
    portal: PortalKey,
    destinoSalvo: string | null
  ): string | null {
    if (!destinoSalvo || !this.isDestinoSeguro(destinoSalvo)) return null;
    return this.obterPortalPorUrl(destinoSalvo) === portal ? destinoSalvo : null;
  }

  private obterUrlPortal(
    portal: PortalKeyOuDesconhecido,
    origemBase = this.obterOrigemBase()
  ): string {
    const portalKey = portal === 'desconhecido' ? 'root' : portal;
    const location = this.document.location;
    return montarUrlPortal(portalKey, location.protocol, location.hostname);
  }

  private isDestinoSeguro(destino: string): boolean {
    try {
      const url = new URL(destino, this.document.location.origin);
      const hostPermitido = this.document.location.hostname;
      return url.hostname === hostPermitido || url.hostname.endsWith(`.${hostPermitido}`);
    } catch {
      return false;
    }
  }

  private redirecionarSeguro(destino: string): void {
    if (this.isDestinoSeguro(destino)) {
      this.document.location.href = destino;
    } else {
      console.error('[PortalNavigationService] Tentativa de Open Redirect bloqueada. Destino:', destino);
      this.document.location.href = this.obterUrlPortal('root');
    }
  }
}
