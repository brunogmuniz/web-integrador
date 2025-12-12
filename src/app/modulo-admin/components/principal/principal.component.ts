import { Component } from '@angular/core';
import {Router} from "@angular/router";



interface Modulo {
  title: string;
  sectionView: string;
  pageGo: string;
  pages: string[];
  info?: string;
  svgIcon?: string;
}

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})


export class PrincipalComponent {
  modulos: Modulo[] = [];

  constructor(private router: Router) {
    this.modulos.push({
    title: 'GERENCIAR AREA DE CONHECIMENTO',
    sectionView: 'area/visualizar/',
    pageGo: 'area/visualizar',
    pages: ['GERENCIAR AREA DE CONHECIMENTO'],
    info: 'Operações referentes a gerenciamento da area de conhecimento.',
    svgIcon: ' <i class="la la-book la-3x"></i>'
  });
    this.modulos.push({
      title: 'GERENCIAR SUBAREAS DE CONHECIMENTO',
      sectionView: 'sub-area/visualizar',
      pageGo: 'sub-area/visualizar/',
      pages: ['Sub Area de Conhecimento'],
      info: 'Operações referentes a gerenciamento da sub-area de conhecimento',
      svgIcon: '<i class="la la-bookmark la-3x"></i> '
    });

    this.modulos.push({
      title: 'GERENCIAR DOCENTES',
      sectionView: 'docente/visualizar',
      pageGo: 'docente/visualizar/',
      pages: ['Docentes'],
      info: 'Operações referentes a gerenciamento de Docentes',
      svgIcon: '<i class="la la-user la-3x"></i> '

    });

    this.modulos.push({
      title: 'GERENCIAR ENCARGOS DE DOCENTES',
      sectionView: 'docente-encargos/visualizar',
      pageGo: 'docente-encargos/visualizar/',
      pages: ['Encargos Docentes'],
      info: 'Operações referentes a gerenciamento dos Encargos dos Docentes',
      svgIcon: '<i class="la la-tasks la-3x"></i> '
    });

    this.modulos.push({
      title: 'GERENCIAR ESTRUTURAS CURRICULARES',
      sectionView: 'estrutura-curricular/visualizar',
      pageGo: 'estrutura/visualizar/',
      pages: ['Estrutura Curricular'],
      info: 'Operações referentes a gerenciamento das Estruturas Curriculares',
      svgIcon: '<i class="la la-sitemap la-3x"></i> '
    });

  }
  navegar(rota: string) {
    if (rota) {
      this.router.navigate([rota]);
    }
  }
}
