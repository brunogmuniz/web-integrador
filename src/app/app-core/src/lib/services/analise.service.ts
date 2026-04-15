import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnaliseParamsDTO } from '../dto/analiseParams.dto';
import { AreaMediaDTO } from '../dto/areaMedia.dto';
import { environment } from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AnaliseService {
  private readonly baseUrl = `${environment.apiUrl}/analise`;

  constructor(private readonly http: HttpClient) {}

  analisarSubarea(subareaUuid: string, params: AnaliseParamsDTO): Observable<AreaMediaDTO> {
    return this.http.post<AreaMediaDTO>(`${this.baseUrl}/subarea/${subareaUuid}`, params);
  }

  analisarTodas(params: AnaliseParamsDTO): Observable<AreaMediaDTO[]> {
    return this.http.post<AreaMediaDTO[]>(`${environment.apiUrl}/api/analise-depto/todas`, params);
  }

  analisarArea(uuid: string, params: AnaliseParamsDTO): Observable<AreaMediaDTO> {
    return this.http.post<AreaMediaDTO>(`${environment.apiUrl}/api/analise-depto/area/${uuid}`, params);
  }
}
