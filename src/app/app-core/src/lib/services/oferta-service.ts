import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from "../../../../../environments/environment";
import { RespostaPaginada } from '../dto/paginacao/resposta-paginada.dto';
import { DisciplinaOfertaLoteDTO } from '../dto/DisciplinaOferta.dto';
import { OfertaDTO } from '../dto/Oferta.dto';

@Injectable({
  providedIn: 'root'
})
export class OfertaService {
  private readonly apiUrl = `${environment.apiUrl}/ofertas`;

  constructor(private http: HttpClient) {}

  create(dto: OfertaDTO): Observable<OfertaDTO> {
    return this.http.post<OfertaDTO>(this.apiUrl, dto).pipe(catchError(error => throwError(() => error)));
  }

  update(uuid: string, dto: OfertaDTO): Observable<OfertaDTO> {
    return this.http.put<OfertaDTO>(`${this.apiUrl}/${uuid}`, dto).pipe(catchError(error => throwError(() => error)));
  }

  findById(uuid: string): Observable<OfertaDTO> {
    return this.http.get<OfertaDTO>(`${this.apiUrl}/${uuid}`).pipe(catchError(error => throwError(() => error)));
  }

  findAll(pagina: number = 0, tamanho: number = 15): Observable<RespostaPaginada<OfertaDTO>> {
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('itensPorPagina', tamanho.toString());

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => {
        const lista = response?.conteudo || response?.content || response?.data || [];
        const metaData = response?.meta || response?.data?.meta || response || {};

        return {
          conteudo: lista,
          meta: {
            totalElementos: metaData.totalElementos ?? metaData.totalElements ?? metaData.total ?? 0,
            tamanho: metaData.tamanho ?? metaData.size ?? metaData.perPage ?? tamanho,
            paginaAtual: metaData.paginaAtual ?? metaData.number ?? metaData.page ?? pagina,
            totalPaginas: metaData.totalPaginas ?? metaData.totalPages ?? metaData.pages ?? 0
          }
        } as RespostaPaginada<OfertaDTO>;
      }),
      catchError(error => throwError(() => error))
    );
  }

  delete(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${uuid}`).pipe(catchError(error => throwError(() => error)));
  }

  salvarDisciplinas(payload: DisciplinaOfertaLoteDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/disciplinas/lote`, payload).pipe(catchError(error => throwError(() => error)));
  }

  buscarDisciplinas(uuidOferta: string): Observable<DisciplinaOfertaLoteDTO> {
    return this.http.get<DisciplinaOfertaLoteDTO>(`${this.apiUrl}/disciplinas/oferta/${uuidOferta}`).pipe(catchError(error => throwError(() => error)));
  }
}
