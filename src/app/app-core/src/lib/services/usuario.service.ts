import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioDto } from '../dto/Usuario.dto';

export const API_URL = new InjectionToken<string>('API_URL');

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private readonly baseUrl: string = 'http://localhost:8080/usuarios';

  constructor(
    private http: HttpClient,
    @Optional() @Inject(API_URL) apiUrl?: string
  ) {
    if (apiUrl) {
      this.baseUrl = `${apiUrl}/usuarios`;
    }
  }

  completarCadastro(id: number, dados: Partial<UsuarioDto>): Observable<UsuarioDto> {
    return this.http.put<UsuarioDto>(`${this.baseUrl}/${id}/completar-cadastro`, dados);
  }
}
