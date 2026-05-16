import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsuarioService, AcessoUnidadeService } from 'app-core';

@Component({
  selector: 'menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.scss']
})
export class MenuLateralComponent implements OnInit, OnDestroy {
  @Output() onSidebarToggle = new EventEmitter<boolean>();

  public nome: string = '';
  public cargo: string = '';
  public uuidUsuario: string = '';
  public menuAberto: string = '';
  public isSidebarMinimized: boolean = false;
  public podeImportarDados: boolean = false;

  private inscricaoUsuarioAtivo: Subscription | undefined;
  private inscricaoAcessosUnidade: Subscription | undefined;

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly acessoUnidadeService: AcessoUnidadeService
  ) {}

  public ngOnInit(): void {
    this.carregarDadosEstaticosUsuario();
    this.observarAtualizacoesEmTempoRealDoUsuario();
    this.carregarPermissoesDeAcesso();
  }

  public ngOnDestroy(): void {
    if (this.inscricaoUsuarioAtivo) {
      this.inscricaoUsuarioAtivo.unsubscribe();
    }
    if (this.inscricaoAcessosUnidade) {
      this.inscricaoAcessosUnidade.unsubscribe();
    }
  }

  public toggleSidebarSize(): void {
    this.isSidebarMinimized = !this.isSidebarMinimized;

    if (this.isSidebarMinimized) {
      this.menuAberto = '';
    }

    this.onSidebarToggle.emit(this.isSidebarMinimized);
  }

  public toggleMenu(nomeDoMenu: string): void {
    if (this.isSidebarMinimized) {
      this.toggleSidebarSize();
    }
    this.menuAberto = this.menuAberto === nomeDoMenu ? '' : nomeDoMenu;
  }

  public isOpen(nomeDoMenu: string): boolean {
    return this.menuAberto === nomeDoMenu;
  }

  private carregarDadosEstaticosUsuario(): void {
    this.nome = this.usuarioService.getNomeLogado() || 'Admin';
    this.cargo = this.usuarioService.getCargoLogado() || 'Admin';

    const usuarioLogado = this.usuarioService.getUsuarioLogado();
    if (usuarioLogado) {
      this.uuidUsuario = usuarioLogado.uuid || String(usuarioLogado.id) || '';
    }
  }

  private observarAtualizacoesEmTempoRealDoUsuario(): void {
    this.inscricaoUsuarioAtivo = this.usuarioService.eventoUsuarioAtualizado.subscribe({
      next: (usuarioAtualizado) => {
        this.nome = usuarioAtualizado.nome;
      },
      error: (erro) => {
        console.error('Falha ao atualizar dados do usuário em tempo real no menu lateral', erro);
      }
    });
  }

  private carregarPermissoesDeAcesso(): void {
    this.inscricaoAcessosUnidade = this.acessoUnidadeService.carregarMeusAcessos().subscribe({
      next: () => {
        this.avaliarPermissaoParaImportacaoDeDados();
      },
      error: (erro) => {
        console.error('Falha ao carregar acessos da unidade para o menu lateral', erro);
      }
    });
  }

  private avaliarPermissaoParaImportacaoDeDados(): void {
    const possuiPermissaoDirecao = this.acessoUnidadeService.possuiPermissaoNaUnidadeAtiva(['DIRECAO']);
    const possuiContextoDirecao = this.acessoUnidadeService.possuiContextoNaUnidadeAtiva(
      ['DIRECAO'],
      ['RESPONSAVEL', 'RESPONSAVEL_ADJUNTO']
    );

    this.podeImportarDados = possuiPermissaoDirecao || possuiContextoDirecao;
  }
}
