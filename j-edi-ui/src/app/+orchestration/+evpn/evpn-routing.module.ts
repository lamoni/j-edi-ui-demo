import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EvpnComponent } from "./evpn.component";

const routes: Routes = [{
  path: '',
  component: EvpnComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class EvpnRoutingModule { }