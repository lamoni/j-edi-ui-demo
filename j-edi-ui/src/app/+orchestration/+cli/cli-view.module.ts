import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CliRoutingModule } from './cli-routing.module';
import { CliViewComponent } from './cli-view.component';
import {SmartadminLayoutModule} from "../../shared/layout/layout.module";
import {SmartadminWidgetsModule} from "../../shared/widgets/smartadmin-widgets.module";
// import { JcomponentsModule } from '../jcomponents/jcomponents.module';
import { FormsModule }  from '@angular/forms';
import { JcomponentsModule } from "app/jcomponents/jcomponents.module";

@NgModule({
  imports: [
    CommonModule,
    CliRoutingModule,
    FormsModule,
    SmartadminLayoutModule,
    SmartadminWidgetsModule,
    JcomponentsModule
  ],
  declarations: [CliViewComponent]
})
export class CliViewModule { }