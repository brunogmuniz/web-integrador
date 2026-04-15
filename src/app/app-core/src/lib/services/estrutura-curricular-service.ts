import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { EstruturaCurricularDTO } from '../dto/EstruturaCurricular.dto';
import {catchError, map, tap} from "rxjs/operators";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EstruturaCurricularService {

  private readonly apiUrl = `${environment.apiUrl}/estruturas-curriculares`;

  constructor(private http: HttpClient) {}

  save(estrutura: EstruturaCurricularDTO): Observable<EstruturaCurricularDTO> {
    return this.http.post<EstruturaCurricularDTO>(this.apiUrl, estrutura).pipe(
      tap(() => console.log('Estrutura Curricular criada com sucesso')),
      catchError(error => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  update(uuid: string, estrutura: EstruturaCurricularDTO): Observable<EstruturaCurricularDTO> {
    return this.http.put<EstruturaCurricularDTO>(`${this.apiUrl}/${uuid}`, estrutura).pipe(
      tap(() => console.log(`Estrutura Curricular ${uuid} atualizada com sucesso`)),
      catchError(error => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  findById(uuid: string): Observable<EstruturaCurricularDTO> {
    return this.http.get<EstruturaCurricularDTO>(`${this.apiUrl}/${uuid}`).pipe(
      catchError(error => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }
  findByCurso(cursoId: number): Observable<EstruturaCurricularDTO[]> {
    return this.http.get<EstruturaCurricularDTO[]>(`${this.apiUrl}/curso/${cursoId}`);
  }
  findAll(): Observable<EstruturaCurricularDTO[]> {
    return this.http.get<any>(`${this.apiUrl}?size=2000`).pipe(
      map(response => response?.content || response || []),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

  delete(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${uuid}`).pipe(
      tap(() => console.log(`Estrutura Curricular ${uuid} excluída com sucesso`)),
      catchError(error => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }
}
