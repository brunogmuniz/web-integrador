import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocenteService, SubareaConhecimentoService, SubareaConhecimentoDTO } from 'app-core';

@Component({
  selector: 'app-cadastrar-docentes-encargos',
  templateUrl: './cadastrar-docentes-encargos.component.html',
  styleUrls: ['./cadastrar-docentes-encargos.component.scss']
})
export class CadastrarDocentesEncargosComponent implements OnInit {

  uuidDocente: string | null = null;
  docenteNome: string = '';
  loading: boolean = false;
  modoEdicao: boolean = false;
  encargoForm!: FormGroup;
  subForm!: FormGroup;
  docentesDisponiveis: any[] = [];
  encargosAtuais: any[] = [];
  areasAgrupadas: { nomeArea: string, subareas: SubareaConhecimentoDTO[] }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private docenteService: DocenteService,
    private subareaService: SubareaConhecimentoService
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.carregarDocentes();
    this.carregarSubareas();
    this.uuidDocente = this.route.snapshot.paramMap.get('uuid');

    if (this.uuidDocente) {
      this.modoEdicao = true;
      this.encargoForm.get('idDocente')?.setValue(this.uuidDocente);
      this.encargoForm.get('idDocente')?.disable();
      this.carregarDadosDocente(this.uuidDocente);
    }
  }

  private initForms(): void {
    this.encargoForm = this.fb.group({
      idDocente: [null, Validators.required]
    });

    this.subForm = this.fb.group({
      subareaSelecionada: [null, Validators.required],
      percentual: [null, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  get cSub() {
    return this.subForm.controls;
  }

  carregarDocentes(): void {
    this.docenteService.listarTodos().subscribe({
      next: (res: any) => {
        this.docentesDisponiveis = res.content || res;
      },
      error: err => console.error('Erro ao listar docentes', err)
    });
  }

  carregarSubareas(): void {
    this.subareaService.listarTodos().subscribe({
      next: (subareas: SubareaConhecimentoDTO[]) => {
        const grupos = new Map<string, SubareaConhecimentoDTO[]>();

        subareas.forEach(sub => {
          const nomeArea = sub.area?.nome || 'Outras';
          if (!grupos.has(nomeArea)) {
            grupos.set(nomeArea, []);
          }
          grupos.get(nomeArea)?.push(sub);
        });

        this.areasAgrupadas = Array.from(grupos.entries()).map(([nomeArea, subareas]) => ({
          nomeArea,
          subareas
        }));
      },
      error: err => console.error('Erro ao carregar subáreas', err)
    });
  }

  carregarDadosDocente(uuid: string): void {
    this.loading = true;
    this.docenteService.buscarPorId(uuid).subscribe({
      next: (response: any) => {
        if (response) {
          this.docenteNome = response.nome;
          this.encargosAtuais = (response.subAreas || []).map((sa: any) => ({
            subAreaId: sa.subareaId || sa.idSubArea || sa.id,
            nomeArea: sa.nomeArea || 'Área não identificada',
            nomeSubarea: sa.nomeSubarea || sa.nomeSubArea,
            percentual: sa.percentual
          }));
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar detalhes do docente', err);
        alert('Erro ao carregar dados do docente.');
        this.loading = false;
      }
    });
  }

  adicionarEncargo(): void {
    if (this.subForm.invalid) return;

    const formVal = this.subForm.value;
    const subarea: SubareaConhecimentoDTO = formVal.subareaSelecionada;
    const existe = this.encargosAtuais.some(e => e.subAreaId === subarea.id);
    if (existe) {
      alert('Esta subárea já está vinculada a este docente.');
      return;
    }

    this.encargosAtuais.push({
      subAreaId: subarea.id,
      nomeArea: subarea.area?.nome || 'N/A',
      nomeSubarea: subarea.nome,
      percentual: formVal.percentual
    });

    this.subForm.reset();
  }

  removerEncargo(index: number): void {
    this.encargosAtuais.splice(index, 1);
  }

  onSubmit(): void {
    if (this.encargoForm.invalid && !this.modoEdicao) {
      this.encargoForm.markAllAsTouched();
      return;
    }

    const uuidTarget = this.modoEdicao ? this.uuidDocente : this.encargoForm.get('idDocente')?.value;

    if (!uuidTarget) {
      alert('Selecione um docente antes de salvar.');
      return;
    }

    const payload = this.encargosAtuais.map(e => ({
      subareaId: e.subAreaId,
      percentualAtuacao: e.percentual
    }));

    this.loading = true;
    this.docenteService.atualizarEncargos(uuidTarget, payload).subscribe({
      next: () => {
        this.loading = false;
        alert('Encargos salvos com sucesso!');
        this.voltar();
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro ao salvar', err);
        const msg = err.error ? err.error : 'Ocorreu um erro ao salvar os dados.';
        alert('Erro: ' + msg);
      }
    });
  }

  cancelar(): void {
    this.voltar();
  }

  voltar(): void {
    void this.router.navigate(['/docente-encargos/visualizar']);
  }
}
