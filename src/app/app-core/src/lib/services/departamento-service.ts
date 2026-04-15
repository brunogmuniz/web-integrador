import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { DepartamentoDTO } from '../dto/Departamento.dto';
import { environment } from "../../../../../environments/enviroment";
import { RespostaPaginada } from '../dto/paginacao/resposta-paginada.dto';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  private apiUrl = `${environment.apiUrl}/departamentos`;
  constructor(private http: HttpClient) {}

  create(dto: DepartamentoDTO): Observable<DepartamentoDTO> {
    return this.http.post<DepartamentoDTO>(this.apiUrl, dto).pipe(
      tap(() => console.log('Departamento criado com sucesso')),
      catchError(error => {
        console.error(error);
        return of(error);
      })
    );
  }

  findAll(pagina: number = 0, tamanho: number = 15): Observable<RespostaPaginada<DepartamentoDTO>> {
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('itensPorPagina', tamanho.toString());

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => {
        let lista = [];
        if (response && Array.isArray(response.data)) {
          lista = response.data;
        } else if (response?.data && Array.isArray(response.data.data)) {
          lista = response.data.data;
        } else if (response && Array.isArray(response.content)) {
          lista = response.content;
        } else if (Array.isArray(response)) {
          lista = response;
        }

        const metaData = response?.meta || response?.data?.meta || {};

        return {
          conteudo: lista,
          meta: {
            totalElementos: metaData.total ?? metaData.totalElements ?? 0,
            tamanho: metaData.perPage ?? metaData.size ?? tamanho,
            paginaAtual: metaData.page ?? metaData.number ?? pagina,
            totalPaginas: metaData.pages ?? metaData.totalPages ?? 0
          }
        } as RespostaPaginada<DepartamentoDTO>;
      }),
      tap(() => console.log('Departamentos lidos com sucesso')),
      catchError(error => {
        console.error('Erro ao listar departamentos:', error);
        return throwError(() => error);
      })
    );
  }

  delete(uuid: string): Observable<void> {
    const url = `${this.apiUrl}/${uuid}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`Departamento ${uuid} excluído com sucesso`)),
      catchError(error => {
        console.error(error);
        return of(error);
      })
    );
  }

  update(uuid: string, dto: DepartamentoDTO): Observable<DepartamentoDTO> {
    const url = `${this.apiUrl}/${uuid}`;
    return this.http.put<DepartamentoDTO>(url, dto).pipe(
      tap(() => console.log(`Departamento ${uuid} editado com sucesso`)),
      catchError(error => {
        console.error(error);
        return of(error);
      })
    );
  }

}
