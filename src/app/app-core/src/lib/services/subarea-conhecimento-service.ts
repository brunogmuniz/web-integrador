import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { SubareaConhecimentoDTO } from '../dto/SubareaConhecimento.dto';
import {environment} from "../../../../../environments/environment";
import { RespostaPaginada } from '../dto/paginacao/resposta-paginada.dto';

@Injectable({
  providedIn: 'root'
})
export class SubareaConhecimentoService {
  private apiUrl = `${environment.apiUrl}/subareas-conhecimento`;

  constructor(private http: HttpClient) {}

  findAll(pagina: number = 0, tamanho: number = 15, busca: string = ''): Observable<RespostaPaginada<SubareaConhecimentoDTO>> {
    let params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('itensPorPagina', tamanho.toString());
    if (busca?.trim()) {
      params = params.set('busca', busca.trim());
    }

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => {
        let lista: SubareaConhecimentoDTO[] = [];

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
        } as RespostaPaginada<SubareaConhecimentoDTO>;
      }),
      tap(() => console.log('Subáreas de conhecimento lidas com sucesso')),
      catchError(error => {
        console.error('Erro ao listar subáreas de conhecimento:', error);
        return throwError(() => error);
      })
    );
  }

  buscarPorUuid(uuid: string): Observable<SubareaConhecimentoDTO> {
    return this.http.get<SubareaConhecimentoDTO>(`${this.apiUrl}/${uuid}`).pipe(
      catchError(error => {
        console.error(`Falha ao recuperar a subárea ${uuid}:`, error);
        return throwError(() => error);
      })
    );
  }

  create(dto: SubareaConhecimentoDTO): Observable<SubareaConhecimentoDTO> {
    return this.http.post<SubareaConhecimentoDTO>(this.apiUrl, dto).pipe(
      tap(() => console.log('SubArea criada com sucesso')),
      catchError(error => {
        console.error('Falha ao criar subárea:', error);
        return throwError(() => error);
      })
    );
  }

  update(uuid: string, dto: SubareaConhecimentoDTO): Observable<SubareaConhecimentoDTO> {
    const url = `${this.apiUrl}/${uuid}`;
    return this.http.put<SubareaConhecimentoDTO>(url, dto).pipe(
      tap(() => console.log(`SubareaConhecimento ${uuid} editada com sucesso`)),
      catchError(error => {
        console.error('Erro ao atualizar subárea:', error);
        return throwError(() => error);
      })
    );
  }

  delete(uuid: string): Observable<void> {
    const url = `${this.apiUrl}/${uuid}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`SubareaConhecimento ${uuid} excluída com sucesso`)),
      catchError(error => {
        console.error(`Falha ao tentar excluir a subárea ${uuid}:`, error);
        return throwError(() => new Error(error.message || 'Erro interno no servidor ao deletar'));
      })
    );
  }
}
