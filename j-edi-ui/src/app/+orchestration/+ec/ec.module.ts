import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EcComponent } from './ec.component';
import { EcRoutingModule } from './ec-routing.module';
import {SmartadminLayoutModule} from "../../shared/layout/layout.module";
import {SmartadminWidgetsModule} from "../../shared/widgets/smartadmin-widgets.module";
import { FormsModule }  from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    EcRoutingModule,
    SmartadminLayoutModule,
    SmartadminWidgetsModule,
    FormsModule
  ],
  declarations: [EcComponent]
})
export class EcModule { }
