import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Usuario } from '../model/usuario.model';
import { Mensagem } from '../model/mensagem.model';
import { ResponseDto } from '../dto/response.dto';
import { TokenStatus } from '../dto/token-status';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly API = 'https://sua_api_aqui.com/api';
  private readonly URL = this.API + '/usuario/';

  constructor(private http: HttpClient) {}



  login(email: string, senha: string): Observable<ResponseDto<Usuario>> {
    return this.http.post<ResponseDto<Usuario>>(this.API + '/auth/login', {
      email,
      senha
    });
  }

  logout() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  }




  setUsuarioLogado(usuario: Usuario, token: string) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('token', token);
  }

  getUsuarioLogado(): Usuario | null {
    let user = localStorage.getItem('usuario');
    if (!user) return null;
    return JSON.parse(user);
  }

  isLogged(): boolean {
    return !!localStorage.getItem('token');
  }

  getNomeLogado(): string {
    const user = this.getUsuarioLogado();
    return user ? user.nome : '';
  }

  hasPermission(permission: string[]): boolean {
    let usuario = this.getUsuarioLogado();
    if (!usuario || !usuario.permissoes) return false;

    for (let perm of usuario.permissoes) {
      if (permission.includes(perm)) {
        return true;
      }
    }
    return false;
  }



  verificarToken(): boolean {
    return this.isLogged();
  }

  statusToken(token: string): Observable<TokenStatus> {
    return this.http.get<TokenStatus>(this.URL + 'redefinir-senha/' + token);
  }


  editarNome(usuario: Usuario): Observable<Mensagem> {
    return this.http.post<Mensagem>(this.URL + 'editarNome', usuario);
  }

  alterarSenha(usuario: Usuario): Observable<Mensagem> {
    return this.http.post<Mensagem>(this.URL + 'alterarSenha', usuario);
  }
}
