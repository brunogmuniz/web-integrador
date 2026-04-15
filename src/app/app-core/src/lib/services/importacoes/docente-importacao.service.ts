import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../../../../environments/enviroment";

@Injectable({ providedIn: 'root' })
export class DocenteImportacaoService {
  private readonly API_URL = `${environment.apiUrl}/importar/docentes`;

  constructor(private readonly http: HttpClient) {}

  importar(file: File, departamentoId: number): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('departamentoId', departamentoId.toString());

    return this.http.post<void>(this.API_URL, formData);
  }
}
