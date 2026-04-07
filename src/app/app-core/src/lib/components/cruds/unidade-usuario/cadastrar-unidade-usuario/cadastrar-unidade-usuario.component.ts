import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UnidadeUsuarioService, UnidadeUsuarioRequestDTO } from '../../../../services/unidade-usuario.service';
import { UnidadeService } from '../../../../services/unidade.service';

@Component({
  selector: 'app-cadastrar-unidade-usuario',
  templateUrl: './cadastrar-unidade-usuario.component.html',
  styleUrls: ['./cadastrar-unidade-usuario.component.css']
})
export class CadastrarUnidadeUsuarioComponent implements OnInit {
  public readonly form: FormGroup;

  public unidades: any[] = [];
  public usuarios: any[] = [];

  public readonly papeis: string[] = [
    'RESPONSAVEL',
    'PARTICIPANTE',
    'RESPONSAVEL_ADJUNTO',
  ];

  public isLoading = false;
  public errorMessage: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly unidadeUsuarioService: UnidadeUsuarioService,
    private readonly unidadeService: UnidadeService,
    private readonly router: Router
  ) {
    this.form = this.fb.group({
      unidadeUuid: [null, Validators.required],
      usuarioId: [null, Validators.required],
      papel: [null, Validators.required],
      ativo: [true]
    });
  }

  ngOnInit(): void {
    this.carregarDadosDropdowns();
  }

  private carregarDadosDropdowns(): void {
    this.isLoading = true;
    this.errorMessage = null;

    forkJoin({
      unidades: this.unidadeService.listar(true),
      usuarios: this.unidadeUsuarioService.getTodos()
    })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          this.unidades = res.unidades?.content || res.unidades || [];
          this.usuarios = res.usuarios?.content || res.usuarios || [];
        },
        error: (err: any) => {
          console.error('Erro ao carregar dropdowns', err);
          this.errorMessage = 'Erro ao carregar unidades e usuários.';
        }
      });
  }

  public onSubmit(): void {
    console.log('FORM RAW:', this.form.value);

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

    console.log('PAYLOAD FINAL:', payload);

    this.isLoading = true;
    this.errorMessage = null;

    this.unidadeUsuarioService.vincular(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/unidades-usuarios/visualizar']);
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('ERRO BACK:', err);
        this.errorMessage =
          err?.error?.message ||
          err?.message ||
          'Erro ao realizar vínculo na unidade.';
      }
    });
  }
}
