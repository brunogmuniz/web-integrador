import { AnoSemestreDTO } from './anoSemestre.dto';
import { DocenteAreaSimuladoDTO } from './docenteAreaSimulado.dto';

export interface AnaliseParamsDTO {
  anosSemestres: AnoSemestreDTO[];
  ofertaUuids: string[];
  docentesArea?: DocenteAreaSimuladoDTO[];
}
