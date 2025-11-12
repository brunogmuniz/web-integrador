import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DepartamentoDTO} from 'shared-core/src/lib/dto/Departamento.dto';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {DisciplinaDTO} from 'shared-core';

@Injectable({
  providedIn: 'root'
})
export class DisciplinaService {
  private apiUrl = 'http://localhost:8080/disciplinas';

  constructor(private http: HttpClient) {}

  create(dto: DisciplinaDTO): Observable<DisciplinaDTO> {
    return this.http.post<DisciplinaDTO>(this.apiUrl, dto).pipe(
      tap(() => console.log('Disciplina criada com sucesso')),
      catchError(error => {
        console.error('Erro ao criar Disciplina', error);
        return of(error);
      })
    );
  }
  listarTodos(): Observable<DisciplinaDTO[]> {
    return this.http.get<DisciplinaDTO[]>(this.apiUrl).pipe(
      tap(() => console.log('Disciplinas lidas com sucesso')),
      catchError(error => {
        console.error('Erro ao ler Disciplina', error);
        return of(error);
      })
    );
  }

  delete(id: number): Observable<void> { //
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`Disciplina ${id} excluída com sucesso`)),
      catchError(error => {
        console.error(`Erro ao excluir Disciplina${id}`, error);
        return of(error);
      })
    );
  }

  update(id: number, dto: DisciplinaDTO): Observable<DisciplinaDTO> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<DisciplinaDTO>(url, dto).pipe(
      tap(() => console.log(`Disciplina ${id} editado com sucesso`)),
      catchError(error => {
        console.error(`Erro ao editar Disciplina ${id}`, error);
        return of(error);
      })
    );
  }
}
