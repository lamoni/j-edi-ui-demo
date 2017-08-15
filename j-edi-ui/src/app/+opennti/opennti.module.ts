import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { openNtiRouting } from './opennti.routing';
import {SmartadminModule} from "../shared/smartadmin.module";
import { OpenNtiComponent } from "./opennti.component";

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
  openNtiRouting,
  SmartadminModule,
  FlotChartModule,
  SmartadminInputModule,
  JcomponentsModule,
  AccordionModule.forRoot(),
  FormsModule,
  SmartadminLayoutModule,
  SmartadminWidgetsModule,
  ],
  declarations: [OpenNtiComponent],
  entryComponents: []
})
export class OpenNtiModule { }
