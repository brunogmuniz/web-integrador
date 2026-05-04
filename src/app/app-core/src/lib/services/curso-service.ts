import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import { CursoDTO } from '../dto/Curso.dto';
import {environment} from "../../../../../environments/environment";
import {RespostaPaginada} from "app-core/lib/dto/paginacao/resposta-paginada.dto";

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

  findAll(pagina: number = 0, tamanho: number = 15): Observable<RespostaPaginada<CursoDTO>> {
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('itensPorPagina', tamanho.toString());

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
        } as RespostaPaginada<CursoDTO>;
      }),
      catchError(error => throwError(() => error))
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


  buscarPorId(uuid: string): Observable<CursoDTO> {
    return this.http.get<CursoDTO>(`${this.apiUrl}/${uuid}`);
  }
}
