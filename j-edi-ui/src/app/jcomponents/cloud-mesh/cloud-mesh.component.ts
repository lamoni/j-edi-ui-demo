import { Component, OnInit } from '@angular/core';

import { DataService } from '../../services/data/data.service';
import { Graph } from '../../models/models';
import { CommonComponent } from '../common/CommonComponent';

@Component({
    selector: 'jedi-cloud-mesh',
    templateUrl: './cloud-mesh.component.html',
    styleUrls: ['./cloud-mesh.component.css']
})
export class CloudMeshComponent implements OnInit, CommonComponent {
    data:any;

    constructor(private dataService: DataService) {}

    colors = {
        "chartBorderColor": "#efefef",
        "chartGridColor": "#DDD",
        "charMain": "#E24913",
        "chartSecond": "#6595b4",
        "chartThird": "#FF9F01",
        "chartFourth": "#7e9d3a",
        "chartFifth": "#BD362F",
        "chartMono": "#000"
    };

    siteStatsDemoOptions = {
        series: {
        lines: {
            show: true
        },
        points: {
            show: true
        }
        },
        grid: {
        hoverable: true,
        clickable: true,
        tickColor: this.colors.chartBorderColor,
        borderWidth: 0,
        borderColor: this.colors.chartBorderColor
        },
        tooltip: true,
        tooltipOpts: {
        //content : "Value <b>$x</b> Value <span>$y</span>",
        defaultTheme: false
        },
        colors: [this.colors.chartSecond, this.colors.chartFourth],
        yaxis: {
        min: -1.1,
        max: 1.1
        },
        xaxis: {
        min: 0,
        max: 15
        }
    };



    graph:Graph = undefined;

    ngOnInit() {
      this.dataService.getGraphData("1")
                      .subscribe((graph) => {
                            this.graph = graph;
                      });
    }

}
