import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { L2vpnComponent } from "./l2vpn.component";

const routes: Routes = [{
  path: '',
  component: L2vpnComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class L2vpnRoutingModule { }