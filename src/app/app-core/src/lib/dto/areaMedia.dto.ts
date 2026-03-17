import {AnoSemestreDTO} from "app-core/lib/dto/anoSemestre.dto";

export interface AreaMediaDTO {
  nome: string;
  codigo: string;
  capacidadeDocenteReferencia: number;
  capacidadeDocenteArea: number;
  cargaHorariaTotalS1: number;
  cargaHorariaTotalS2: number;
  listaAnoSemestre: AnoSemestreDTO[];
  mediaFinal: number;
  subareas?: AreaMediaDTO[];
}
