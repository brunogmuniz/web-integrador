import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UnidadeUsuarioService, UnidadeUsuarioRequestDTO } from '../../../../services/unidade-usuario.service';
import { UnidadeService } from '../../../../services/unidade.service';
import { SelectOption } from 'app-core';

@Component({
  selector: 'app-cadastrar-unidade-usuario',
  templateUrl: './cadastrar-unidade-usuario.component.html',
  styleUrls: ['./cadastrar-unidade-usuario.component.css']
})
export class CadastrarUnidadeUsuarioComponent implements OnInit {
  public readonly form: FormGroup;

  public unidades: any[] = [];
  public usuarios: any[] = [];
  public opcoesUnidades: SelectOption[] = [];
  public opcoesUsuarios: SelectOption[] = [];

  public readonly papeis: string[] = [
    'RESPONSAVEL',
    'PARTICIPANTE',
    'RESPONSAVEL_ADJUNTO',
  ];
  public opcoesPapeis: SelectOption[] = this.papeis.map(papel => ({
    id: papel,
    label: this.formatarPapel(papel)
  }));

  public isLoading = false;
  public errorMessage: string | null = null;

  public isEdicao = false;
  private uuidEdicao: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly unidadeUsuarioService: UnidadeUsuarioService,
    private readonly unidadeService: UnidadeService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      unidadeUuid: [null, Validators.required],
      usuarioId: [null, Validators.required],
      papel: [null, Validators.required],
      ativo: [true]
    });
  }

  ngOnInit(): void {
    this.uuidEdicao = this.route.snapshot.paramMap.get('uuid');
    this.isEdicao = !!this.uuidEdicao;

    this.carregarDadosDropdowns();
  }

  private carregarDadosDropdowns(): void {
    this.isLoading = true;
    this.errorMessage = null;

    forkJoin({
      unidades: this.unidadeService.listar(true),
      usuarios: this.unidadeUsuarioService.getTodos()
    })
      .pipe(finalize(() => {
        if (!this.isEdicao) this.isLoading = false;
      }))
      .subscribe({
        next: (res: any) => {
          this.unidades = res.unidades?.content || res.unidades || [];
          this.usuarios = res.usuarios?.content || res.usuarios || [];
          this.opcoesUnidades = this.unidades.map(unidade => ({
            id: unidade.uuid,
            label: unidade.nome || ''
          }));
          this.opcoesUsuarios = this.usuarios.map(usuario => ({
            id: usuario.id,
            label: usuario.nome || ''
          }));

          if (this.isEdicao && this.uuidEdicao) {
            this.carregarVinculo(this.uuidEdicao);
          }
        },
        error: (err: any) => {
          console.error('Erro ao carregar dropdowns', err);
          this.errorMessage = 'Erro ao carregar unidades e usuários.';
          this.isLoading = false;
        }
      });
  }

  private carregarVinculo(uuid: string): void {
    this.unidadeUsuarioService.buscarPorUuid(uuid).subscribe({
      next: (vinculo: any) => {
        this.form.patchValue({
          unidadeUuid: vinculo.unidadeUuid,
          usuarioId: vinculo.usuarioId,
          papel: vinculo.papel,
          ativo: vinculo.ativo
        });
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar vínculo', err);
        this.errorMessage = 'Erro ao carregar dados do vínculo.';
        this.isLoading = false;
      }
    });
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;

    const payload: UnidadeUsuarioRequestDTO = {
      unidadeUuid: raw.unidadeUuid,
      usuarioId: raw.usuarioId,
      papel: raw.papel,
      ativo: raw.ativo ?? true
    };

    this.isLoading = true;
    this.errorMessage = null;

    const operacao$ = this.isEdicao
      ? this.unidadeUsuarioService.atualizar(this.uuidEdicao!, payload)
      : this.unidadeUsuarioService.vincular(payload);

    operacao$.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/unidades-usuarios/visualizar']);
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('ERRO BACK:', err);
        this.errorMessage = this.traduzirErro(err);
      }
    });
  }

  private traduzirErro(err: any): string {
    const msg = (err?.error?.message || err?.message || '').toLowerCase();

    if (
      msg.includes('duplicate') ||
      msg.includes('já') ||
      msg.includes('exists') ||
      msg.includes('constraint')
    ) {
      return 'Esse usuário já está vinculado a essa unidade.';
    }

    if (msg.includes('not found')) {
      return 'Dados não encontrados.';
    }

    return 'Esse usuário já está vinculado a essa unidade.';
  }

  formatarPapel(papel: string): string {
    return papel.replaceAll('_', ' ');
  }
}
