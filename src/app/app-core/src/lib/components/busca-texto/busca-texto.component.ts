import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-busca-texto',
  templateUrl: './busca-texto.component.html',
  styleUrls: ['./busca-texto.component.scss']
})
export class BuscaTextoComponent implements OnDestroy {
  @Input() placeholder = 'Buscar...';
  @Output() buscaChange = new EventEmitter<string>();

  public termo = '';
  private termo$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor() {
    this.termo$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(termo => this.buscaChange.emit(termo.trim()));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public aoDigitar(termo: string): void {
    this.termo = termo;
    this.termo$.next(termo);
  }

  public limpar(): void {
    this.termo = '';
    this.buscaChange.emit('');
  }
}
