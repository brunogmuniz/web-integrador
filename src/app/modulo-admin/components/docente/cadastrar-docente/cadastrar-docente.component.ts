import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { DepartamentoDTO } from "../../../../app-core/src/lib/dto/Departamento.dto";
import { DocenteService } from "../../../../app-core/src/lib/services/docente-service";
import { DepartamentoService } from "../../../../app-core/src/lib/services/departamento-service";
import { Router, ActivatedRoute } from "@angular/router";
import Swal from 'sweetalert2';
import { DocenteDTO } from '../../../../app-core/src/lib/dto/Docente.dto';

@Component({
  selector: 'app-cadastrar-docente',
  templateUrl: './cadastrar-docente.component.html',
  styleUrls: ['./cadastrar-docente.component.scss']
})
export class CadastrarDocenteComponent implements OnInit {
  docenteForm!: FormGroup;
  departamentos: DepartamentoDTO[] = [];
  modoEdicao = false;
  docenteId?: number;

  constructor(
    private fb: FormBuilder,
    private docenteService: DocenteService,
    private departamentoService: DepartamentoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDepartamentos();
    this.verificarEdicao();
  }

  private initForm() {
    this.docenteForm = this.fb.group({
      nome: ['', Validators.required],
      matricula: ['', Validators.required],
      tipoVaga: [null, Validators.required],
      tipoFormacao: [null, Validators.required],
      licenciatura: [false, Validators.required],
      origemVaga: [null, Validators.required],
      departamento: ['', Validators.required],
    });
  }

  private loadDepartamentos(): void {
    this.departamentoService.getAll().subscribe(data => {
      this.departamentos = data;
    });
  }

  private verificarEdicao(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.docenteId = Number(idParam);
        this.modoEdicao = true;
        this.carregarDocente(this.docenteId);
      }
    });
  }

  private carregarDocente(id: number): void {
    this.docenteService.buscarPorId(id).subscribe({
      next: (doc: DocenteDTO) => {
        this.docenteForm.patchValue(doc);
      },
      error: (err) => {
        console.error('Erro ao carregar docente:', err);
        void Swal.fire('Erro', 'Não foi possível carregar o docente.', 'error');
        void this.router.navigate(['/docente']);
      }
    });
  }

  get c() {
    return this.docenteForm.controls as { [key: string]: FormControl };
  }

  onSubmit(): void {
    if (this.docenteForm.invalid) {
      void Swal.fire('Atenção', 'Preencha todos os campos obrigatórios.', 'warning');
      this.docenteForm.markAllAsTouched();
      return;
    }

    if (this.modoEdicao && this.docenteId) {
      this.docenteService.update(this.docenteId, this.docenteForm.value).subscribe({
        next: () => {
          void Swal.fire('Sucesso', 'Docente atualizado com sucesso!', 'success');
          void this.router.navigate(['/docente']);
        },
        error: (erro) => {
          console.error('Erro ao atualizar docente:', erro);
          void Swal.fire('Erro', 'Não foi possível atualizar o docente.', 'error');
        }
      });
    } else {
      this.docenteService.create(this.docenteForm.value).subscribe({
        next: () => {
          void Swal.fire('Sucesso', 'Docente cadastrado com sucesso!', 'success');
          void this.router.navigate(['/docente']);
        },
        error: (erro) => {
          console.error('Erro ao criar docente:', erro);
          void Swal.fire('Erro', 'Erro ao salvar docente. Verifique os dados.', 'error');
        }
      });
    }
  }

  cancelar(): void {
    void this.router.navigate(['/docente']);
  }
}
