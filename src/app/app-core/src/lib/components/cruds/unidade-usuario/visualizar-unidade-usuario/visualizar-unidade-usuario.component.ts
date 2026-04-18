import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import Swal from 'sweetalert2';
import { UnidadeUsuarioService } from '../../../../services/unidade-usuario.service';

@Component({
  selector: 'app-visualizar-unidade-usuario',
  templateUrl: './visualizar-unidade-usuario.component.html',
  styleUrls: ['./visualizar-unidade-usuario.component.css'],
})
export class VisualizarUnidadeUsuarioComponent implements OnInit {

  public vinculos: any[] = [];
  public vinculosFiltrados: any[] = [];

  public isCarregando = true;
  public errorMessage = '';
  public filtro = '';

  constructor(private readonly unidadeUsuarioService: UnidadeUsuarioService) {}

  ngOnInit(): void {
    this.carregarVinculos();
  }

  public carregarVinculos(): void {
    this.isCarregando = true;
    this.errorMessage = '';

    this.unidadeUsuarioService.listar(0, 50).subscribe({
      next: (res: any) => {
        console.log(res);
        this.vinculos = res?.content ?? [];
        this.vinculosFiltrados = [...this.vinculos];
        this.isCarregando = false;
      },
      error: (error: Error) => {
        this.errorMessage = `Não foi possível carregar os vínculos: ${error.message}`;
        this.isCarregando = false;
      }
    });
  }

  public aplicarFiltro(): void {
    const termo = this.filtro.toLowerCase();

    this.vinculosFiltrados = this.vinculos.filter(v =>
      v.nomeUsuario?.toLowerCase().includes(termo) ||
      v.nomeUnidade?.toLowerCase().includes(termo) ||
      v.papel?.toLowerCase().includes(termo)
    );
  }
  formatarPapel(papel: string): string {
    return papel.replaceAll('_', ' ');
  }
  public confirmarStatus(vinculo: any, ativar: boolean): void {
    const acao = ativar ? 'ativar' : 'inativar';

    Swal.fire({
      title: `Deseja realmente ${acao}?`,
      text: `O vínculo de "${vinculo.nomeUsuario}" será ${ativar ? 'ativado' : 'inativado'}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: ativar ? '#28a745' : '#f0ad4e',
      cancelButtonColor: '#3085d6',
      confirmButtonText: `Sim, ${acao}`,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.isCarregando = true;

      this.unidadeUsuarioService.atualizar(vinculo.uuid, { ativo: ativar }).subscribe({
        next: () => {
          Swal.fire('Sucesso!', `Vínculo ${acao}do com sucesso.`, 'success');
          this.carregarVinculos();
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.isCarregando = false;
          Swal.fire('Erro!', error.message, 'error');
        }
      });
    });
  }

  public confirmarExclusao(vinculo: any): void {
    Swal.fire({
      title: 'Tem certeza?',
      text: `O vínculo de "${vinculo.nomeUsuario}" será removido.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.isCarregando = true;

      this.unidadeUsuarioService.excluir(vinculo.uuid).subscribe({
        next: () => {
          Swal.fire('Sucesso!', 'Vínculo removido com sucesso.', 'success');
          this.carregarVinculos();
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.isCarregando = false;
          Swal.fire('Erro!', error.message, 'error');
        }
      });
    });
  }
}
