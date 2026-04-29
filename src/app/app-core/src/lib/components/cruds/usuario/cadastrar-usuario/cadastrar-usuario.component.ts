import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService, Usuario } from 'app-core';
import { HttpErrorResponse } from "@angular/common/http";
import Swal from 'sweetalert2';
import { LoginService } from '../../../../services/login.service';

const NOME_COMPLETO_REGEX = /^\S+(?:\s+\S+)+$/;

@Component({
  selector: 'lib-cadastrar-usuario',
  templateUrl: './cadastrar-usuario.component.html',
  styleUrls: ['./cadastrar-usuario.component.css']
})
export class CadastrarUsuarioComponent implements OnInit {
  public readonly formUsuario: FormGroup;
  public uuidUtilizador: string | null = null;
  public estaSubmetendoFormulario: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly usuarioService: UsuarioService,
    private readonly loginService: LoginService
  ) {
    this.formUsuario = this.criarFormulario();
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe({
      next: (params) => {
        this.uuidUtilizador = params['uuid'] || null;
        this.verificarEPreencherDados();
      },
      error: (erro: unknown) => {
        console.error('[CadastrarUsuarioComponent] Falha crítica ao recuperar parâmetros de rota:', erro);
      }
    });
  }

  private criarFormulario(): FormGroup {
    return this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.pattern(NOME_COMPLETO_REGEX)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
      matricula: [{ value: '', disabled: true }, [Validators.required]]
    });
  }

  private verificarEPreencherDados(): void {
    if (!this.uuidUtilizador) {
      return;
    }

    const utilizadorLogado = this.usuarioService.getUsuarioLogado();
    const idUtilizadorValido = utilizadorLogado?.uuid === this.uuidUtilizador || String(utilizadorLogado?.id) === this.uuidUtilizador;

    if (utilizadorLogado && idUtilizadorValido) {
      this.atualizarValoresFormulario(utilizadorLogado);
    } else {
      console.warn(`[CadastrarUsuarioComponent] Conflito de sessão: Tentativa de editar utilizador com UUID ${this.uuidUtilizador} não correspondente aos dados locais.`);
    }
  }

  private atualizarValoresFormulario(utilizador: Usuario): void {
    this.formUsuario.patchValue({
      nome: utilizador.nome || '',
      email: utilizador.email || '',
      cpf: utilizador.cpf || '',
      matricula: utilizador.matricula || ''
    });
  }

  public submeterFormulario(): void {
    if (this.formUsuario.invalid) {
      this.formUsuario.markAllAsTouched();
      if (this.formUsuario.get('nome')?.errors?.['pattern']) {
        void Swal.fire('Dados incompletos', 'Informe nome e sobrenome antes de salvar.', 'warning');
      }
      return;
    }

    if (!this.uuidUtilizador) {
      console.error('[CadastrarUsuarioComponent] Submissão abortada: UUID do utilizador ausente no contexto atual.');
      return;
    }

    this.estaSubmetendoFormulario = true;

    const utilizadorLogado = this.usuarioService.getUsuarioLogado() || {};
    const dadosFormulario = this.formUsuario.getRawValue();
    const payloadAtualizacao = { ...utilizadorLogado, ...dadosFormulario };

    this.usuarioService.completarCadastro(this.uuidUtilizador, payloadAtualizacao).subscribe({
      next: (usuarioAtualizado) => this.lidarComSucessoNaAtualizacao(usuarioAtualizado as Usuario),
      error: (erro: HttpErrorResponse) => this.lidarComFalhaNaAtualizacao(erro)
    });
  }

  private lidarComSucessoNaAtualizacao(usuarioAtualizado: Usuario): void {
    this.estaSubmetendoFormulario = false;
    const tokenAtual = localStorage.getItem('token') || '';

    this.usuarioService.setUsuarioLogado(usuarioAtualizado, tokenAtual);
    void Swal.fire({
      title: 'Informações Alteradas!',
      text: 'Suas informações foram alteradas. Por favor, realize o login novamente para aplicar as mudanças.',
      icon: 'success',
      confirmButtonText: 'Ir para Login',
      allowOutsideClick: false
    }).then(() => {
      this.loginService.logout();
      void this.router.navigate(['/login']);
    });
  }

  private lidarComFalhaNaAtualizacao(erro: HttpErrorResponse): void {
    this.estaSubmetendoFormulario = false;

    const contextoErro = {
      status: erro.status,
      mensagem: erro.message,
      detalhesBackend: erro.error,
      uuidAfetado: this.uuidUtilizador
    };

    console.error('[CadastrarUsuarioComponent] Erro na submissão do formulário de perfil:', contextoErro);
    const mensagemBackend = typeof erro.error === 'string'
      ? erro.error
      : erro.error?.message || erro.message;

    const mensagemErro = erro.status === 409
      ? (mensagemBackend || 'Já existe um conflito com os dados informados.')
      : 'Falha ao atualizar os dados. Verifique sua conexão e tente novamente.';

    void Swal.fire('Erro', mensagemErro, 'error');
  }
}
