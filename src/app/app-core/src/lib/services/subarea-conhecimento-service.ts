import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SubareaConhecimentoDTO } from '../dto/SubareaConhecimento.dto';
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SubareaConhecimentoService {
  private apiUrl = `${environment.apiUrl}/subareas-conhecimento`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<SubareaConhecimentoDTO[]> {
    return this.http.get<SubareaConhecimentoDTO[]>(`${this.apiUrl}/all`).pipe(
      tap(() => console.log('Subáreas carregadas via endpoint /all')),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

  buscarPorUuid(uuid: string): Observable<SubareaConhecimentoDTO> {
    return this.http.get<SubareaConhecimentoDTO>(`${this.apiUrl}/${uuid}`);
  }

  create(dto: SubareaConhecimentoDTO): Observable<SubareaConhecimentoDTO> {
    return this.http.post<SubareaConhecimentoDTO>(this.apiUrl, dto).pipe(
      tap(() => console.log('SubArea criada com sucesso')),
      catchError(error => {
        console.error(error);
        throw error;
      })
    );
  }


  update(uuid: string, dto: SubareaConhecimentoDTO): Observable<SubareaConhecimentoDTO> {
    const url = `${this.apiUrl}/${uuid}`;
    return this.http.put<SubareaConhecimentoDTO>(url, dto).pipe(
      tap(() => console.log(`SubareaConhecimento ${uuid} editada com sucesso`)),
      catchError(error => {
        console.error(error);
        throw error;
      })
    );
  }

  delete(uuid: string): Observable<void> {
    const url = `${this.apiUrl}/${uuid}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`SubareaConhecimento ${uuid} excluída com sucesso`)),
      catchError(error => {
        console.error(error);
        throw error;
      })
    );
  }
}
