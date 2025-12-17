import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { EstruturaCurricularDto } from '../dto/EstruturaCurricular.dto';
import {catchError, map, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class EstruturaCurricularService {

  private readonly apiUrl = 'http://localhost:8080/estruturas-curriculares';

  constructor(private http: HttpClient) {}

  save(estrutura: EstruturaCurricularDto): Observable<EstruturaCurricularDto> {
    return this.http.post<EstruturaCurricularDto>(this.apiUrl, estrutura).pipe(
      tap(() => console.log('Estrutura Curricular criada com sucesso')),
      catchError(error => {
        console.error('Erro ao salvar Estrutura Curricular', error);
        return throwError(() => error);
      })
    );
  }

  update(id: number, estrutura: EstruturaCurricularDto): Observable<EstruturaCurricularDto> {
    return this.http.put<EstruturaCurricularDto>(`${this.apiUrl}/${id}`, estrutura).pipe(
      tap(() => console.log(`Estrutura Curricular ${id} atualizada com sucesso`)),
      catchError(error => {
        console.error(`Erro ao atualizar Estrutura Curricular ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  findById(id: number): Observable<EstruturaCurricularDto> {
    return this.http.get<EstruturaCurricularDto>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Erro ao buscar Estrutura Curricular ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  findAll(): Observable<EstruturaCurricularDto[]> {
    return this.http.get<any>(`${this.apiUrl}?size=2000`).pipe(
      map(response => response.content || response),
      tap(() => console.log('Estruturas Curriculares lidas com sucesso (ajustado para paginação)')),
      catchError(error => {
        console.error('Erro ao buscar Estruturas Curriculares', error);
        return of([]);
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log(`Estrutura Curricular ${id} excluída com sucesso`)),
      catchError(error => {
        console.error(`Erro ao excluir Estrutura Curricular ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  listarTodos(): Observable<EstruturaCurricularDto[]> {
    return this.http.get<any>(`${this.apiUrl}?size=2000`).pipe(
      map(response => response.content),
      tap(() => console.log('Estruturas lidss com sucesso')),
      catchError(error => {
        console.error('Erro ao ler Estruturas', error);
        return of([]);
      })
    );
  }
}
