
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CursoDTO } from 'shared-core';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CursoService {

  private apiUrl = 'http://localhost:8080/cursos';

  constructor(private http: HttpClient) {}

  create(dto: CursoDTO): Observable<CursoDTO> {
    return this.http.post<CursoDTO>(this.apiUrl, dto).pipe(
      tap(() => console.log('Curso criado com sucesso')),
      catchError(error => {
        console.error('Erro ao criar curso', error);
        return of(error);
      })
    );
  }

  listarTodos(): Observable<CursoDTO[]> {
    return this.http.get<CursoDTO[]>(this.apiUrl).pipe(
      tap(() => console.log('Cursos lidos com sucesso')),
      catchError(error => {
        console.error('Erro ao ler cursos', error);
        return of(error);
      })
    );
  }

  update(id: number, dto: CursoDTO): Observable<CursoDTO> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<CursoDTO>(url, dto).pipe(
      tap(() => console.log(`Curso ${id} editado com sucesso`)),
      catchError(error => {
        console.error(`Erro ao editar curso ${id}`, error);
        return of(error);
      })
    );
  }

  delete(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`Curso ${id} excluído com sucesso`)),
      catchError(error => {
        console.error(`Erro ao excluir curso ${id}`, error);
        return of(error);
      })
    );
  }


}
