import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloudMeshComponent } from './cloud-mesh/cloud-mesh.component';
import { CliComponent } from './cli/cli.component';
import { WidgetComponent } from "../shared/widgets/widget/widget.component";
import {SmartadminModule} from "../shared/smartadmin.module";
import {FlotChartModule} from "../shared/graphs/flot-chart/flot-chart.module";
import { JediContainerComponent } from './widget-container/jedi-container.component';
import { OpenntiGraphComponent } from './opennti-graph/opennti-graph.component';


@NgModule({
  imports: [
    SmartadminModule,
    CommonModule,
    FlotChartModule
  ],
  exports: [CliComponent, CloudMeshComponent, JediContainerComponent],
  declarations: [CloudMeshComponent, CliComponent, JediContainerComponent, OpenntiGraphComponent],
  entryComponents: [CliComponent, CloudMeshComponent, JediContainerComponent, OpenntiGraphComponent]
})
export class JcomponentsModule { }
