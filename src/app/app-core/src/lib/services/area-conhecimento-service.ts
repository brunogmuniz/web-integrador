import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AreaConhecimentoDTO } from '../dto/AreaConhecimento.dto';
import { environment } from "../../../../../environments/enviroment";
import { RespostaPaginada } from '../dto/paginacao/resposta-paginada.dto';

@Injectable({
  providedIn: 'root'
})
export class AreaConhecimentoService {
  private apiUrl = `${environment.apiUrl}/areas-conhecimento`;

  constructor(private http: HttpClient) {}

  buscarPorId(uuid: string): Observable<AreaConhecimentoDTO> {
    return this.http.get<AreaConhecimentoDTO>(`${this.apiUrl}/${uuid}`).pipe(
      catchError(error => {
        console.error(`Falha ao recuperar a área de conhecimento ${uuid}:`, error);
        return throwError(() => error);
      })
    );
  }

  create(dto: AreaConhecimentoDTO): Observable<AreaConhecimentoDTO> {
    return this.http.post<AreaConhecimentoDTO>(this.apiUrl, dto).pipe(
      tap(() => console.log('Area de conhecimento criada com sucesso')),
      catchError(error => {
        console.error('Falha ao criar área de conhecimento:', error);
        return throwError(() => error);
      })
    );
  }

  findAll(pagina: number = 0, tamanho: number = 15): Observable<RespostaPaginada<AreaConhecimentoDTO>> {
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
        } as RespostaPaginada<AreaConhecimentoDTO>;
      }),
      tap(() => console.log('Áreas de conhecimento lidas com sucesso')),
      catchError(error => {
        console.error('Erro ao listar áreas de conhecimento na página atual:', error);
        return throwError(() => error);
      })
    );
  }

  update(uuid: string, dto: AreaConhecimentoDTO): Observable<AreaConhecimentoDTO> {
    const url = `${this.apiUrl}/${uuid}`;
    return this.http.put<AreaConhecimentoDTO>(url, dto).pipe(
      tap(() => console.log(`Area ${uuid} editada com sucesso`)),
      catchError(error => {
        console.error(`Falha ao editar a área com UUID ${uuid}:`, error);
        return throwError(() => error);
      })
    );
  }

  delete(uuid: string): Observable<void> {
    const url = `${this.apiUrl}/${uuid}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`Area ${uuid} excluída`)),
      catchError(error => {
        console.error(`Falha ao tentar excluir a área com UUID ${uuid}:`, error);
        return throwError(() => new Error(error.message || 'Erro interno no servidor ao deletar'));
      })
    );
  }
}
