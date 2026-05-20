import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { OfertaDTO, OfertaService } from 'app-core';

@Component({
  selector: 'app-cadastrar-oferta',
  templateUrl: './cadastrar-oferta.component.html',
  styleUrls: ['../oferta.component.scss']
})
export class CadastrarOfertaComponent implements OnInit {
  form!: FormGroup;
  uuidOferta?: string;
  modoEdicao = false;
  loading = false;

  semestres = [
    { valor: '1', label: '1º Semestre' },
    { valor: '2', label: '2º Semestre' }
  ];

  constructor(
    private fb: FormBuilder,
    private ofertaService: OfertaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      ano: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      semestre: ['1', Validators.required],
      ativo: [true]
    });

    const uuid = this.route.snapshot.paramMap.get('id');
    if (uuid) {
      this.uuidOferta = uuid;
      this.modoEdicao = true;
      this.carregarOferta(uuid);
    }
  }

  carregarOferta(uuid: string): void {
    this.loading = true;
    this.ofertaService.findById(uuid).subscribe({
      next: (oferta) => {
        this.form.patchValue(oferta);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        void Swal.fire('Erro', 'Não foi possível carregar a oferta.', 'error');
        this.cancelar();
      }
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: OfertaDTO = this.form.value;
    const request$ = this.modoEdicao && this.uuidOferta
      ? this.ofertaService.update(this.uuidOferta, payload)
      : this.ofertaService.create(payload);

    this.loading = true;
    request$.subscribe({
      next: () => {
        this.loading = false;
        void Swal.fire('Sucesso', 'Oferta salva com sucesso.', 'success');
        void this.router.navigate(['/oferta/visualizar']);
      },
      error: (err) => {
        this.loading = false;
        const message = err?.error?.message || 'Não foi possível salvar a oferta.';
        void Swal.fire('Erro', message, 'error');
      }
    });
  }

  cancelar(): void {
    void this.router.navigate(['/oferta/visualizar']);
  }
}
