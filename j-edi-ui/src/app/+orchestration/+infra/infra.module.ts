import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfraComponent } from './infra.component';
import { InfraRoutingModule } from './infra-routing.module';
import {SmartadminLayoutModule} from "../../shared/layout/layout.module";
import {SmartadminWidgetsModule} from "../../shared/widgets/smartadmin-widgets.module";
import { FormsModule }  from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    InfraRoutingModule,
    SmartadminLayoutModule,
    SmartadminWidgetsModule,
    FormsModule
  ],
  declarations: [InfraComponent]
})
export class InfraModule { }
