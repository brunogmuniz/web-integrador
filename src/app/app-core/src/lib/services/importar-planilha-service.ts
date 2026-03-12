import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImportarPlanilhaService {

  constructor() { }

  salvarPorCSV(arquivo: File): any {
    return {
      subscribe: ({next, error}: {next: (data: boolean) => void, error?: () => void}) => {
        setTimeout(() => {
          next(true);
        }, 1000);
      }
    };
  }
}
