import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CursoDTO} from 'shared-core';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {DepartamentoDTO} from 'shared-core/src/lib/dto/Departamento.dto';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  private apiUrl = 'http://localhost:8080/departamentos';

  constructor(private http: HttpClient) {}

  create(dto: DepartamentoDTO): Observable<DepartamentoDTO> {
    return this.http.post<DepartamentoDTO>(this.apiUrl, dto).pipe(
      tap(() => console.log('Departamento criado com sucesso')),
      catchError(error => {
        console.error('Erro ao criar Departamento', error);
        return of(error);
      })
    );
  }
  getAll(): Observable<DepartamentoDTO[]> {
    return this.http.get<DepartamentoDTO[]>(this.apiUrl).pipe(
      tap(() => console.log('Derpartamentos lidos com sucesso')),
      catchError(error => {
        console.error('Erro ao ler Departamento', error);
        return of(error);
      })
    );
  }

  delete(id: number): Observable<void> { //
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`Departamento ${id} excluído com sucesso`)),
      catchError(error => {
          console.error(`Erro ao excluir Departamento ${id}`, error);
        return of(error);
      })
    );
  }

  update(id: number, dto: DepartamentoDTO): Observable<DepartamentoDTO> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<DepartamentoDTO>(url, dto).pipe(
      tap(() => console.log(`Departamento ${id} editado com sucesso`)),
      catchError(error => {
        console.error(`Erro ao editar Depto ${id}`, error);
        return of(error);
      })
    );
  }

}
