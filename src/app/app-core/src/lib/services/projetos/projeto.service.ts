import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

export interface ProjetosDTO {
  numero: number;
  titulo: string;
  unidade: string;
  responsavel: string;
  inicio: string;
  termino: string;
}

export interface RespostaPaginada<T> {
  conteudo: T[];
  meta: {
    totalElementos: number;
    tamanho: number;
    paginaAtual: number;
    totalPaginas: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProjetoService {

  private apiUrl = 'http://localhost:8080/projetos'; // ajusta

  constructor(private http: HttpClient) {}

  findAll(pagina: number = 0, tamanho: number = 15): Observable<RespostaPaginada<ProjetosDTO>> {
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
        } as RespostaPaginada<ProjetosDTO>;
      }),
      tap(() => console.log('Projetos lidos com sucesso')),
      catchError(error => {
        console.error('Erro ao listar projetos:', error);
        return throwError(() => error);
      })
    );
  }
}
