<<<<<<< HEAD:src/app/app-core/src/lib/components/cruds/docente-encargos/cadastrar-docentes-encargos/cadastrar-docentes-encargos.component.ts
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DocenteDTO} from "../../../../dto/Docente.dto";
import {DocenteSubAreaPercentualDTO} from "../../../../dto/DocenteSubAreaPercentual.dto";
import {DocenteService} from "../../../../services/docente-service";
import {SubareaConhecimentoService} from "../../../../services/subarea-conhecimento-service";
import {Router} from "@angular/router";
import {SubareaConhecimentoDTO} from "../../../../dto/SubareaConhecimento.dto";
import Swal from "sweetalert2";

interface AreaAgrupadaView {
  nomeArea: string;
  subareas: SubareaConhecimentoDTO[];
}
=======
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocenteService, SubareaConhecimentoService, SubareaConhecimentoDTO } from 'app-core';
>>>>>>> origin/Refatoracao:src/app/modulo-admin/components/docente-encargos/cadastrar-docentes-encargos/cadastrar-docentes-encargos.component.ts

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
    this.docenteService.buscarPorId(uuid).subscribe({
      next: (response: any) => {
        if (response && response.subAreas) {
          this.docenteNome = response.nome;
          this.encargosAtuais = response.subAreas.map((sa: any) => ({
            subareaId: sa.subareaId,
            nomeArea: sa.nomeArea || 'N/A',
            nomeSubarea: sa.nomeSubarea,
            percentual: sa.percentual
          }));
        }
      }
    });
  }

  adicionarEncargo(): void {
    if (this.subForm.invalid) return;
    const subarea = this.subForm.value.subareaSelecionada;

    if (this.encargosAtuais.some(e => e.subareaId === subarea.id)) {
      alert('Esta subárea já está vinculada.');
      return;
    }

    this.encargosAtuais.push({
      subareaId: subarea.id,
      nomeArea: subarea.area?.nome || 'N/A',
      nomeSubarea: subarea.nome,
      percentual: this.subForm.value.percentual
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
      subareaId: e.subareaId,
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
        console.error('Erro ao salvar:', err);
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
