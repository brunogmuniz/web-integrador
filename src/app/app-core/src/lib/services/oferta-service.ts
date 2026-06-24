import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from "../../../../../environments/environment";
import { RespostaPaginada } from '../dto/paginacao/resposta-paginada.dto';
import { DisciplinaOfertaLoteDTO, OfertaDisciplinasResumoDTO } from '../dto/DisciplinaOferta.dto';
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

  findAll(pagina: number = 0, tamanho: number = 15, busca: string = '', sortBy?: string, sortDirection?: string): Observable<RespostaPaginada<OfertaDTO>> {
    let params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('itensPorPagina', tamanho.toString());
    if (busca?.trim()) {
      params = params.set('busca', busca.trim());
    }
    if (sortBy) {
      params = params.set('sortBy', sortBy).set('sortDirection', sortDirection || 'asc');
    }

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

  buscarMaisRecentes(): Observable<OfertaDTO[]> {
    return this.http.get<OfertaDTO[]>(`${this.apiUrl}/mais-recentes`).pipe(catchError(error => throwError(() => error)));
  }

  buscarParaSelecao(busca: string = ''): Observable<OfertaDTO[]> {
    let params = new HttpParams();
    if (busca?.trim()) {
      params = params.set('busca', busca.trim());
    }
    return this.http.get<OfertaDTO[]>(`${this.apiUrl}/selecao`, { params }).pipe(catchError(error => throwError(() => error)));
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

  importarDisciplinasPorCombinacao(
    uuidOfertaDestino: string,
    uuidCurso: string,
    uuidEstruturaCurricular: string,
    uuidOfertaOrigem: string
  ): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${uuidOfertaDestino}/cursos/${uuidCurso}/curriculos/${uuidEstruturaCurricular}/disciplinas/importar/${uuidOfertaOrigem}`,
      {}
    ).pipe(catchError(error => throwError(() => error)));
  }

  importarDisciplinasOfertaCompleta(uuidOfertaDestino: string, uuidOfertaOrigem: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${uuidOfertaDestino}/disciplinas/importar/${uuidOfertaOrigem}`,
      {}
    ).pipe(catchError(error => throwError(() => error)));
  }

  buscarDisciplinasPorCombinacao(
    uuidOferta: string,
    uuidCurso: string,
    uuidEstruturaCurricular: string
  ): Observable<DisciplinaOfertaLoteDTO> {
    return this.http.get<DisciplinaOfertaLoteDTO>(
      `${this.apiUrl}/${uuidOferta}/cursos/${uuidCurso}/curriculos/${uuidEstruturaCurricular}/disciplinas`
    ).pipe(catchError(error => throwError(() => error)));
  }

  listarDisciplinasOferta(uuidOferta: string, busca: string = ''): Observable<OfertaDisciplinasResumoDTO> {
    let params = new HttpParams();
    if (busca?.trim()) {
      params = params.set('busca', busca.trim());
    }
    return this.http.get<OfertaDisciplinasResumoDTO>(`${this.apiUrl}/${uuidOferta}/disciplinas`, { params }).pipe(catchError(error => throwError(() => error)));
  }
}
