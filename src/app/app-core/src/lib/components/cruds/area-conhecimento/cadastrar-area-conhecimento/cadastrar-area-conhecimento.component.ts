import { Component, OnInit } from '@angular/core';
import { AreaConhecimentoDTO, RespostaPaginada } from "app-core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AreaConhecimentoService } from "app-core";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cadastrar-area-conhecimento',
  templateUrl: './cadastrar-area-conhecimento.component.html',
  styleUrls: ['./cadastrar-area-conhecimento.component.scss']
})
export class CadastrarAreaConhecimentoComponent implements OnInit {

  areaForm!: FormGroup;
  areas: AreaConhecimentoDTO[] = [];

  areaUuid?: string;
  modoEdicao = false;

  constructor(
    private fb: FormBuilder,
    private areaService: AreaConhecimentoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.areaForm = this.fb.group({
      uuid: [],
      nome: ['', Validators.required],
      sigla: ['', Validators.required],
      cargaHorariaTotal: ['', [Validators.required, Validators.min(1)]],
    });

    this.route.paramMap.subscribe(params => {
      const uuidParam = params.get('id');

      if (uuidParam) {
        this.areaUuid = uuidParam;
        this.modoEdicao = true;
        this.carregarArea(this.areaUuid);
      } else {
        this.modoEdicao = false;
        this.areaUuid = undefined;
        this.areaForm.reset();
      }
    });

    this.loadAreas();
  }

  get c(): { [key: string]: FormControl } {
    return this.areaForm.controls as { [key: string]: FormControl };
  }

  loadAreas(): void {
    this.areaService.findAll(0, 100).subscribe({
      next: (res: RespostaPaginada<AreaConhecimentoDTO>) => {
        this.areas = Array.isArray(res?.conteudo) ? res.conteudo : [];
      },
      error: (err: any) => {
        console.error('Falha ao carregar as áreas de conhecimento no formulário:', err);
      }
    });
  }

  carregarArea(uuid: string): void {
    this.areaService.buscarPorId(uuid).subscribe({
      next: (area: AreaConhecimentoDTO) => {
        this.areaForm.patchValue(area);
      },
      error: (err: Error) => {
        console.error(`Falha ao carregar dados da área ${uuid} para edição:`, err);
      }
    });
  }

  onSubmit(): void {
    if (this.areaForm.invalid) {
      this.areaForm.markAllAsTouched();
      return;
    }

    const areaDto: AreaConhecimentoDTO = this.areaForm.value;

    if (this.modoEdicao && this.areaUuid) {
      areaDto.uuid = this.areaUuid;

      this.areaService.update(this.areaUuid, areaDto).subscribe({
        next: () => {
          this.exibirSucesso('Atualizada!');
          void this.router.navigate(['/area/visualizar']);
        },
        error: (err: Error) => {
          console.error('Falha ao atualizar área de conhecimento:', err);
          this.exibirErro('Não foi possível atualizar a área.');
        }
      });
    } else {
      this.areaService.create(areaDto).subscribe({
        next: () => {
          this.exibirSucesso('Cadastrada!');
          this.areaForm.reset();
          this.loadAreas();
        },
        error: (err: Error) => {
          console.error('Falha ao cadastrar nova área de conhecimento:', err);
          this.exibirErro('Não foi possível cadastrar a área.');
        }
      });
    }
  }

  private exibirSucesso(titulo: string) {
    void Swal.fire({
      title: titulo,
      text: `Área ${titulo.toLowerCase()} com sucesso.`,
      icon: 'success',
      timer: 1800,
      showConfirmButton: false
    });
  }

  private exibirErro(mensagem: string) {
    void Swal.fire({
      title: 'Erro!',
      text: mensagem,
      icon: 'error'
    });
  }

  cancelar(): void {
    void this.router.navigate(['/area/visualizar']);
  }
}
