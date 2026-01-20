import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';
import { LoginService } from '../../services/login.service';
import { UsuarioUtil } from '../../utils/usuario-util';
import { TipoPerfil, Usuario } from '../../model/usuario.model';
import { UsuarioDto } from '../../dto/Usuario.dto';

interface CadastroForm {
  nome: FormControl<string>;
  email: FormControl<string>;
  cpf: FormControl<string>;
  matricula: FormControl<string>;
  tipoPerfil: FormControl<TipoPerfil>;
  telefone: FormControl<string | null>;
}

@Component({
  selector: 'app-atualizar-cadastro',
  templateUrl: './atualizar-cadastro.component.html'
})
export class AtualizarCadastroComponent implements OnInit, OnDestroy {
  form!: FormGroup<CadastroForm>;
  loading = false;
  private subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const usuario = this.loginService.getUsuarioLogado();
    if (!usuario) {
      void this.router.navigate(['/login']);
      return;
    }
    this.initForm(usuario);
    this.setupReatividade();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private initForm(u: UsuarioDto): void {
    this.form = this.fb.nonNullable.group({
      nome: [u.nome || '', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
      cpf: [u.cpf || '', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      email: [u.email || '', [Validators.required, Validators.email]],
      matricula: [u.matricula || '', [Validators.required]],
      tipoPerfil: [u.tipoPerfil || TipoPerfil.DOCENTE, [Validators.required]],
      telefone: [u.telefone || null]
    });

    if (!u.tipoPerfil) {
      this.atualizarPerfilPelaMatricula(u.matricula || '');
    }
  }

  private setupReatividade(): void {
    this.subs.add(
      this.form.controls.matricula.valueChanges.subscribe(mat => {
        if (this.form.controls.tipoPerfil.pristine) {
          this.atualizarPerfilPelaMatricula(mat);
        }
      })
    );
  }

  private atualizarPerfilPelaMatricula(matricula: string): void {
    const sugerido = UsuarioUtil.sugerirPerfilPorMatricula(matricula);
    this.form.patchValue({ tipoPerfil: sugerido });
  }

  onSubmit(): void {
    const usuarioAtual = this.loginService.getUsuarioLogado();
    if (this.form.invalid || !usuarioAtual) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload = this.form.getRawValue();

    this.usuarioService.completarCadastro(usuarioAtual.id, payload)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res: UsuarioDto) => {
          this.loginService.atualizarSessaoUsuario(res as Usuario);
          void this.router.navigate(['/']);
          void Swal.fire('Sucesso', 'Cadastro atualizado com sucesso!', 'success');
        },
        error: (err) => {
          const msg = err.status === 409 ? 'CPF ou Matrícula já em uso.' : 'Ocorreu um erro ao salvar os dados.';
          void Swal.fire('Erro', msg, 'error');
        }
      });
  }
}
