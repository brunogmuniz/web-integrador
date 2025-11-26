import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import {
  DocenteService, SubareaConhecimentoService,
  SubareaConhecimentoDTO, DocenteSubAreaPercentualDTO,
} from 'shared-core';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-docente-encargos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  providers: [DocenteService, SubareaConhecimentoService],
  templateUrl: './editar-docente-encargos.html'
})
export class EditarDocenteEncargos implements OnInit {
  docenteEmEdicaoNome = '';
  docenteId!: number;
  subForm!: FormGroup;
  areasAgrupadas: Map<string, SubareaConhecimentoDTO[]> = new Map();
  encargosAtuais: DocenteSubAreaPercentualDTO[] = [];
  totalEncargos: number = 0;

  constructor(
    private fb: FormBuilder,
    private docenteService: DocenteService,
    private subareaService: SubareaConhecimentoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.carregarApoio();

    this.route.paramMap.pipe(
      map(p => p.get('id')),
      switchMap(id => {
        if (!id) return of(null);
        this.docenteId = +id;
        return this.docenteService.findById(this.docenteId);
      })
    ).subscribe({
      next: (detalhe) => {
        if (detalhe) {
          this.docenteEmEdicaoNome = detalhe.nome;
          this.encargosAtuais = [...detalhe.subAreas];
          this.totalEncargos = detalhe.totalEncargos || 0;
        }
      },
      error: () => {
        void Swal.fire('Erro', 'Falha ao carregar docente', 'error');
      }
    });
  }

  private initForms() {
    this.subForm = this.fb.group({
      subareaSelecionada: [null, Validators.required],
      percentual: ['', [Validators.required, Validators.min(0.1)]]
    });
  }

  get cSub() { return this.subForm.controls as { [key: string]: FormControl }; }

  getTotalCarga(): number {
    return this.encargosAtuais.reduce((acc, e) => acc + e.percentual, 0);
  }

  carregarApoio() {
    this.subareaService.listarTodos().subscribe(res => {
      this.areasAgrupadas = new Map();
      res.forEach(sub => {
        const area = sub.area?.nome || 'Geral';
        if(!this.areasAgrupadas.has(area)) this.areasAgrupadas.set(area, []);
        this.areasAgrupadas.get(area)?.push(sub);
      });
    });
  }

  adicionarEncargo() {
    if (this.subForm.invalid) return;
    const sub = this.subForm.get('subareaSelecionada')?.value;
    const perc = this.subForm.get('percentual')?.value;

    if (this.encargosAtuais.some(e => e.idSubarea === sub.id)) {
      void Swal.fire('Ops', 'Esta subárea já foi adicionada.', 'warning');
      return;
    }

    this.encargosAtuais.push({
      id: 0,
      idSubarea: sub.id, nomeSubarea: sub.nome,
      idArea: sub.area?.id ?? 0, nomeArea: sub.area?.nome ?? '',
      percentual: parseFloat(perc)
    });
    this.subForm.reset();
  }

  removerEncargo(index: number) {
    this.encargosAtuais.splice(index, 1);
  }

  onSubmit() {
    const novosEncargos = this.encargosAtuais.map(e => ({
      subArea: { id: e.idSubarea },
      percentualAtuacao: e.percentual
    }));

    this.docenteService.atualizarEncargos(this.docenteId, novosEncargos)
      .subscribe({
        next: () => {
          Swal.fire('Sucesso', 'Encargos atualizados!', 'success').then(() => {
            void this.router.navigate(['/docente-encargos/visualizar']);
          });
        },
        error: () => {
          void Swal.fire('Erro', 'Erro ao salvar alterações.', 'error');
        }
      });
  }

  cancelar() {
    void this.router.navigate(['/docente-encargos/visualizar']);
  }
}
