import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { DepartamentoDTO } from "../../../../dto/Departamento.dto";
import { DocenteService } from "../../../../services/docente-service";
import { DepartamentoService } from "../../../../services/departamento-service";
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
      departamentoId: [null, Validators.required],
    });
  }

  private loadDepartamentos(): void {
    this.departamentoService.getAll().subscribe((data: DepartamentoDTO[]) => {
      this.departamentos = data;
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
        this.docenteForm.patchValue(doc);

        if (doc.departamento) {
          this.docenteForm.get('departamentoId')?.setValue(doc.departamento.id);
        } else if (doc.departamentoId) {
          this.docenteForm.get('departamentoId')?.setValue(doc.departamentoId);
        }
      },
      error: (err) => {
        console.error(err);
        void Swal.fire('Erro', 'Não foi possível carregar o docente.', 'error');
        this.cancelar();
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

    if (this.modoEdicao && this.docenteUuid) {
      this.docenteService.update(this.docenteUuid, this.docenteForm.value).subscribe({
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
      this.docenteService.create(this.docenteForm.value).subscribe({
        next: () => {
          void Swal.fire('Sucesso', 'Docente cadastrado com sucesso!', 'success');
          void this.router.navigate(['/docente']);
        },
        error: () => {
          console.error('error');
        }
      });
    }
  }

  cancelar(): void {
    void this.router.navigate(['/docente']);
  }
}
