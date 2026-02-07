import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {DocenteDTO} from '../dto/Docente.dto'
import { DocenteDetalheDTO } from '../dto/DocenteDetalhe.dto';
import {environment} from "../../../../../environments/enviroment";

@Injectable({
  providedIn: 'root'
})
export class DocenteService {
  private apiUrl = `${environment.apiUrl}/docentes`;

  constructor(private http: HttpClient) {}

  buscarPorId(uuid: string): Observable<DocenteDTO> {
    return this.http.get<DocenteDTO>(`${this.apiUrl}/${uuid}`);
  }

  create(dto: DocenteDTO): Observable<DocenteDTO> {
    return this.http.post<DocenteDTO>(this.apiUrl, dto).pipe(
      tap(() => console.log('Docente criada com sucesso')),
      catchError(error => {
        console.error(error);
        throw error;
      })
    );
  }

  listarTodos(): Observable<DocenteDTO[]> {
    return this.http.get<any>(`${this.apiUrl}?size=2000`).pipe(
      map(response => response.content),
      tap(() => console.log('Docentes lidos com sucesso')),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

  delete(uuid: string): Observable<void> {
    const url = `${this.apiUrl}/${uuid}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`Docente ${uuid} excluída com sucesso`)),
      catchError(error => {
        console.error(error);
        throw error;
      })
    );
  }

  listarTodosDetalhado(): Observable<DocenteDetalheDTO[]> {
    const url = `${this.apiUrl}/detalhes/all`;
    return this.http.get<DocenteDetalheDTO[]>(url).pipe(
      tap(() => console.log('Detalhes dos Docentes lidos com sucesso (rota otimizada)')),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }
  update(uuid: string, dto: DocenteDTO): Observable<DocenteDTO> {
    const url = `${this.apiUrl}/${uuid}`;
    return this.http.put<DocenteDTO>(url, dto).pipe(
      tap(() => console.log(`Docente ${uuid} editado com sucesso`)),
      catchError(error => {
        console.error(error);
        return of(error);
      })
    );
  }

  atualizarEncargos(uuidDocente: string, encargos: any[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${uuidDocente}/encargos`, encargos);
  }
}
