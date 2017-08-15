import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopologyComponent } from './topology.component';
import { TopologyRoutingModule } from './topology-routing.module';
import {SmartadminLayoutModule} from "../shared/layout/layout.module";
import {SmartadminWidgetsModule} from "../shared/widgets/smartadmin-widgets.module";
import { FormsModule }  from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SmartadminLayoutModule,
    SmartadminWidgetsModule,
    TopologyRoutingModule
  ],
  declarations: [TopologyComponent]
})
export class TopologyModule { }
