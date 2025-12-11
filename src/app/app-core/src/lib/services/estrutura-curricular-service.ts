import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import { EstruturaCurricularDto } from '../dto/EstruturaCurricular.dto';
import {DocenteDTO} from "../dto/Docente.dto";
import {catchError, map, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class EstruturaCurricularService {

  private readonly apiUrl = 'http://localhost:8080/estruturas-curriculares';

  constructor(private http: HttpClient) {}

  save(estrutura: EstruturaCurricularDto): Observable<EstruturaCurricularDto> {
    return this.http.post<EstruturaCurricularDto>(this.apiUrl, estrutura);
  }

  update(id: number, estrutura: EstruturaCurricularDto): Observable<EstruturaCurricularDto> {
    return this.http.put<EstruturaCurricularDto>(`${this.apiUrl}/${id}`, estrutura);
  }

  findById(id: number): Observable<EstruturaCurricularDto> {
    return this.http.get<EstruturaCurricularDto>(`${this.apiUrl}/${id}`);
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
  delete(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`Docente ${id} excluída com sucesso`)),
      catchError(error => {
        console.error(`Erro ao excluir Docente${id}`, error);
        throw error;
      })
    );
  }
}
