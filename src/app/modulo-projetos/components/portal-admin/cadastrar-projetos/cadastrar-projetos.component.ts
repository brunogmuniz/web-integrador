import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from 'sweetalert2';
import { ProjetosDTO } from "app-core/lib/dto/Projetos.dto";
import { ProjetoService } from "app-core/lib/services/projetos/projeto.service";

@Component({
  selector: 'lib-cadastrar-projetos',
  templateUrl: './cadastrar-projetos.component.html',
  styleUrls: ['./cadastrar-projetos.component.css']
})
export class CadastrarProjetosComponent implements OnInit {

  projetoForm!: FormGroup;
  projetoId?: number;
  modoEdicao = false;

  situacoes = [
    { valor: 'EM_ANALISE', label: 'Em Análise' },
    { valor: 'ATIVO', label: 'Ativo' },
    { valor: 'EM_ANDAMENTO', label: 'Em Andamento' },
    { valor: 'CONCLUIDO', label: 'Concluído' },
    { valor: 'CANCELADO', label: 'Cancelado' }
  ];

  constructor(
    private fb: FormBuilder,
    private projetoService: ProjetoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.iniciarFormulario();

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');

      if (idParam) {
        this.projetoId = Number(idParam);
        this.modoEdicao = true;
        this.carregarProjeto(this.projetoId);
      } else {
        this.modoEdicao = false;
        this.projetoId = undefined;
        this.projetoForm.reset({ situacao: '' });
      }
    });
  }

  private iniciarFormulario(): void {
    this.projetoForm = this.fb.group({
      id: [null],
      numero: ['', [Validators.required, Validators.maxLength(20)]],
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      dataInicio: [null],
      dataFim: [null],
      situacao: ['', Validators.maxLength(100)],
      resumo: [''],
      classificacaoCNPQ: ['', Validators.maxLength(255)],
      linhaPesquisa: ['', Validators.maxLength(500)],
      responsavel: ['', Validators.maxLength(500)],
      tipoOrientacao: ['', Validators.maxLength(500)]
    });
  }

  get c(): { [key: string]: FormControl } {
    return this.projetoForm.controls as { [key: string]: FormControl };
  }

  carregarProjeto(id: number): void {
    this.projetoService.buscarPorId(id).subscribe({
      next: (projeto: ProjetosDTO) => {
        this.projetoForm.patchValue(projeto);
      },
      error: (err: Error) => {
        console.error(`Falha ao carregar os dados do projeto ${id}:`, err);
        this.exibirErro('Não foi possível carregar as informações para edição.');
      }
    });
  }

  onSubmit(): void {
    if (this.projetoForm.invalid) {
      this.projetoForm.markAllAsTouched();
      return;
    }

    const projetoDto: ProjetosDTO = this.projetoForm.value;

    if (this.modoEdicao && this.projetoId) {
      projetoDto.id = this.projetoId;

      this.projetoService.update(this.projetoId, projetoDto).subscribe({
        next: () => {
          this.exibirSucesso('Atualizado');
          this.retornarParaListagem();
        },
        error: (err: Error) => {
          console.error('Falha ao atualizar projeto:', err);
          this.exibirErro('Não foi possível atualizar o projeto.');
        }
      });
    } else {
      this.projetoService.create(projetoDto).subscribe({
        next: () => {
          this.exibirSucesso('Cadastrado');
          this.projetoForm.reset({ situacao: '' });
          this.retornarParaListagem();
        },
        error: (err: Error) => {
          console.error('Falha ao cadastrar novo projeto:', err);
          this.exibirErro('Não foi possível cadastrar o projeto.');
        }
      });
    }
  }

  cancelar(): void {
    this.retornarParaListagem();
  }

  private retornarParaListagem(): void {
    // AQUI FOI AJUSTADA A ROTA DE RETORNO/CANCELAMENTO
    void this.router.navigate(['/admin/ver-projetos']);
  }

  private exibirSucesso(acao: string): void {
    void Swal.fire({
      title: acao + '!',
      text: `Projeto ${acao.toLowerCase()} com sucesso.`,
      icon: 'success',
      timer: 1800,
      showConfirmButton: false
    });
  }

  private exibirErro(mensagem: string): void {
    void Swal.fire({
      title: 'Erro!',
      text: mensagem,
      icon: 'error'
    });
  }
}
