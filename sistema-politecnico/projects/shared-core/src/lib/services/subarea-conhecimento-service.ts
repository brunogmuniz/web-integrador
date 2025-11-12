import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CursoDTO} from 'shared-core';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {SubareaConhecimentoDTO} from 'shared-core/src/lib/dto/SubareaConhecimento.dto';

@Injectable({
  providedIn: 'root'
})
export class SubareaConhecimentoService {
  private apiUrl = 'http://localhost:8080/subareas';

  constructor(private http: HttpClient) {}

  create(dto: SubareaConhecimentoDTO): Observable<SubareaConhecimentoDTO> {
    return this.http.post<SubareaConhecimentoDTO>(this.apiUrl, dto).pipe(
      tap(() => console.log('SubArea criado com sucesso')),
      catchError(error => {
        console.error('Erro ao criar SubArea', error);
        return of(error);
      })
    );
  }

  listarTodos(): Observable<SubareaConhecimentoDTO[]> {
    return this.http.get<SubareaConhecimentoDTO[]>(this.apiUrl).pipe(
      tap(() => console.log('SubareaConhecimento lidos com sucesso')),
      catchError(error => {
        console.error('Erro ao ler SubareaConhecimento', error);
        return of(error);
      })
    );
  }

  update(id: number, dto: SubareaConhecimentoDTO): Observable<SubareaConhecimentoDTO> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<SubareaConhecimentoDTO>(url, dto).pipe(
      tap(() => console.log(`SubareaConhecimento ${id} editado com sucesso`)),
      catchError(error => {
        console.error(`Erro ao editar SubareaConhecimento ${id}`, error);
        return of(error);
      })
    );
  }

  delete(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`SubareaConhecimento ${id} excluído com sucesso`)),
      catchError(error => {
        console.error(`Erro ao excluir SubareaConhecimento ${id}`, error);
        return of(error);
      })
    );
  }

}
