export interface ResponseDto<T = any> {
  status: ResponseDto.Status;
  msg?: string;
  data?: T;
  porcentagem?: number;
}

export namespace ResponseDto {
  export enum Status {
    SUCCESS = 'SUCCESS',
    INFO = 'INFO',
    WARNING = 'WARNING',
    ERROR = 'ERROR'
  }
}
