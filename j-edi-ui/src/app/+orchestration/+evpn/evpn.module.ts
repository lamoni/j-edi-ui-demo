import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvpnComponent } from './evpn.component';
import { EvpnRoutingModule } from './evpn-routing.module';
import {SmartadminLayoutModule} from "../../shared/layout/layout.module";
import {SmartadminWidgetsModule} from "../../shared/widgets/smartadmin-widgets.module";
import {SmartadminInputModule} from "../../shared/forms/input/smartadmin-input.module";

import { FormsModule }  from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    EvpnRoutingModule,
    SmartadminLayoutModule,
    SmartadminWidgetsModule,
    SmartadminInputModule,
    FormsModule
  ],
  declarations: [EvpnComponent]
})
export class EvpnModule { }
