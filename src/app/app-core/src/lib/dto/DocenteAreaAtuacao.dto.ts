import {AreaConhecimentoDTO, DocenteDTO} from "app-core";

export interface DocenteAreaAtuacaoDTO {
  uuid?: string | null;
  docente: DocenteDTO;
  area: AreaConhecimentoDTO;
  percentualAtuacao: number;
}
