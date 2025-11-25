import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { DocenteDTO, DocenteService, DepartamentoService, DepartamentoDTO} from "shared-core";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-docente',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  providers: [DocenteService, DepartamentoService],
  templateUrl: './editar-docente.html'
})
export class EditarDocente implements OnInit {
  docenteForm!: FormGroup;
  departamentos: DepartamentoDTO[] = [];
  docenteId!: number;

  constructor(
    private fb: FormBuilder,
    private docenteService: DocenteService,
    private departamentoService: DepartamentoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDepartamentos();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.docenteId = +id;
      this.loadDocente(this.docenteId);
    }
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

  get c() { return this.docenteForm.controls as { [key: string]: FormControl }; }

  loadDepartamentos() {
    this.departamentoService.getAll().subscribe(res => this.departamentos = res);
  }

  loadDocente(id: number) {
    this.docenteService.findById(id).subscribe({
      next: (detalhe) => {
        this.docenteForm.patchValue(detalhe);
        if (detalhe.departamento) {
          this.docenteForm.get('departamento')?.setValue(detalhe.departamento);
        }
      },
      error: (err) => {
        console.error(err);
        void Swal.fire('Erro', 'Não foi possível carregar os dados.', 'error');
        void this.router.navigate(['/docente']);
      }
    });
  }
  isFieldInvalid(fieldName: string): boolean {
    const field = this.docenteForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.docenteForm.valid) {
      const dto: DocenteDTO = { ...this.docenteForm.value, id: this.docenteId };

      this.docenteService.update(this.docenteId, dto).subscribe({
        next: () => {
          void Swal.fire('Sucesso', 'Docente atualizado!', 'success');
          void this.router.navigate(['/docente']);
        },
        error: (err) => {
          console.error(err);
          void Swal.fire('Erro', 'Erro ao atualizar docente.', 'error');
        }
      });
    } else {
      this.docenteForm.markAllAsTouched();
    }
  }

  cancelar() {
    void this.router.navigate(['/docente']);
  }
}
