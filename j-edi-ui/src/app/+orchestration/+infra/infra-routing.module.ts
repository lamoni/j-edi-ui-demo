import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfraComponent } from "./infra.component";

const routes: Routes = [{
  path: '',
  component: InfraComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class InfraRoutingModule { }