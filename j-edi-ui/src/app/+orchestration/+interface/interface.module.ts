import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterfaceComponent } from './interface.component';
import { InterfaceRoutingModule } from './interface-routing.module';
import {SmartadminLayoutModule} from "../../shared/layout/layout.module";
import {SmartadminWidgetsModule} from "../../shared/widgets/smartadmin-widgets.module";
import { FormsModule }  from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    InterfaceRoutingModule,
    SmartadminLayoutModule,
    SmartadminWidgetsModule,
    FormsModule
  ],
  declarations: [InterfaceComponent]
})
export class InterfaceModule { }
