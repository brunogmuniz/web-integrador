import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DocenteDTO} from "../../../../app-core/src/lib/dto/Docente.dto";
import {DocenteSubAreaPercentualDTO} from "../../../../app-core/src/lib/dto/DocenteSubAreaPercentual.dto";
import {DocenteService} from "../../../../app-core/src/lib/services/docente-service";
import {SubareaConhecimentoService} from "../../../../app-core/src/lib/services/subarea-conhecimento-service";
import {Router} from "@angular/router";
import {SubareaConhecimentoDTO} from "../../../../app-core/src/lib/dto/SubareaConhecimento.dto";
import Swal from "sweetalert2";

interface AreaAgrupadaView {
  nomeArea: string;
  subareas: SubareaConhecimentoDTO[];
}

@Component({
  selector: 'app-cadastrar-docentes-encargos',
  templateUrl: './cadastrar-docentes-encargos.component.html',
  styleUrls: ['./cadastrar-docentes-encargos.component.scss']
})
export class CadastrarDocentesEncargosComponent implements OnInit {
  encargoForm!: FormGroup;
  subForm!: FormGroup;
  docentesDisponiveis: DocenteDTO[] = [];
  modoEdicao: boolean = false;
  areasAgrupadas: AreaAgrupadaView[] = [];

  encargosAtuais: DocenteSubAreaPercentualDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private docenteService: DocenteService,
    private subareaService: SubareaConhecimentoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.carregarDadosIniciais();
  }

  getTotalCarga(): number {
    return this.encargosAtuais.reduce((acc, e) => acc + e.percentual, 0);
  }

  private initForms() {
    this.encargoForm = this.fb.group({ idDocente: [null, Validators.required] });
    this.subForm = this.fb.group({
      subareaSelecionada: [null, Validators.required],
      percentual: [null, [Validators.required, Validators.min(0)]]
    });
  }

  get cSub() {
    return this.subForm.controls;
  }

  carregarDadosIniciais() {
    this.docenteService.listarTodos().subscribe(res => this.docentesDisponiveis = res);
    this.subareaService.listarTodos().subscribe(res => this.agruparSubareasPorArea(res));
  }

  agruparSubareasPorArea(subareas: SubareaConhecimentoDTO[]) {
    const mapAgrupado = new Map<string, SubareaConhecimentoDTO[]>();

    subareas.forEach(sub => {
      const nomeArea = sub.area?.nome || 'Geral';
      if (!mapAgrupado.has(nomeArea)) {
        mapAgrupado.set(nomeArea, []);
      }
      mapAgrupado.get(nomeArea)?.push(sub);
    });

    this.areasAgrupadas = Array.from(mapAgrupado, ([nomeArea, subareas]) => ({
      nomeArea,
      subareas
    })).sort((a, b) => a.nomeArea.localeCompare(b.nomeArea));
  }

  adicionarEncargo() {
    if (this.subForm.invalid) return;

    const sub = this.subForm.get('subareaSelecionada')?.value as SubareaConhecimentoDTO;
    const perc = this.subForm.get('percentual')?.value;

    if (this.encargosAtuais.some(e => e.idSubarea === sub.id)) {
      void Swal.fire('Ops', 'Subárea já adicionada.', 'warning');
      return;
    }

    this.encargosAtuais.push({
      id: 0,
      idSubarea: sub.id,
      nomeSubarea: sub.nome,
      idArea: sub.area?.id ?? 0,
      nomeArea: sub.area?.nome ?? '',
      percentual: parseFloat(perc)
    });

    this.subForm.reset();
  }

  removerEncargo(index: number) {
    this.encargosAtuais.splice(index, 1);
  }

  get podeSalvar(): boolean {
    const total = this.getTotalCarga();
    return this.encargoForm.valid && this.encargosAtuais.length > 0 && total <= 100.001;
  }

  onSubmit() {
    if (!this.podeSalvar) {
      void Swal.fire('Atenção', 'Selecione um docente e a carga total não pode exceder 100%.', 'warning');
      this.encargoForm.markAllAsTouched();
      return;
    }

    const idDocente = this.encargoForm.get('idDocente')?.value;

    const novosEncargos = this.encargosAtuais.map(enc => ({
      subArea: { id: enc.idSubarea },
      percentualAtuacao: enc.percentual
    }));

    this.docenteService.atualizarEncargos(idDocente, novosEncargos).subscribe({
      next: () => {
        Swal.fire('Sucesso', 'Encargos vinculados com sucesso!', 'success').then(() => {
          void this.router.navigate(['/docente-encargos/visualizar']);
        });
      },
      error: (err) => {
        const msg = err.error && typeof err.error === 'string' ? err.error : 'Falha ao salvar encargos.';
        void Swal.fire('Erro', msg, 'error');
      }
    });
  }

  cancelar() {
    void this.router.navigate(['/docente-encargos/visualizar']);
  }
}
