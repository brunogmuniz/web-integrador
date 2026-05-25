import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DocenteDTO } from '../dto/Docente.dto';
import { DocenteDetalheDTO } from '../dto/DocenteDetalhe.dto';
import { DocenteSubAreaDTO } from '../dto/DocenteSubArea.dto';
import { environment } from "../../../../../environments/environment";
import { RespostaPaginada } from "app-core/lib/dto/paginacao/resposta-paginada.dto";

@Injectable({
  providedIn: 'root'
})
export class DocenteService {
  private apiUrl = `${environment.apiUrl}/docentes`;

  constructor(private http: HttpClient) {}

  buscarPorId(uuid: string): Observable<DocenteDetalheDTO> {
    return this.http.get<DocenteDetalheDTO>(`${this.apiUrl}/${uuid}`).pipe(
      tap(() => console.log(`Docente detalhado ${uuid} carregado com sucesso`)),
      catchError(error => {
        console.error('Erro ao buscar docente por ID:', error);
        return throwError(() => error);
      })
    );
  }

  create(dto: DocenteDTO): Observable<DocenteDTO> {
    return this.http.post<DocenteDTO>(this.apiUrl, dto).pipe(
      tap(() => console.log('Docente criado com sucesso')),
      catchError(error => {
        console.error('Erro ao criar docente:', error);
        return throwError(() => error);
      })
    );
  }

  findAll(pagina: number = 0, tamanho: number = 15): Observable<RespostaPaginada<DocenteDTO>> {
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
        } as RespostaPaginada<DocenteDTO>;
      }),
      tap(() => console.log('Docentes lidos com sucesso')),
      catchError(error => {
        console.error('Erro ao listar docentes:', error);
        return throwError(() => error);
      })
    );
  }

  delete(uuid: string): Observable<void> {
    const url = `${this.apiUrl}/${uuid}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`Docente ${uuid} excluído com sucesso`)),
      catchError(error => {
        console.error('Erro ao deletar docente:', error);
        return throwError(() => error);
      })
    );
  }

  listarTodosDetalhado(pagina: number = 0, tamanho: number = 15): Observable<RespostaPaginada<DocenteDetalheDTO>> {
    const url = `${this.apiUrl}/detalhes`;
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('itensPorPagina', tamanho.toString());

    return this.http.get<any>(url, { params }).pipe(
      map(response => {
        let lista = [];
        if (response && Array.isArray(response.data)) {
          lista = response.data;
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
        } as RespostaPaginada<DocenteDetalheDTO>;
      }),
      tap(() => console.log('Detalhes dos Docentes lidos com sucesso')),
      catchError(error => {
        console.error('Erro ao listar detalhes:', error);
        return throwError(() => error);
      })
    );
  }

  listarTodosDetalhadoPorOferta(ofertaUuid: string, pagina: number = 0, tamanho: number = 15): Observable<RespostaPaginada<DocenteDetalheDTO>> {
    const url = `${this.apiUrl}/detalhes/oferta/${ofertaUuid}`;
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('itensPorPagina', tamanho.toString());

    return this.http.get<any>(url, { params }).pipe(
      map(response => {
        let lista = [];
        if (response && Array.isArray(response.data)) {
          lista = response.data;
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
        } as RespostaPaginada<DocenteDetalheDTO>;
      }),
      catchError(error => throwError(() => error))
    );
  }

  update(uuid: string, dto: DocenteDTO): Observable<DocenteDTO> {
    const url = `${this.apiUrl}/${uuid}`;
    return this.http.put<DocenteDTO>(url, dto).pipe(
      tap(() => console.log(`Docente ${uuid} editado com sucesso`)),
      catchError(error => {
        console.error('Erro ao atualizar docente:', error);
        return throwError(() => error);
      })
    );
  }

  atualizarEncargos(uuidDocente: string, encargos: DocenteSubAreaDTO[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${uuidDocente}/encargos`, encargos).pipe(
      tap(() => console.log(`Encargos atualizados com sucesso para o docente ${uuidDocente}`)),
      catchError(error => {
        console.error('Erro ao atualizar encargos:', error);
        return throwError(() => error);
      })
    );
  }
}
