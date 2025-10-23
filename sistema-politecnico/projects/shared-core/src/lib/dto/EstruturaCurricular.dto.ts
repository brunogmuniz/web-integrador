import {CursoDTO} from './Curso.dto';
import {DisciplinaDTO} from './Disciplina.dto';

export interface EstruturaCurricularDTO{
  id: number;
  curso_id: CursoDTO;
  disciplina: DisciplinaDTO;
  semestreDoCurso: number;
}
