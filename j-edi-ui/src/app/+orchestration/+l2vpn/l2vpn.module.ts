import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { L2vpnComponent } from './l2vpn.component';
import { L2vpnRoutingModule } from './l2vpn-routing.module';
import {SmartadminLayoutModule} from "../../shared/layout/layout.module";
import {SmartadminWidgetsModule} from "../../shared/widgets/smartadmin-widgets.module";
import { FormsModule }  from '@angular/forms';

import { AlertModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    L2vpnRoutingModule,
    SmartadminLayoutModule,
    SmartadminWidgetsModule,
    FormsModule,
    AlertModule
  ],
  declarations: [L2vpnComponent]
})
export class L2vpnModule { }