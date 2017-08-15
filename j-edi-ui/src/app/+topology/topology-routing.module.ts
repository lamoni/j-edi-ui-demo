import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TopologyComponent } from "./topology.component";

const routes: Routes = [{
  path: '',
  component: TopologyComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class TopologyRoutingModule { }