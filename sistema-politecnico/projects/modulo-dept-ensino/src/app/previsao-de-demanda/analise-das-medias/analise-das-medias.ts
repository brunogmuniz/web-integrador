import { Component } from '@angular/core';
import {AreaTabelaComponent} from './utils/area-tabela/area-tabela';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-analise-das-medias',
  templateUrl: './analise-das-medias.html',
  styleUrls: ['./analise-das-medias.css'],
  standalone: true,
  imports: [
    AreaTabelaComponent
  ]
})
export class AnaliseDasMedias {

}
