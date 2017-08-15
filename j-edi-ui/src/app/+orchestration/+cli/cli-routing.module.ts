import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CliViewComponent } from "./cli-view.component";

const routes: Routes = [{
  path: '',
  component: CliViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class CliRoutingModule { }