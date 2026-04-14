import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/enviroment';
import {ResponseDto} from "app-core/lib/dto/response.dto";

export interface UnidadeUsuarioRequestDTO {
  unidadeUuid: string;
  usuarioId: number;
  papel: string;
  ativo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UnidadeUsuarioService {
  private readonly apiUrl = `${environment.apiUrl}/unidades-usuarios`;

  constructor(private readonly http: HttpClient) {
  }

  public vincular(dto: UnidadeUsuarioRequestDTO): Observable<any> {
    return this.http.post<any>(this.apiUrl, dto).pipe(
      catchError(this.handleError)
    );
  }

  public listar(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error(`Erro na requisição para ${error.url}:`, error.message, error.error);
    return throwError(() => new Error('Falha ao comunicar com o servidor. Detalhes no console.'));
  }

  getTodos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getUsuarios`, {});
  }

  getVinculo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/{uuid}`, {});
  }

  public excluir(uuid: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${uuid}`);
  }

  public atualizar(uuid: string, payload: any): Observable<any> {
    console.log(payload);
    return this.http.put<any>(`${this.apiUrl}/${uuid}`, payload);
  }

  buscarPorUuid(uuid: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${uuid}`);
  }
}
