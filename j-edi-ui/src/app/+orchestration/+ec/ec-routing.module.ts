import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EcComponent } from "./ec.component";

const routes: Routes = [{
  path: '',
  component: EcComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class EcRoutingModule { }