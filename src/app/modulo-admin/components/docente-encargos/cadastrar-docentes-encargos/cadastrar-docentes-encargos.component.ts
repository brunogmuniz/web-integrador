import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DocenteDTO, DocenteSubAreaPercentualDTO, DocenteService, SubareaConhecimentoService, SubareaConhecimentoDTO } from "app-core";
import { ActivatedRoute, Router } from "@angular/router";
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
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.carregarDadosIniciais();
  }

  private initForms() {
    this.encargoForm = this.fb.group({ idDocente: [null, Validators.required] });
    this.subForm = this.fb.group({
      subareaSelecionada: [null, Validators.required],
      percentual: [null, [Validators.required, Validators.min(0.1)]]
    });
  }

  private carregarDadosIniciais() {
    this.subareaService.listarTodos().subscribe(res => this.agruparSubareasPorArea(res));
    this.docenteService.listarTodos().subscribe(res => {
      this.docentesDisponiveis = res;
      this.verificarEdicao();
    });
  }

  private verificarEdicao() {
    const uuid = this.route.snapshot.paramMap.get('id');

    if (uuid) {
      this.modoEdicao = true;
      this.encargoForm.get('idDocente')?.setValue(uuid);
      this.encargoForm.get('idDocente')?.disable();
      this.carregarEncargosDocente(uuid);
    }
  }

  private carregarEncargosDocente(uuid: string) {
    this.docenteService.listarTodosDetalhado().subscribe(detalhes => {
      const docente = detalhes.find(d => d.uuidDocente === uuid);

      if (docente && docente.subAreas) {
        this.encargosAtuais = docente.subAreas.map(sa => ({
          uuidSubarea: sa.uuidSubarea,
          nomeSubarea: sa.nomeSubarea,
          uuidArea: sa.uuidArea,
          nomeArea: sa.nomeArea,
          percentual: sa.percentual
        }));
      }
    });
  }

  agruparSubareasPorArea(subareas: SubareaConhecimentoDTO[]) {
    if (!subareas) return;
    const mapAgrupado = new Map<string, SubareaConhecimentoDTO[]>();

    subareas.forEach(sub => {
      const nomeArea = sub.area?.nome?.trim() || 'Geral';
      if (!mapAgrupado.has(nomeArea)) mapAgrupado.set(nomeArea, []);
      mapAgrupado.get(nomeArea)?.push(sub);
    });

    this.areasAgrupadas = Array.from(mapAgrupado, ([nomeArea, subareas]) => ({
      nomeArea,
      subareas: subareas.sort((a, b) => a.nome.localeCompare(b.nome))
    })).sort((a, b) => a.nomeArea.localeCompare(b.nomeArea));
  }

  adicionarEncargo() {
    if (this.subForm.invalid) return;
    const sub = this.subForm.get('subareaSelecionada')?.value;
    const perc = this.subForm.get('percentual')?.value;

    if (this.encargosAtuais.some(e => e.uuidSubarea === sub.uuid)) {
      void Swal.fire('Ops', 'Subárea já adicionada.', 'warning');
      return;
    }

    this.encargosAtuais.push({
      uuidSubarea: sub.uuid,
      nomeSubarea: sub.nome,
      uuidArea: sub.area?.uuid,
      nomeArea: sub.area?.nome ?? '',
      percentual: perc
    });
    this.subForm.reset();
  }

  removerEncargo(index: number) {
    this.encargosAtuais.splice(index, 1);
  }

  getTotalCarga(): number {
    return this.encargosAtuais.reduce((acc, e) => acc + e.percentual, 0);
  }

  get podeSalvar(): boolean {
    const total = this.getTotalCarga();
    return (this.modoEdicao || this.encargoForm.valid) && this.encargosAtuais.length > 0 && total <= 100.001;
  }

  onSubmit() {
    if (!this.podeSalvar) {
      void Swal.fire('Atenção', 'Carga total não pode exceder 100%.', 'warning');
      return;
    }

    const uuidDocente = this.encargoForm.getRawValue().idDocente;
    const novosEncargos = this.encargosAtuais.map(enc => ({
      subArea: { uuid: enc.uuidSubarea },
      percentualAtuacao: enc.percentual
    }));

    this.docenteService.atualizarEncargos(uuidDocente, novosEncargos).subscribe({
      next: () => {
        void Swal.fire('Sucesso', 'Dados salvos!', 'success').then(() => {
          void this.router.navigate(['/docente-encargos/visualizar']);
        });
      },
      error: (err) => {
        void Swal.fire('Erro', err.error?.message || 'Erro ao salvar.', 'error');
      }
    });
  }

  cancelar() {
    void this.router.navigate(['/docente-encargos/visualizar']);
  }

  get cSub() { return this.subForm.controls; }
}
