import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {SubareaConhecimentoDTO} from "../../../app-core/src/lib/dto/SubareaConhecimento.dto";
import {Observable} from "rxjs";
import {AreaConhecimentoDTO} from "../../../app-core/src/lib/dto/AreaConhecimento.dto";
import {SubareaConhecimentoService} from "../../../app-core/src/lib/services/subarea-conhecimento-service";
import {AreaConhecimentoService} from "../../../app-core/src/lib/services/area-conhecimento-service";

@Component({
  selector: 'app-subarea-conhecimento',
  templateUrl: './subarea-conhecimento.component.html',
  styleUrls: ['./subarea-conhecimento.component.scss']
})
export class SubareaConhecimentoComponent {

}
