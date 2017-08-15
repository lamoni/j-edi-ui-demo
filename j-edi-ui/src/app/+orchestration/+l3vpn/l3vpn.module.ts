import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { L3vpnRoutingModule } from './l3vpn-routing.module';
import { L3vpnComponent } from './l3vpn.component';
import {SmartadminLayoutModule} from "../../shared/layout/layout.module";
import {SmartadminWidgetsModule} from "../../shared/widgets/smartadmin-widgets.module";
import { FormsModule }  from '@angular/forms';
import {SmartadminModule} from "../../shared/smartadmin.module";

import { TabsModule, AlertModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    L3vpnRoutingModule,
    FormsModule,
    SmartadminLayoutModule,
    SmartadminWidgetsModule,
    TabsModule,
    AlertModule
  ],
  declarations: [L3vpnComponent]
})
export class L3vpnModule { }