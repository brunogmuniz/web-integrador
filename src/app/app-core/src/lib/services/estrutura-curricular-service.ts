import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { EstruturaCurricularDTO } from '../dto/EstruturaCurricular.dto';
import {catchError, map, tap} from "rxjs/operators";
import {environment} from "../../../../../environments/environment";
import { RespostaPaginada } from '../dto/paginacao/resposta-paginada.dto';

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
    return this.http.get<EstruturaCurricularDTO[]>(`${this.apiUrl}/curso/${cursoId}`).pipe(
      catchError(error => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  findAll(pagina: number = 0, tamanho: number = 15, busca: string = ''): Observable<RespostaPaginada<EstruturaCurricularDTO>> {
    let params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('itensPorPagina', tamanho.toString());
    if (busca?.trim()) {
      params = params.set('busca', busca.trim());
    }

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => {
        let lista = response?.conteudo || response?.content || response?.data || [];
        const metaData = response?.meta || response?.data?.meta || response || {};

        return {
          conteudo: lista,
          meta: {
            totalElementos: metaData.totalElementos ?? metaData.totalElements ?? metaData.total ?? 0,
            tamanho: metaData.tamanho ?? metaData.size ?? metaData.perPage ?? tamanho,
            paginaAtual: metaData.paginaAtual ?? metaData.number ?? metaData.page ?? pagina,
            totalPaginas: metaData.totalPaginas ?? metaData.totalPages ?? metaData.pages ?? 0
          }
        } as RespostaPaginada<EstruturaCurricularDTO>;
      }),
      tap(() => console.log('Estruturas Curriculares lidas com sucesso')),
      catchError(error => {
        console.error('Erro ao listar estruturas curriculares:', error);
        return throwError(() => error);
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
