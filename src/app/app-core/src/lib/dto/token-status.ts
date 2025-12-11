export class TokenStatus {

   email: string;
   status: Status;

   constructor() {
   }

}

export enum Status {
   VALIDO = 'VALIDO',
   EXPIRADO = 'EXPIRADO'
}
