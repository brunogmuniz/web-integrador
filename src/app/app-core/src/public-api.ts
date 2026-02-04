//Form Input Padrão
export * from './lib/components/form-input-padrao/form-input-padrao';

//Atualizar Cadastro
export * from './lib/components/atualizar-cadastro/atualizar-cadastro.component';
export * from './lib/components/atualizar-cadastro/atualizar-cadastro.module';
//import { FormInput } from 'shared-core';  INPUT PADRAO
export * from './lib/components/image-profile/image-profile.component'

//App Core
export * from './lib/app-core.module';

//Services
export * from './lib/services/curso-service';
export * from './lib/services/area-conhecimento-service';
export * from './lib/services/departamento-service';
export * from './lib/services/subarea-conhecimento-service';
export * from './lib/services/disciplina-service';
export * from './lib/services/docente-service';
export * from './lib/services/estrutura-curricular-service';

//DTOs e Models
export * from './lib/dto/AreaConhecimento.dto';
export * from './lib/dto/Curso.dto';
export * from './lib/dto/Disciplina.dto';
export * from './lib/dto/Oferta.dto';
export * from './lib/dto/Docente.dto';
export * from './lib/dto/Departamento.dto';
export * from './lib/dto/EstruturaCurricular.dto';
export * from './lib/dto/DocenteSubArea.dto';
export * from './lib/dto/DocenteSubAreaPercentual.dto';
export * from './lib/dto/DocenteDetalhe.dto';
export * from './lib/dto/SubareaConhecimento.dto';

//Usuário
export * from './lib/dto/Usuario.dto';
export * from './lib/model/usuario.model';
export * from './lib/utils/usuario-util';
export * from './lib/services/usuario.service';
export * from './lib/services/login.service';

//Auth e Guards
export * from './lib/auth/auth.config';
export * from './lib/auth/auth.factory';
export * from './lib/auth/auth.guard';
export * from './lib/guards/cadastro-completo.guard';
