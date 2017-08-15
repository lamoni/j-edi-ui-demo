import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { serviceListRouting } from './servicelist.routing';
import {SmartadminModule} from "../shared/smartadmin.module";
import { ServiceListComponent } from "./servicelist.component";

import {FlotChartModule} from "../shared/graphs/flot-chart/flot-chart.module";
import { AccordionModule } from 'ngx-bootstrap';

import { JcomponentsModule } from "../jcomponents/jcomponents.module";
import {SmartadminInputModule} from "../shared/forms/input/smartadmin-input.module";
import {SmartadminLayoutModule} from "../shared/layout/layout.module";
import {SmartadminWidgetsModule} from "../shared/widgets/smartadmin-widgets.module";
import { FormsModule }  from '@angular/forms';

@NgModule({
  imports: [
  CommonModule,
  serviceListRouting,
  SmartadminModule,
  FlotChartModule,
  SmartadminInputModule,
  JcomponentsModule,
  AccordionModule.forRoot(),
  FormsModule,
  SmartadminLayoutModule,
  SmartadminWidgetsModule,
  ],
  declarations: [ServiceListComponent],
  entryComponents: []
})
export class ServiceListModule { }
