import {Component, OnInit} from '@angular/core';
import {AreaConhecimentoDTO} from "../../../../app-core/src/lib/dto/AreaConhecimento.dto";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AreaConhecimentoService} from "../../../../app-core/src/lib/services/area-conhecimento-service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-cadastrar-area-conhecimento',
  templateUrl: './cadastrar-area-conhecimento.component.html',
  styleUrls: ['./cadastrar-area-conhecimento.component.scss']
})
export class CadastrarAreaConhecimentoComponent implements OnInit {
  areaForm!: FormGroup;
  areas: AreaConhecimentoDTO[] = [];


  constructor(
    private fb: FormBuilder,
    private areaService: AreaConhecimentoService,
  private router: Router
  ) {}

  ngOnInit(): void {
    this.areaForm = this.fb.group({
      nome: ['', Validators.required],
      sigla: ['', Validators.required],
      cargaHoraria: ['', [Validators.required, Validators.min(1)]],
    });

    this.loadAreas();
  }

  get c(): { [key: string]: FormControl } {
    return this.areaForm.controls as { [key: string]: FormControl };
  }

  trackByAreaId(index: number, item: AreaConhecimentoDTO) {
    return item.id;
  }

  loadAreas(): void {
    this.areaService.listarTodos().subscribe({
      next: (data) => this.areas = data,
      error: (err) => console.error('Erro ao carregar áreas:', err)
    });
  }

  onDelete(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta área?')) {
      this.areaService.delete(id).subscribe({
        next: () => {
          this.areas = this.areas.filter(a => a.id !== id);
        },
        error: (err) => console.error('Erro ao deletar área:', err)
      });
    }
  }

  onSubmit(): void {
    if (this.areaForm.valid) {
      this.areaService.create(this.areaForm.value).subscribe({
        next: (resposta) => {
          console.log('Área cadastrada com sucesso:', resposta);
          // Limpar formulário e atualizar lista
          this.areaForm.reset();
          this.loadAreas();
        },
        error: (erro) => {
          console.error('Erro ao criar área:', erro);
        }
      });
    } else {
      console.warn('Formulário inválido. Verifique os campos.');
      this.areaForm.markAllAsTouched();
    }
  }
  cancelar(): void {
    void this.router.navigate(['/sub-area']);
  }
}
