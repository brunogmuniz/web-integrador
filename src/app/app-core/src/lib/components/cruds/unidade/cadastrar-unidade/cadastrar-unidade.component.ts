import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UnidadeService } from '../../../../services/unidade.service';
import { TiposUnidade, UnidadeDTO, UnidadeFormDTO } from '../../../../dto/Unidade.dto';
import { SelectOption } from 'app-core';

@Component({
  selector: 'lib-cadastrar-unidade',
  templateUrl: './cadastrar-unidade.component.html',
  styleUrls: ['./cadastrar-unidade.component.css']
})
export class CadastrarUnidadeComponent implements OnInit {
  public formulario: FormGroup;
  public tiposDeUnidade = Object.values(TiposUnidade) as TiposUnidade[];

  private readonly tiposUnidadeLabel: Record<TiposUnidade, string> = {
    [TiposUnidade.DIRECAO]: 'Direção',
    [TiposUnidade.COMISSAO]: 'Comissão',
    [TiposUnidade.DEPARTAMENTO]: 'Departamento',
    [TiposUnidade.SETOR]: 'Setor',
    [TiposUnidade.LABORATORIO]: 'Laboratório',
    [TiposUnidade.CURSO]: 'Curso'
  };

  public unidadesPai: UnidadeDTO[] = [];
  public opcoesTiposDeUnidade: SelectOption[] = this.tiposDeUnidade.map(tipo => ({
    id: tipo,
    label: this.getTipoLabel(tipo)
  }));
  public opcoesUnidadesPai: SelectOption[] = [];
  public uuidEdicao: string | null = null;
  public isSubmetendo: boolean = false;
  public errorMessage: string = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly unidadeService: UnidadeService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.formulario = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      sigla: [''],
      tipo: [null, Validators.required],
      unidadeGerenciadoraUuid: [null],
      ativo: [true]
    });
  }

  ngOnInit(): void {
    this.carregarUnidadesPai();
    this.carregarEdicao();
  }

  public get unidadesPaiAtivas(): UnidadeDTO[] {
    return this.unidadesPai.filter(unidade => unidade.ativo);
  }

  public getTipoLabel(tipo: TiposUnidade): string {
    return this.tiposUnidadeLabel[tipo] || String(tipo);
  }

  private carregarUnidadesPai(): void {
    this.unidadeService.listar(true).subscribe({
      next: (unidades) => {
        this.unidadesPai = unidades.filter(unidade => unidade.ativo);
        this.removerUnidadeAtualDaLista();
        this.atualizarOpcoesUnidadesPai();
      },
      error: (err) => console.error('Erro ao buscar unidades para o select', err)
    });
  }

  private carregarEdicao(): void {
    this.uuidEdicao = this.route.snapshot.paramMap.get('uuid');
    if (this.uuidEdicao) {
      this.unidadeService.buscar(this.uuidEdicao).subscribe({
        next: (unidade) => {
          this.formulario.patchValue({
            nome: unidade.nome,
            sigla: unidade.sigla,
            tipo: unidade.tipo,
            unidadeGerenciadoraUuid: unidade.unidadeGerenciadoraUuid,
            ativo: unidade.ativo
          });
          this.removerUnidadeAtualDaLista();
        },
        error: (err) => {
          this.errorMessage = `Erro ao carregar dados da unidade: ${err.message}`;
        }
      });
    }
  }

  private removerUnidadeAtualDaLista(): void {
    if (this.uuidEdicao && this.unidadesPai.length > 0) {
      this.unidadesPai = this.unidadesPai.filter(
        unidade => unidade.uuid !== this.uuidEdicao
      );
      this.atualizarOpcoesUnidadesPai();
    }
  }

  private atualizarOpcoesUnidadesPai(): void {
    this.opcoesUnidadesPai = this.unidadesPaiAtivas.map(unidade => ({
      id: unidade.uuid || '',
      label: `${unidade.nome} (${unidade.tipo})`
    }));
  }

  public salvar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.isSubmetendo = true;
    this.errorMessage = '';
    const payload: UnidadeFormDTO = this.formulario.getRawValue();

    const operacaoObservable = this.uuidEdicao
      ? this.unidadeService.atualizar(this.uuidEdicao, payload)
      : this.unidadeService.salvar(payload);

    operacaoObservable.subscribe({
      next: () => {
        this.isSubmetendo = false;
        this.router.navigate(['/unidades/visualizar']);
      },
      error: (err: Error) => {
        this.errorMessage = err.message;
        this.isSubmetendo = false;
      }
    });
  }

  public cancelar(): void {
    this.router.navigate(['/unidades/visualizar']);
  }
}
