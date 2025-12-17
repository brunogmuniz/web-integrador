import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map} from 'rxjs/operators';
import { DisciplinaDTO } from '../dto/Disciplina.dto';

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
        return throwError(() => error);
      })
    );
  }

  findAll(): Observable<DisciplinaDTO[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.content),
      tap(() => console.log('Disciplinas lidas com sucesso')),
      catchError(error => {
        console.error('Erro ao ler Disciplina', error);
        return throwError(() => error);
      })
    );
  }

  findById(id: number): Observable<DisciplinaDTO> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<DisciplinaDTO>(url).pipe(
      tap(() => console.log(`Disciplina ${id} recuperada com sucesso`)),
      catchError(error => {
        console.error(`Erro ao recuperar Disciplina ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  delete(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`Disciplina ${id} excluída com sucesso`)),
      catchError(error => {
        console.error(`Erro ao excluir Disciplina ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  update(id: number, dto: DisciplinaDTO): Observable<DisciplinaDTO> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<DisciplinaDTO>(url, dto).pipe(
      tap(() => console.log(`Disciplina ${id} editado com sucesso`)),
      catchError(error => {
        console.error(`Erro ao editar Disciplina ${id}`, error);
        return throwError(() => error);
      })
    );
  }
}
