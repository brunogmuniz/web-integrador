export class TokenStatus {

   status: Status | undefined;

   constructor() {
   }

}

export enum Status {
   VALIDO = 'VALIDO',
   EXPIRADO = 'EXPIRADO'
}
