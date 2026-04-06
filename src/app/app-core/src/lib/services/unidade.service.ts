import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/enviroment';
import { UnidadeDTO, UnidadeFormDTO } from '../dto/Unidade.dto';

@Injectable({
  providedIn: 'root'
})
export class UnidadeService {
  private readonly baseUrl = `${environment.apiUrl}/unidades`;

  constructor(private readonly http: HttpClient) {}

  public listar(apenasAtivas: boolean = false): Observable<UnidadeDTO[]> {
    const params = new HttpParams().set('apenasAtivas', String(apenasAtivas));

    return this.http.get<UnidadeDTO[]>(this.baseUrl, { params }).pipe(
      catchError(this.tratarErro)
    );
  }

  public buscar(uuid: string): Observable<UnidadeDTO> {
    return this.http.get<UnidadeDTO>(`${this.baseUrl}/${uuid}`).pipe(
      catchError(this.tratarErro)
    );
  }

  public salvar(form: UnidadeFormDTO): Observable<UnidadeDTO> {
    return this.http.post<UnidadeDTO>(this.baseUrl, form).pipe(
      catchError(this.tratarErro)
    );
  }

  public atualizar(uuid: string, form: UnidadeFormDTO): Observable<UnidadeDTO> {
    return this.http.put<UnidadeDTO>(`${this.baseUrl}/${uuid}`, form).pipe(
      catchError(this.tratarErro)
    );
  }

  public excluir(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${uuid}`).pipe(
      catchError(this.tratarErro)
    );
  }

  private tratarErro(error: HttpErrorResponse): Observable<never> {
    const mensagemErro = error.error?.message || error.message || 'Erro desconhecido ao comunicar com a API de Unidades';
    console.error(`[UnidadeService] Falha na operação. Status: ${error.status}. Detalhes: ${mensagemErro}`, error);
    return throwError(() => new Error(mensagemErro));
  }
}
