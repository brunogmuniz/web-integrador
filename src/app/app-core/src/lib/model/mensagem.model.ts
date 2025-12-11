export class Mensagem {

   status: boolean;
   mensagem: string;
   tipo: string;
   base64: string[] | undefined;
   porcentagem: number;


   constructor(status: boolean, mensagem: string, tipo: string, porcentagem: number) {
      this.status = status;
      this.mensagem = mensagem;
      this.tipo = tipo;
      this.porcentagem = porcentagem;

   }
}
