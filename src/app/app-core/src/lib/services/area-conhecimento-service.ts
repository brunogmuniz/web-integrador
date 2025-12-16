import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {AreaConhecimentoDTO} from '../dto/AreaConhecimento.dto';
import {CursoDTO} from '../dto/Curso.dto';

@Injectable({
  providedIn: 'root'
})
export class AreaConhecimentoService {
  private apiUrl = 'http://localhost:8080/areas-conhecimento';

  constructor(private http: HttpClient) {}
  buscarPorId(id: number) {
    return this.http.get<AreaConhecimentoDTO>(`${this.apiUrl}/${id}`);
  }
  create(dto: AreaConhecimentoDTO): Observable<AreaConhecimentoDTO> {
    return this.http.post<AreaConhecimentoDTO>(this.apiUrl, dto).pipe(
      tap(() => console.log('Area criada com sucesso')),
      catchError(error => {
        console.error('Erro ao criar Area', error);
        return of(error);
      })
    );
  }

  listarTodos(): Observable<AreaConhecimentoDTO[]> {
    return this.http.get<AreaConhecimentoDTO[]>(this.apiUrl).pipe(
      tap(() => console.log('Areas lidas com sucesso')),
      catchError(error => {
        console.error('Erro ao ler Areas', error);
        return of(error);
      })
    );
  }

  update(id: number, dto: AreaConhecimentoDTO): Observable<AreaConhecimentoDTO> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<CursoDTO>(url, dto).pipe(
      tap(() => console.log(`Area ${id} editado com sucesso`)),
      catchError(error => {
        console.error(`Erro ao editar Area ${id}`, error);
        return of(error);
      })
    );
  }

  delete(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`Area ${id} excluída com sucesso`)),
      catchError(error => {
        console.error(`Erro ao excluir Area ${id}`, error);
        return of(error);
      })
    );
  }

}
