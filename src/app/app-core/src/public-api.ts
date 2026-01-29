/*
 * Public API Surface of shared-core
 */
// APARTIR DA LINHA 10, EXPORT DOS COMPONENTES, APARTIR DA LINHA 21 KEYCLOACK, APARTIR DA LINHA 33 EXPORTS DOS DTOs



//EXPORT DOS COMPONENTES


//import { Loader } from 'shared-core'; LOADER


//import { FormInput } from 'shared-core';  INPUT PADRAO
export * from './lib/components/form-input-padrao/form-input-padrao'

//import { FormInput } from 'shared-core';  INPUT PADRAO
export * from './lib/components/image-profile/image-profile.component'

//EXPORT DO KEYCLOACK
//import { Keycloack } from 'shared-core';

//export auth
export * from './lib/auth/auth.config';
export * from './lib/auth/auth.factory';
export * from './lib/auth/auth.guard';

//EXPORT DOS SERVCES
export * from './lib/services/curso-service'

export * from './lib/services/area-conhecimento-service'

export * from './lib/services/departamento-service'

export * from './lib/services/subarea-conhecimento-service'

export * from './lib/services/disciplina-service'

export * from './lib/services/docente-service'

export * from './lib/services/estrutura-curricular-service'

//EXPORT DOS DTOS
export * from './lib/dto/AreaConhecimento.dto'

//import {CursoDTO} from 'shared-core'
export * from './lib/dto/Curso.dto';

//import {DisciplinaDTO} from 'shared-core'
export * from './lib/dto/Disciplina.dto';

//import {OfertaDTO} from 'shared-core'
export * from './lib/dto/Oferta.dto';
export * from './lib/dto/Docente.dto';
export * from './lib/dto/Departamento.dto';
export * from './lib/dto/EstruturaCurricular.dto';

export * from './lib/dto/DocenteSubArea.dto';
export * from './lib/dto/DocenteSubAreaPercentual.dto';
export * from './lib/dto/DocenteDetalhe.dto';
export * from './lib/dto/SubareaConhecimento.dto';

