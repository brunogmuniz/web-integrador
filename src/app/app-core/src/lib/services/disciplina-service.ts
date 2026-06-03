import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { DisciplinaDTO } from '../dto/Disciplina.dto';
import { environment } from "../../../../../environments/environment";
import { RespostaPaginada } from "app-core/lib/dto/paginacao/resposta-paginada.dto";

@Injectable({
  providedIn: 'root'
})
export class DisciplinaService {
  private apiUrl = `${environment.apiUrl}/disciplinas`;

  constructor(private http: HttpClient) {}

  create(dto: DisciplinaDTO): Observable<DisciplinaDTO> {
    return this.http.post<DisciplinaDTO>(this.apiUrl, dto).pipe(
      tap(() => console.log('Disciplina criada com sucesso')),
      catchError(error => {
        console.error('Falha ao criar disciplina:', error);
        return throwError(() => error);
      })
    );
  }

  findAll(pagina: number = 0, tamanho: number = 15, busca: string = ''): Observable<RespostaPaginada<DisciplinaDTO>> {
    let params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('itensPorPagina', tamanho.toString());
    if (busca?.trim()) {
      params = params.set('busca', busca.trim());
    }

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => {
        let lista = [];

        if (response && Array.isArray(response.conteudo)) {
          lista = response.conteudo;
        } else if (response && Array.isArray(response.data)) {
          lista = response.data;
        } else if (response?.data && Array.isArray(response.data.data)) {
          lista = response.data.data;
        } else if (response && Array.isArray(response.content)) {
          lista = response.content;
        }

        const metaData = response?.meta || response?.data?.meta || response || {};

        return {
          conteudo: lista,
          meta: {
            totalElementos: metaData.totalElementos ?? metaData.total ?? metaData.totalElements ?? 0,
            tamanho: metaData.tamanho ?? metaData.perPage ?? metaData.size ?? tamanho,
            paginaAtual: metaData.paginaAtual ?? metaData.page ?? metaData.number ?? pagina,
            totalPaginas: metaData.totalPaginas ?? metaData.pages ?? metaData.totalPages ?? 0
          }
        } as RespostaPaginada<DisciplinaDTO>;
      }),
      tap(() => console.log('Disciplinas lidas com sucesso')),
      catchError(error => {
        console.error('Erro ao listar disciplinas na página atual:', error);
        return throwError(() => error);
      })
    );
  }

  findById(uuid: string): Observable<DisciplinaDTO> {
    const url = `${this.apiUrl}/${uuid}`;
    return this.http.get<DisciplinaDTO>(url).pipe(
      tap(() => console.log(`Disciplina ${uuid} recuperada com sucesso`)),
      catchError(error => {
        console.error(`Falha ao recuperar os dados da disciplina ${uuid}:`, error);
        return throwError(() => error);
      })
    );
  }

  delete(uuid: string): Observable<void> {
    const url = `${this.apiUrl}/${uuid}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`Disciplina ${uuid} excluída com sucesso`)),
      catchError(error => {
        console.error(`Falha ao tentar excluir a disciplina com UUID ${uuid}:`, error);
        return throwError(() => error);
      })
    );
  }

  update(uuid: string, dto: DisciplinaDTO): Observable<DisciplinaDTO> {
    const url = `${this.apiUrl}/${uuid}`;
    return this.http.put<DisciplinaDTO>(url, dto).pipe(
      tap(() => console.log(`Disciplina ${uuid} editada com sucesso`)),
      catchError(error => {
        console.error(`Falha ao editar a disciplina com UUID ${uuid}:`, error);
        return throwError(() => error);
      })
    );
  }
}
