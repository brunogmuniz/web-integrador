import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {DocenteDTO} from 'shared-core/src/lib/dto/Docente.dto'
import { DocenteDetalheDTO } from '../dto/DocenteDetalhe.dto';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {
  private apiUrl = 'http://localhost:8080/docentes';

  constructor(private http: HttpClient) {}

  create(dto: DocenteDTO): Observable<DocenteDTO> {
    return this.http.post<DocenteDTO>(this.apiUrl, dto).pipe(
      tap(() => console.log('Docente criada com sucesso')),
      catchError(error => {
        console.error('Erro ao criar Docente', error);
        throw error;
      })
    );
  }

  listarTodos(): Observable<DocenteDTO[]> {
    return this.http.get<any>(`${this.apiUrl}?size=2000`).pipe(
      map(response => response.content),
      tap(() => console.log('Docentes lidos com sucesso')),
      catchError(error => {
        console.error('Erro ao ler Docente', error);
        return of([]);
      })
    );
  }

  findById(id: number): Observable<DocenteDetalheDTO> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<DocenteDetalheDTO>(url).pipe(
      tap(() => console.log(`Detalhes do Docente ${id} lidos com sucesso`)),
      catchError(error => {
        console.error(`Erro ao ler detalhes do Docente ${id}`, error);
        return of(null as any);
      })
    );
  }

  getById(id: number): Observable<DocenteDTO> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<DocenteDTO>(url).pipe(
      tap(() => console.log(`Docente ${id} lido com sucesso`)),
      catchError(error => {
        console.error(`Erro ao ler Docente ${id}`, error);
        throw error;
      })
    );
  }

  delete(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`Docente ${id} excluída com sucesso`)),
      catchError(error => {
        console.error(`Erro ao excluir Docente${id}`, error);
        throw error;
      })
    );
  }
  listarTodosDetalhado(): Observable<DocenteDetalheDTO[]> {
    const url = `${this.apiUrl}/detalhes/all`;
    return this.http.get<DocenteDetalheDTO[]>(url).pipe(
      tap(() => console.log('Detalhes dos Docentes lidos com sucesso (rota otimizada)')),
      catchError(error => {
        console.error('Erro ao ler detalhes dos Docentes', error);
        return of([]);
      })
    );
  }
  update(id: number, dto: DocenteDTO): Observable<DocenteDTO> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<DocenteDTO>(url, dto).pipe(
      tap(() => console.log(`Docente ${id} editado com sucesso`)),
      catchError(error => {
        console.error(`Erro ao editar Docente ${id}`, error);
        return of(error);
      })
    );
  }

  atualizarEncargos(docenteId: number, encargos: any[]): Observable<void> {
    const url = `${this.apiUrl}/${docenteId}/encargos`;
    return this.http.put<void>(url, encargos).pipe(
      tap(() => console.log(`Encargos atualizados`)),
      catchError(error => {
        console.error('Erro ao atualizar encargos', error);
        throw error;
      })
    );
  }
}
