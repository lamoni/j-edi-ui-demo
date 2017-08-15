import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { L3vpnComponent } from "./l3vpn.component";

const routes: Routes = [{
  path: '',
  component: L3vpnComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class L3vpnRoutingModule { }