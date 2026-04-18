import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class DisciplinaImportacaoService {
  private readonly API_URL = `${environment.apiUrl}/importar/disciplinas`;

  constructor(private readonly http: HttpClient) {}

  importar(file: File, subareaId: number): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subareaId', subareaId.toString());

    return this.http.post<void>(this.API_URL, formData);
  }
}
