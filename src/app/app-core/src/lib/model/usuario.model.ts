export class Usuario {

   id: number | undefined;
   nome: string;
   email: string | undefined;
   cpf?: string;
   matricula: string | undefined;
   senha: string | undefined;
   confirmarSenha: string | undefined;
   dataCadastro: any;
   ultimoAcesso: any;
   ultimoAcessoHora: any;
   login: any;
   foto: any;
   permissoes: string[];
   token: string | undefined;
   ativo: boolean | undefined;

   constructor(id?: number, nome?: string, email?: string, cpf?: string, matricula?: string, senha?: string, confirmarSenha?: string,
               dataCadastro?: any, ultimoAcesso?: any, ultimoAcessoHora?: any, login?: any, foto?: any,
               token?: string, ativo?: boolean) {
      this.id = id;
     this.nome = nome ?? '';
      this.email = email;
      this.cpf = cpf;
      this.matricula = matricula;
      this.senha = senha;
      this.confirmarSenha = confirmarSenha;
      this.dataCadastro = dataCadastro;
      this.ultimoAcesso = ultimoAcesso;
      this.ultimoAcessoHora = ultimoAcessoHora;
      this.login = login;
      this.foto = foto;
      this.permissoes = [];
      this.token = token;
      this.ativo = ativo;

   }

}
