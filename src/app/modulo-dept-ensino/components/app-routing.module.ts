import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AnaliseDasMedias} from "./principal/analise-das-medias/analise-das-medias";
import {PrincipalComponent} from "./principal/principal.component";

const routes: Routes = [
  { path: '', component: PrincipalComponent },
  { path: 'media', component: AnaliseDasMedias },
  { path: 'principal', component: PrincipalComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
