import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoDTO, CursoService, RespostaPaginada, SelectOption } from 'app-core';
import Swal from 'sweetalert2';

@Component({
  selector: 'lib-cadastrar-curso',
  templateUrl: './cadastrar-curso.component.html',
  styleUrls: ['./cadastrar-curso.component.scss']
})
export class CadastrarCursoComponent implements OnInit {

  cursoForm!: FormGroup;
  cursos: CursoDTO[] = [];

  cursoUuid?: string;
  modoEdicao = false;

  niveis = [
    { valor: 'MEDIO', label: 'Médio' },
    { valor: 'TECNICO', label: 'Técnico' },
    { valor: 'GRADUACAO', label: 'Graduação' },
    { valor: 'POS_GRADUACAO', label: 'Pós Graduação' },
  ];
  opcoesNiveis: SelectOption[] = this.niveis.map(nivel => ({
    id: nivel.valor,
    label: nivel.label
  }));

  constructor(
    private fb: FormBuilder,
    private cursoService: CursoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cursoForm = this.fb.group({
      uuid: [],
      nome: ['', Validators.required],
      sigla: ['', Validators.required],
      codigo: ['', Validators.maxLength(50)],
      anoCurriculo: ['', [Validators.required, Validators.min(1900), Validators.max(2100)]],
      cargaHorariaTotal: ['', [Validators.required, Validators.min(1)]],
      nivel: ['', Validators.required],
    });

    this.route.paramMap.subscribe(params => {
      const uuidParam = params.get('id');

      if (uuidParam) {
        this.cursoUuid = uuidParam;
        this.modoEdicao = true;
        this.carregarCurso(this.cursoUuid);
      } else {
        this.modoEdicao = false;
        this.cursoUuid = undefined;
        this.cursoForm.reset();
      }
    });

    this.loadCursos();
  }

  get controlesFormulario(): { [key: string]: FormControl } {
    return this.cursoForm.controls as { [key: string]: FormControl };
  }

  loadCursos(): void {
    this.cursoService.findAll(0, 100).subscribe({
      next: (res: RespostaPaginada<CursoDTO>) => {
        this.cursos = Array.isArray(res?.conteudo) ? res.conteudo : [];
      },
      error: (err: any) => {
        console.error('Falha ao carregar os cursos no formulário:', err);
        this.exibirErro('Não foi possível carregar a lista de cursos.');
      }
    });
  }

  carregarCurso(uuid: string): void {
    this.cursoService.buscarPorId(uuid).subscribe({
      next: (curso: CursoDTO) => {
        this.cursoForm.patchValue(curso);
      },
      error: (err: Error) => {
        console.error(`Falha ao carregar dados do curso ${uuid} para edição:`, err);
        this.exibirErro('Não foi possível carregar os dados do curso.');
      }
    });
  }

  onSubmit(): void {
    if (this.cursoForm.invalid) {
      this.cursoForm.markAllAsTouched();
      return;
    }

    const cursoDto: CursoDTO = this.cursoForm.getRawValue();

    if (this.modoEdicao && this.cursoUuid) {
      cursoDto.uuid = this.cursoUuid;

      this.cursoService.update(this.cursoUuid, cursoDto).subscribe({
        next: () => {
          this.exibirSucesso('Atualizado!');
          void this.router.navigate(['/curso/visualizar']);
        },
        error: (err: Error) => {
          console.error('Falha ao atualizar curso:', err);
          this.exibirErro('Não foi possível atualizar o curso.');
        }
      });
    } else {
      this.cursoService.create(cursoDto).subscribe({
        next: () => {
          this.exibirSucesso('Cadastrado!');
          this.cursoForm.reset();
          this.loadCursos();
        },
        error: (err: Error) => {
          console.error('Falha ao cadastrar novo curso:', err);
          this.exibirErro('Não foi possível cadastrar o curso.');
        }
      });
    }
  }

  private exibirSucesso(titulo: string): void {
    void Swal.fire({
      title: titulo,
      text: `Curso ${titulo.toLowerCase()} com sucesso.`,
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

  cancelar(): void {
    void this.router.navigate(['/curso/visualizar']);
  }
}
