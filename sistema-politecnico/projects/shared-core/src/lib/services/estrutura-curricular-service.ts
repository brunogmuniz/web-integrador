import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstruturaCurricularDto } from '../dto/EstruturaCurricular.dto';

@Injectable({
  providedIn: 'root'
})
export class EstruturaCurricularService {

  private readonly apiUrl = 'http://localhost:8080/estruturas-curriculares';

  constructor(private http: HttpClient) {}

  save(estrutura: EstruturaCurricularDto): Observable<EstruturaCurricularDto> {
    return this.http.post<EstruturaCurricularDto>(this.apiUrl, estrutura);
  }

  update(id: number, estrutura: EstruturaCurricularDto): Observable<EstruturaCurricularDto> {
    return this.http.put<EstruturaCurricularDto>(`${this.apiUrl}/${id}`, estrutura);
  }

  findById(id: number): Observable<EstruturaCurricularDto> {
    return this.http.get<EstruturaCurricularDto>(`${this.apiUrl}/${id}`);
  }
}
