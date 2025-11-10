import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DisciplinaDTO} from 'shared-core/src/lib/dto/Disciplina.dto';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {EstruturaCurricularDTO} from 'shared-core/src/lib/dto/EstruturaCurricular.dto';

@Injectable({
  providedIn: 'root'
})
export class EstruturaCurricularService {
  private apiUrl = 'http://localhost:8080/estrutura-curricular';

  constructor(private http: HttpClient) {}

  create(dto: EstruturaCurricularDTO): Observable<EstruturaCurricularDTO> {
    return this.http.post<EstruturaCurricularDTO>(this.apiUrl, dto).pipe(
      tap(() => console.log('EstruturaCurricular criada com sucesso')),
      catchError(error => {
        console.error('Erro ao criar EstruturaCurricular', error);
        return of(error);
      })
    );
  }
  listarTodos(): Observable<EstruturaCurricularDTO[]> {
    return this.http.get<EstruturaCurricularDTO[]>(this.apiUrl).pipe(
      tap(() => console.log('EstruturaCurricular lidas com sucesso')),
      catchError(error => {
        console.error('Erro ao ler EstruturaCurricular', error);
        return of(error);
      })
    );
  }

  delete(id: number): Observable<void> { //
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`EstruturaCurricular ${id} excluída com sucesso`)),
      catchError(error => {
        console.error(`Erro ao excluir EstruturaCurricular${id}`, error);
        return of(error);
      })
    );
  }

  update(id: number, dto: EstruturaCurricularDTO): Observable<EstruturaCurricularDTO> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<EstruturaCurricularDTO>(url, dto).pipe(
      tap(() => console.log(`EstruturaCurricular ${id} editado com sucesso`)),
      catchError(error => {
        console.error(`Erro ao editar EstruturaCurricular ${id}`, error);
        return of(error);
      })
    );
  }
}
