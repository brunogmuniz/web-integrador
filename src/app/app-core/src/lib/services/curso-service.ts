import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CursoDTO } from '../dto/Curso.dto';
import {environment} from "../../../../../environments/enviroment";

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  private apiUrl = `${environment.apiUrl}/cursos`;

  constructor(private http: HttpClient) {}

  create(dto: CursoDTO): Observable<CursoDTO> {
    return this.http.post<CursoDTO>(this.apiUrl, dto).pipe(
      tap(() => console.log('Curso criado com sucesso')),
      catchError(error => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  findAll(): Observable<CursoDTO[]> {
    return this.http.get<CursoDTO[]>(this.apiUrl).pipe(
      tap(() => console.log('Cursos lidos com sucesso')),
      catchError(error => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  update(uuid: string, dto: CursoDTO): Observable<CursoDTO> {
    const url = `${this.apiUrl}/${uuid}`;
    return this.http.put<CursoDTO>(url, dto).pipe(
      tap(() => console.log(`Curso ${uuid} editado com sucesso`)),
      catchError(error => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  delete(uuid: string): Observable<void> {
    const url = `${this.apiUrl}/${uuid}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`Curso ${uuid} excluído com sucesso`)),
      catchError(error => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }
}
