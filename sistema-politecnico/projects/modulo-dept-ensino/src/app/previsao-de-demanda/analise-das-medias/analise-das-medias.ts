import { Component } from '@angular/core';
import {AreaTabelaComponent} from './utils/area-tabela/area-tabela';
import {CommonModule} from '@angular/common';
import {Footer} from './utils/footer/footer';
import {Header} from './utils/header/header';

@Component({
  selector: 'app-analise-das-medias',
  templateUrl: './analise-das-medias.html',
  styleUrls: ['./analise-das-medias.css'],
  standalone: true,
  imports: [
    AreaTabelaComponent,
    Footer,
    Header
  ]
})
export class AnaliseDasMedias {

}
