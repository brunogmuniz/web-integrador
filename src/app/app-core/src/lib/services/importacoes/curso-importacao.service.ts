import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CursoImportacaoService {
  private readonly API_URL = `${environment.apiUrl}/importar/cursos`;

  constructor(private readonly http: HttpClient) {}

  importar(file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<void>(this.API_URL, formData);
  }
}
