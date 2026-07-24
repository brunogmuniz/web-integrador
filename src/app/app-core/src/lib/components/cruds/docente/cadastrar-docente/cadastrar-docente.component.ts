import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { DepartamentoDTO, DocenteService, DepartamentoService, SelectOption } from "app-core";
import { Router, ActivatedRoute } from "@angular/router";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cadastrar-docente',
  templateUrl: './cadastrar-docente.component.html',
  styleUrls: ['./cadastrar-docente.component.scss']
})
export class CadastrarDocenteComponent implements OnInit {
  docenteForm!: FormGroup;
  departamentos: DepartamentoDTO[] = [];
  opcoesDepartamentos: SelectOption[] = [];
  opcoesTipoVaga: SelectOption[] = [
    { id: 'Efetivo', label: 'Efetivo' },
    { id: 'Substituto', label: 'Substituto' },
    { id: 'Visitante', label: 'Visitante' }
  ];
  opcoesTipoFormacao: SelectOption[] = [
    { id: 'Graduação', label: 'Graduação' },
    { id: 'Especialização', label: 'Especialização' },
    { id: 'Mestrado', label: 'Mestrado' },
    { id: 'Doutorado', label: 'Doutorado' }
  ];
  opcoesOrigemVaga: SelectOption[] = [
    { id: 'Concurso Público', label: 'Concurso Público' },
    { id: 'Processo Seletivo', label: 'Processo Seletivo' }
  ];
  opcoesLicenciatura: SelectOption[] = [
    { id: true, label: 'Sim' },
    { id: false, label: 'Não' }
  ];
  modoEdicao = false;
  docenteUuid?: string;

  constructor(
    private fb: FormBuilder,
    private docenteService: DocenteService,
    private departamentoService: DepartamentoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarDepartamentos();
    this.verificarEdicao();
  }

  private initForm(): void {
    this.docenteForm = this.fb.group({
      nome: ['', Validators.required],
      matricula: ['', Validators.required],
      tipoVaga: [null, Validators.required],
      tipoFormacao: [null, Validators.required],
      formacaoCompleta: [null],
      licenciatura: [null, Validators.required],
      origemVaga: [null, Validators.required],
      departamentoId: [null, Validators.required],
    });
  }

  private carregarDepartamentos(): void {
    this.departamentoService.findAll(0, 500).subscribe({
      next: (res) => {
        this.departamentos = res.conteudo;
        this.opcoesDepartamentos = this.departamentos.map(departamento => ({
          id: departamento.id as number,
          label: departamento.nome || ''
        }));
      },
      error: (err) => {
        console.error('Erro ao carregar departamentos:', err);
        void Swal.fire('Erro', 'Não foi possível carregar a lista de departamentos.', 'error');
      }
    });
  }

  private verificarEdicao(): void {
    this.route.paramMap.subscribe(params => {
      const uuidParam = params.get('id');
      if (uuidParam) {
        this.docenteUuid = uuidParam;
        this.modoEdicao = true;
        this.carregarDocente(this.docenteUuid);
      }
    });
  }

  private carregarDocente(uuid: string): void {
    this.docenteService.buscarPorId(uuid).subscribe({
      next: (doc: any) => {
        const departamentoId = doc.departamentoId ?? doc.idDepartamento ?? doc.departamento?.id ?? null;
        this.docenteForm.patchValue({
          ...doc,
          departamentoId: departamentoId !== null ? Number(departamentoId) : null
        });
      },
      error: (err) => {
        console.error(err);
        void Swal.fire('Erro', 'Não foi possível carregar o docente.', 'error');
        this.cancelar();
      }
    });
  }

  get controlesFormulario() {
    return this.docenteForm.controls as { [key: string]: FormControl };
  }

  onSubmit(): void {
    if (this.docenteForm.invalid) {
      void Swal.fire('Atenção', 'Preencha todos os campos obrigatórios.', 'warning');
      this.docenteForm.markAllAsTouched();
      return;
    }

    const docenteDto = this.docenteForm.getRawValue();

    if (this.modoEdicao && this.docenteUuid) {
      this.docenteService.update(this.docenteUuid, docenteDto).subscribe({
        next: () => {
          void Swal.fire('Sucesso', 'Docente atualizado com sucesso!', 'success');
          void this.router.navigate(['/docente']);
        },
        error: (erro) => {
          console.error(erro);
          void Swal.fire('Erro', 'Não foi possível atualizar o docente.', 'error');
        }
      });
    } else {
      this.docenteService.create(docenteDto).subscribe({
        next: () => {
          void Swal.fire('Sucesso', 'Docente cadastrado com sucesso!', 'success');
          void this.router.navigate(['/docente']);
        },
        error: (erro) => {
          console.error(erro);
          void Swal.fire('Erro', 'Não foi possível cadastrar o docente.', 'error');
        }
      });
    }
  }

  cancelar(): void {
    void this.router.navigate(['/docente']);
  }
}
