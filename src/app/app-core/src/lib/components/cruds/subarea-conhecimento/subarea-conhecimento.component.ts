import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {SubareaConhecimentoDTO} from "../../../dto/SubareaConhecimento.dto";
import {Observable} from "rxjs";
import {AreaConhecimentoDTO} from "../../../dto/AreaConhecimento.dto";
import {SubareaConhecimentoService} from "../../../services/subarea-conhecimento-service";
import {AreaConhecimentoService} from "../../../services/area-conhecimento-service";

@Component({
  selector: 'app-subarea-conhecimento',
  templateUrl: './subarea-conhecimento.component.html',
  styleUrls: ['./subarea-conhecimento.component.scss']
})
export class SubareaConhecimentoComponent {

}
