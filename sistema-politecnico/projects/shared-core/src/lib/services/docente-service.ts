import { Injectable } from '@angular/core';
import {DisciplinaDTO} from 'shared-core/src/lib/dto/Disciplina.dto';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {DocenteDTO} from 'shared-core/src/lib/dto/Docente.dto'

@Injectable({
  providedIn: 'root'
})
export class DocenteService {
  private apiUrl = 'http://localhost:8080/docentes';

  constructor(private http: HttpClient) {}
  create(dto: DocenteDTO): Observable<DisciplinaDTO> {
    return this.http.post<DocenteDTO>(this.apiUrl, dto).pipe(
      tap(() => console.log('Docente criada com sucesso')),
      catchError(error => {
        console.error('Erro ao criar Docente', error);
        return of(error);
      })
    );
  }
  listarTodos(): Observable<DocenteDTO[]> {
    return this.http.get<DocenteDTO[]>(this.apiUrl).pipe(
      tap(() => console.log('Docente lidas com sucesso')),
      catchError(error => {
        console.error('Erro ao ler Docente', error);
        return of(error);
      })
    );
  }

  delete(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`Docente ${id} excluída com sucesso`)),
      catchError(error => {
        console.error(`Erro ao excluir Docente${id}`, error);
        return of(error);
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

}
