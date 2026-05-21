import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { ProjetosDTO } from "app-core/lib/dto/Projetos.dto";
import { RespostaPaginada } from "app-core/lib/dto/paginacao/resposta-paginada.dto";

@Injectable({
  providedIn: 'root'
})
export class ProjetoService {

  private apiUrl = 'http://localhost:8081/projetos';

  constructor(private http: HttpClient) {}

  findAll(
    pagina: number = 0,
    tamanho: number = 15,
    termoBusca: string = ''
  ): Observable<RespostaPaginada<ProjetosDTO>> {
    let params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('itensPorPagina', tamanho.toString());

    if (termoBusca.trim()) {
      params = params.set('busca', termoBusca);
    }

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      tap(response => {
        console.log('BACKEND RETORNOU:', response);
      }),
      map(response => {
        return {
          conteudo: response.content || [],
          meta: {
            totalElementos: response.meta?.total ?? 0,
            tamanho: response.meta?.perPage ?? tamanho,
            paginaAtual: response.meta?.page ?? 0,
            totalPaginas: response.meta?.pages ?? 0
          }
        } as RespostaPaginada<ProjetosDTO>;
      }),
      catchError(error => {
        console.error('Erro ao listar projetos:', error);
        return throwError(() => error);
      })
    );
  }

  buscarPorId(id: number): Observable<ProjetosDTO> {
    return this.http.get<ProjetosDTO>(`${this.apiUrl}/detalhes/${id}`).pipe(
      tap(response => {
        console.log('Projeto carregado:', response);
      }),
      catchError(error => {
        console.error('Erro ao buscar projeto:', error);
        return throwError(() => error);
      })
    );
  }

  // NOVO: Método para criar um projeto
  create(projeto: ProjetosDTO): Observable<ProjetosDTO> {
    return this.http.post<ProjetosDTO>(this.apiUrl, projeto).pipe(
      tap(response => {
        console.log('Projeto criado com sucesso:', response);
      }),
      catchError(error => {
        console.error('Erro ao criar projeto:', error);
        return throwError(() => error);
      })
    );
  }

  // NOVO: Método para atualizar um projeto
  update(id: number, projeto: ProjetosDTO): Observable<ProjetosDTO> {
    return this.http.put<ProjetosDTO>(`${this.apiUrl}/${id}`, projeto).pipe(
      tap(response => {
        console.log('Projeto atualizado com sucesso:', response);
      }),
      catchError(error => {
        console.error('Erro ao atualizar projeto:', error);
        return throwError(() => error);
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        console.log('Projeto deletado com sucesso');
      }),
      catchError(error => {
        console.error('Erro ao deletar projeto:', error);
        return throwError(() => error);
      })
    );
  }
}
