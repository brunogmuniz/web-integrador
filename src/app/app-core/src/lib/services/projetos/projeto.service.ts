import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { ProjetosDTO } from 'app-core/lib/dto/Projetos.dto';
import { RespostaPaginada } from 'app-core/lib/dto/paginacao/resposta-paginada.dto';

export interface LoginDTO {
  email: string;
  senha: string;
}

export interface RegistroDTO {
  nome: string;
  email: string;
  senha: string;
}

export interface LoginResponseDTO {
  token: string;
  nome: string;
  email: string;
}

export interface TopicoDTO {
  id: number;
  nome: string;
}

export interface PreferenciaDTO {
  topicoId: number;
  peso: number;
}

export interface PreferenciaResponseDTO {
  id: number;
  topico: TopicoDTO;
  peso: number;
}

export interface ProjetoRecomendadoDTO {
  id: number;
  numero: string;
  titulo: string;
  situacao: string;
  resumo: string;
  responsavel: string;
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProjetoService {

  private apiUrl = 'http://localhost:8081/projetos';
  private authUrl = 'http://localhost:8081/usuarios';
  private topicosUrl = 'http://localhost:8081/topicos';
  private preferenciasUrl = 'http://localhost:8081/preferencias';
  private recomendacoesUrl = 'http://localhost:8081/recomendacoes';

  constructor(private http: HttpClient) {}

  // ─── AUTH ────────────────────────────────────────────────────────────────────

  login(dto: LoginDTO): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(`${this.authUrl}/login`, dto).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('nome', res.nome);
        localStorage.setItem('email', res.email);
      }),
      catchError(error => {
        console.error('Erro ao fazer login:', error);
        return throwError(() => error);
      })
    );
  }

  registro(dto: RegistroDTO): Observable<any> {
    return this.http.post(`${this.authUrl}/registro`, dto).pipe(
      catchError(error => {
        console.error('Erro ao registrar:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('nome');
    localStorage.removeItem('email');
  }

  isLogado(): boolean {
    return !!localStorage.getItem('token');
  }

  getNomeLogado(): string {
    return localStorage.getItem('nome') || '';
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.getToken()}` });
  }


  findAll(
    pagina: number = 0,
    tamanho: number = 15,
    termoBusca: string = ''
  ): Observable<RespostaPaginada<ProjetosDTO>> {
    let params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('itensPorPagina', tamanho.toString());

    if (termoBusca.trim()) {
      params = params.set('busca', termoBusca);
    }

    return this.http.get<any>(this.apiUrl, { params, headers: this.getHeaders() }).pipe(
      tap(response => console.log('BACKEND RETORNOU:', response)),
      map(response => ({
        conteudo: response.content || [],
        meta: {
          totalElementos: response.meta?.total ?? 0,
          tamanho: response.meta?.perPage ?? tamanho,
          paginaAtual: response.meta?.page ?? 0,
          totalPaginas: response.meta?.pages ?? 0
        }
      } as RespostaPaginada<ProjetosDTO>)),
      catchError(error => {
        console.error('Erro ao listar projetos:', error);
        return throwError(() => error);
      })
    );
  }

  buscarPorId(id: number): Observable<ProjetosDTO> {
    return this.http.get<ProjetosDTO>(`${this.apiUrl}/detalhes/${id}`, { headers: this.getHeaders() }).pipe(
      tap(response => console.log('Projeto carregado:', response)),
      catchError(error => {
        console.error('Erro ao buscar projeto:', error);
        return throwError(() => error);
      })
    );
  }

  create(projeto: ProjetosDTO): Observable<ProjetosDTO> {
    return this.http.post<ProjetosDTO>(this.apiUrl, projeto, { headers: this.getHeaders() }).pipe(
      tap(response => console.log('Projeto criado:', response)),
      catchError(error => throwError(() => error))
    );
  }

  update(id: number, projeto: ProjetosDTO): Observable<ProjetosDTO> {
    return this.http.put<ProjetosDTO>(`${this.apiUrl}/${id}`, projeto, { headers: this.getHeaders() }).pipe(
      tap(response => console.log('Projeto atualizado:', response)),
      catchError(error => throwError(() => error))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      tap(() => console.log('Projeto deletado')),
      catchError(error => throwError(() => error))
    );
  }


  listarTopicos(): Observable<TopicoDTO[]> {
    return this.http.get<TopicoDTO[]>(this.topicosUrl, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Erro ao listar tópicos:', error);
        return throwError(() => error);
      })
    );
  }


  listarPreferencias(): Observable<PreferenciaResponseDTO[]> {
    return this.http.get<PreferenciaResponseDTO[]>(this.preferenciasUrl, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Erro ao listar preferências:', error);
        return throwError(() => error);
      })
    );
  }

  salvarPreferencia(dto: PreferenciaDTO): Observable<PreferenciaResponseDTO> {
    return this.http.post<PreferenciaResponseDTO>(this.preferenciasUrl, dto, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Erro ao salvar preferência:', error);
        return throwError(() => error);
      })
    );
  }

  removerPreferencia(topicoId: number): Observable<void> {
    return this.http.delete<void>(`${this.preferenciasUrl}/${topicoId}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Erro ao remover preferência:', error);
        return throwError(() => error);
      })
    );
  }


  listarRecomendacoes(): Observable<ProjetoRecomendadoDTO[]> {
    return this.http.get<ProjetoRecomendadoDTO[]>(this.recomendacoesUrl, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Erro ao listar recomendações:', error);
        return throwError(() => error);
      })
    );
  }
}
