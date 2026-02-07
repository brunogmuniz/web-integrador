import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { EstruturaCurricularDto } from '../dto/EstruturaCurricular.dto';
import {catchError, map, tap} from "rxjs/operators";
import {environment} from "../../../../../environments/enviroment";

@Injectable({
  providedIn: 'root'
})
export class EstruturaCurricularService {

  private readonly apiUrl = `${environment.apiUrl}/estruturas-curriculares`;

  constructor(private http: HttpClient) {}

  save(estrutura: EstruturaCurricularDto): Observable<EstruturaCurricularDto> {
    return this.http.post<EstruturaCurricularDto>(this.apiUrl, estrutura).pipe(
      tap(() => console.log('Estrutura Curricular criada com sucesso')),
      catchError(error => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  update(uuid: string, estrutura: EstruturaCurricularDto): Observable<EstruturaCurricularDto> {
    return this.http.put<EstruturaCurricularDto>(`${this.apiUrl}/${uuid}`, estrutura).pipe(
      tap(() => console.log(`Estrutura Curricular ${uuid} atualizada com sucesso`)),
      catchError(error => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  findById(uuid: string): Observable<EstruturaCurricularDto> {
    return this.http.get<EstruturaCurricularDto>(`${this.apiUrl}/${uuid}`).pipe(
      catchError(error => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  findAll(): Observable<EstruturaCurricularDto[]> {
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
