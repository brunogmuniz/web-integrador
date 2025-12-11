import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {AreaConhecimentoDTO} from "../../../../app-core/src/lib/dto/AreaConhecimento.dto";
import {SubareaConhecimentoDTO} from "../../../../app-core/src/lib/dto/SubareaConhecimento.dto";
import {AreaConhecimentoService} from "../../../../app-core/src/lib/services/area-conhecimento-service";
import {SubareaConhecimentoService} from "../../../../app-core/src/lib/services/subarea-conhecimento-service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-cadastrar-subarea-conhecimento',
  templateUrl: './cadastrar-subarea-conhecimento.component.html',
  styleUrls: ['./cadastrar-subarea-conhecimento.component.scss']
})
export class CadastrarSubareaConhecimentoComponent implements OnInit {
  subAreaForm!: FormGroup;
  areasDeConhecimento$!: Observable<AreaConhecimentoDTO[]>;
  subAreas: SubareaConhecimentoDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private subAreaService: SubareaConhecimentoService,
    private areaService: AreaConhecimentoService,
  private router: Router
  ) {}

  ngOnInit(): void {
    this.subAreaForm = this.fb.group({
      nome: ['', Validators.required],
      sigla: ['', Validators.required],
      cargaHoraria: ['', [Validators.required, Validators.min(1)]],
      areaConhecimentoId: [null, Validators.required]
    });

    this.areasDeConhecimento$ = this.areaService.listarTodos();

    this.loadSubAreas();
  }

  get c(): { [key: string]: FormControl } {
    return this.subAreaForm.controls as { [key: string]: FormControl };
  }

  trackBySubAreaId(index: number, item: SubareaConhecimentoDTO) {
    return item.id;
  }

  loadSubAreas(): void {
    this.subAreaService.listarTodos().subscribe({
      next: (data) => this.subAreas = data,
      error: (err) => console.error('Erro ao carregar subáreas:', err)
    });
  }

  onDelete(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta subárea?')) {
      this.subAreaService.delete(id).subscribe({
        next: () => this.subAreas = this.subAreas.filter(s => s.id !== id),
        error: (err) => console.error('Erro ao deletar subárea:', err)
      });
    }
  }
  cancelar(): void {
    void this.router.navigate(['/sub-area']);
  }
  onSubmit(): void {
    if (this.subAreaForm.valid) {
      this.subAreaService.create(this.subAreaForm.value).subscribe({
        next: (resposta) => {
          console.log('Subárea cadastrada com sucesso:', resposta);
          this.subAreaForm.reset();
          this.loadSubAreas();
        },
        error: (erro) => {
          console.error('Erro ao criar subárea:', erro);
        }
      });
    } else {
      console.warn('Formulário inválido. Verifique os campos.');
      this.subAreaForm.markAllAsTouched();
    }
  }



}
