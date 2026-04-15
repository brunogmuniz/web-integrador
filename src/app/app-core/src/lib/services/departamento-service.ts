import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import {DepartamentoDTO} from '../dto/Departamento.dto';
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  private apiUrl = `${environment.apiUrl}/departamentos`;
  constructor(private http: HttpClient) {}

  create(dto: DepartamentoDTO): Observable<DepartamentoDTO> {
    return this.http.post<DepartamentoDTO>(this.apiUrl, dto).pipe(
      tap(() => console.log('Departamento criado com sucesso')),
      catchError(error => {
        console.error(error);
        return of(error);
      })
    );
  }
  getAll(): Observable<DepartamentoDTO[]> {
    return this.http.get<any>(`${this.apiUrl}?size=2000`).pipe(
      map(response => response.content),
      tap(() => console.log('Departamentos lidos com sucesso')),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

  delete(uuid: string): Observable<void> {
    const url = `${this.apiUrl}/${uuid}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`Departamento ${uuid} excluído com sucesso`)),
      catchError(error => {
        console.error(error);
        return of(error);
      })
    );
  }

  update(uuid: string, dto: DepartamentoDTO): Observable<DepartamentoDTO> {
    const url = `${this.apiUrl}/${uuid}`;
    return this.http.put<DepartamentoDTO>(url, dto).pipe(
      tap(() => console.log(`Departamento ${uuid} editado com sucesso`)),
      catchError(error => {
        console.error(error);
        return of(error);
      })
    );
  }

}
