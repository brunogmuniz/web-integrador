import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map} from 'rxjs/operators';
import { DisciplinaDTO } from '../dto/Disciplina.dto';
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DisciplinaService {
  private apiUrl = `${environment.apiUrl}/disciplinas`;

  constructor(private http: HttpClient) {}

  create(dto: DisciplinaDTO): Observable<DisciplinaDTO> {
    return this.http.post<DisciplinaDTO>(this.apiUrl, dto).pipe(
      tap(() => console.log('Disciplina criada com sucesso')),
      catchError(error => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  findAll(): Observable<DisciplinaDTO[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.content),
      tap(() => console.log('Disciplinas lidas com sucesso')),
      catchError(error => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  findById(uuid: string): Observable<DisciplinaDTO> {
    const url = `${this.apiUrl}/${uuid}`;
    return this.http.get<DisciplinaDTO>(url).pipe(
      tap(() => console.log(`Disciplina ${uuid} recuperada com sucesso`)),
      catchError(error => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  delete(uuid: string): Observable<void> {
    const url = `${this.apiUrl}/${uuid}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`Disciplina ${uuid} excluída com sucesso`)),
      catchError(error => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  update(uuid: string, dto: DisciplinaDTO): Observable<DisciplinaDTO> {
    const url = `${this.apiUrl}/${uuid}`;
    return this.http.put<DisciplinaDTO>(url, dto).pipe(
      tap(() => console.log(`Disciplina ${uuid} editado com sucesso`)),
      catchError(error => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }
}
