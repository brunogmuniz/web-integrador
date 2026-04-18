import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DocenteService } from "app-core/lib/services/docente-service";
import { SubareaConhecimentoService } from "app-core/lib/services/subarea-conhecimento-service";
import { SubareaConhecimentoDTO } from "app-core/lib/dto/SubareaConhecimento.dto";
import { DocenteSubAreaPercentualDTO } from "app-core/lib/dto/DocenteSubAreaPercentual.dto";
import { DocenteSubAreaDTO } from "app-core/lib/dto/DocenteSubArea.dto";
import { RespostaPaginada } from "app-core/lib/dto/paginacao/resposta-paginada.dto";
import Swal from 'sweetalert2';

interface EncargoVisual {
  subareaId: number;
  nomeArea: string;
  nomeSubarea: string;
  percentual: number;
}

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
  encargosAtuais: EncargoVisual[] = [];
  areasAgrupadas: { nomeArea: string; subareas: SubareaConhecimentoDTO[] }[] = [];

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
      subareaIdSelecionada: [null, Validators.required],
      percentual: [null, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  get cSub() {
    return this.subForm.controls;
  }

  carregarDocentes(): void {
    this.docenteService.findAll(0, 500).subscribe({
      next: (res) => {
        this.docentesDisponiveis = res.conteudo || [];
      },
      error: (err) => console.error('Erro ao listar docentes', err)
    });
  }

  carregarSubareas(): void {
    this.subareaService.findAll(0, 500).subscribe({
      next: (res: RespostaPaginada<SubareaConhecimentoDTO>) => {
        const grupos = new Map<string, SubareaConhecimentoDTO[]>();

        (res.conteudo || []).forEach(sub => {
          const nomeArea = sub.area?.nome || 'Outras Áreas';

          if (!grupos.has(nomeArea)) {
            grupos.set(nomeArea, []);
          }
          grupos.get(nomeArea)?.push(sub);
        });

        this.areasAgrupadas = Array.from(grupos.entries()).map(([nomeArea, subs]) => ({
          nomeArea,
          subareas: subs.sort((a, b) => a.nome.localeCompare(b.nome))
        }));
      },
      error: () => { void Swal.fire('Erro', 'Não foi possível carregar as subáreas.', 'error'); }
    });
  }

  carregarDadosDocente(uuid: string): void {
    this.loading = true;
    this.docenteService.buscarPorId(uuid).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response) {
          this.docenteNome = response.nome;

          if (response.subAreas && Array.isArray(response.subAreas)) {
            this.encargosAtuais = response.subAreas.map((sa: DocenteSubAreaPercentualDTO | any) => ({
              subareaId: sa.subareaId || sa.idSubarea || sa.id,
              nomeArea: sa.nomeArea || sa.areaNome || sa.area?.nome || 'Área não identificada',
              nomeSubarea: sa.nomeSubarea || sa.subareaNome || sa.nome || 'Subárea não identificada',
              percentual: Number(sa.percentual || sa.percentualAtuacao || 0)
            }));
          }
        }
      },
      error: () => {
        this.loading = false;
        void Swal.fire('Erro', 'Não foi possível carregar os dados do docente.', 'error');
      }
    });
  }

  private encontrarSubareaPorId(id: number): SubareaConhecimentoDTO | undefined {
    for (const grupo of this.areasAgrupadas) {
      const sub = grupo.subareas.find(s => s.id === Number(id));
      if (sub) return sub;
    }
    return undefined;
  }

  adicionarEncargo(): void {
    if (this.subForm.invalid) return;

    const idSubSelecionada = Number(this.subForm.value.subareaIdSelecionada);
    const percentualInformado = Number(this.subForm.value.percentual);

    const subarea = this.encontrarSubareaPorId(idSubSelecionada);

    if (!subarea) {
      void Swal.fire('Erro', 'Subárea selecionada inválida.', 'error');
      return;
    }

    if (this.encargosAtuais.some(e => Number(e.subareaId) === subarea.id)) {
      void Swal.fire('Aviso', 'Esta subárea já está vinculada na tabela abaixo.', 'warning');
      return;
    }

    const totalAtual = this.encargosAtuais.reduce((acc, curr) => acc + curr.percentual, 0);
    if ((totalAtual + percentualInformado) > 100) {
      void Swal.fire('Atenção', `A soma total dos encargos não pode ultrapassar 100%. Soma atual: ${totalAtual}%`, 'warning');
      return;
    }

    this.encargosAtuais.push({
      subareaId: subarea.id,
      nomeArea: subarea.area?.nome || 'N/A',
      nomeSubarea: subarea.nome,
      percentual: percentualInformado
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

    const uuidTarget = this.modoEdicao
      ? this.uuidDocente
      : this.encargoForm.getRawValue().idDocente;

    if (!uuidTarget) {
      void Swal.fire('Aviso', 'Selecione um docente antes de salvar.', 'warning');
      return;
    }

    const payload: DocenteSubAreaDTO[] = this.encargosAtuais.map(e => ({
      subareaId: e.subareaId,
      percentualAtuacao: e.percentual
    }));

    this.loading = true;
    this.docenteService.atualizarEncargos(uuidTarget, payload).subscribe({
      next: () => {
        this.loading = false;
        void Swal.fire('Sucesso', 'Encargos salvos com sucesso!', 'success').then(() => {
          this.voltar();
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro ao salvar encargos:', err);
        void Swal.fire('Erro', 'Não foi possível salvar os encargos no servidor.', 'error');
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
