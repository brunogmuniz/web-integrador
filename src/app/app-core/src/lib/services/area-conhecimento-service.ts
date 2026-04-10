import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {AreaConhecimentoDTO} from '../dto/AreaConhecimento.dto';
import { throwError } from 'rxjs';
import {environment} from "../../../../../environments/enviroment";

@Injectable({
  providedIn: 'root'
})
export class AreaConhecimentoService {
  private apiUrl = `${environment.apiUrl}/areas-conhecimento`;

  constructor(private http: HttpClient) {}

  buscarPorId(uuid: string): Observable<AreaConhecimentoDTO> {
    return this.http.get<AreaConhecimentoDTO>(`${this.apiUrl}/${uuid}`);
  }

  create(dto: AreaConhecimentoDTO): Observable<AreaConhecimentoDTO> {
    return this.http.post<AreaConhecimentoDTO>(this.apiUrl, dto).pipe(
      tap(() => console.log('Area criada')),
      catchError(error => {
        console.error('Erro ao criar área', error);
        return throwError(() => error);
      })
    );
  }

  listarTodos(): Observable<AreaConhecimentoDTO[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => res.content || res),
      tap(() => console.log('Áreas lidas com sucesso')),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }


  update(uuid: string, dto: AreaConhecimentoDTO): Observable<AreaConhecimentoDTO> {
    const url = `${this.apiUrl}/${uuid}`;
    return this.http.put<AreaConhecimentoDTO>(url, dto).pipe(
      tap(() => console.log(`Area ${uuid} editada com sucesso`))
    );
  }

  delete(uuid: string): Observable<void> {
    const url = `${this.apiUrl}/${uuid}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`Area ${uuid} excluída`)),
      catchError(error => {
        return throwError(() => new Error(error.message || 'Erro interno no servidor ao deletar'));
      })
    );
  }
}
