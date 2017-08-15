import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data/data.service';
import { Graph } from '../../models/models';
import { CommonComponent } from '../common/CommonComponent';

import { environment } from '../../../environments/environment';

declare var $: any;

@Component({
    selector: 'jedi-opennti-graph',
    templateUrl: './opennti-graph.component.html',
    styleUrls: ['./opennti-graph.component.css']
})
export class OpenntiGraphComponent implements OnInit, CommonComponent {
    data: any;

    constructor(private dataService: DataService) {}

    // colors = {
    //     "chartBorderColor": "#efefef",
    //     "chartGridColor": "#DDD",
    //     "charMain": "#E24913",
    //     "chartSecond": "#6595b4",
    //     "chartThird": "#FF9F01",
    //     "chartFourth": "#7e9d3a",
    //     "chartFifth": "#BD362F",
    //     "chartMono": "#000"
    // };

    // siteStatsDemoOptions = {
    //     series: {
    //         lines: {
    //             show: true
    //         },
    //         points: {
    //             show: true
    //         }
    //     },
    //     grid: {
    //         hoverable: true,
    //         clickable: true,
    //         tickColor: this.colors.chartBorderColor,
    //         borderWidth: 0,
    //         borderColor: this.colors.chartBorderColor
    //     },
    //     tooltip: true,
    //     tooltipOpts: {
    //         defaultTheme: false
    //     },
    //     colors: [this.colors.chartSecond, this.colors.chartFourth],
    //     yaxis: {
    //         min: -1.1,
    //         max: 1.1
    //     },
    //     xaxis: {
    //         min: 0,
    //         max: 15
    //     }
    // };
    graph: Graph = undefined;
    //urlPath:string;



    executeQuery() {

        this.dataService.getInfluxDbQueryResults(this.data)
            .subscribe((rows) => {
                // console.log(rows);
                let seriesData = [];
                let chartData = [];
                for ( var r in rows) {
                    let row = rows[r];
                    var d = new Date(row.time);
                    let point = [d.getTime(), row.derivative];
                    seriesData.push(point);
                }
                let series = {};
                series['data'] = seriesData;
                series['label'] = this.data.metric;
                chartData.push(series);
                console.log(chartData);

                this.graph.title = this.data.hostRegex;
                this.graph.flotData.chartData = chartData;

        });
    }

    ngOnInit() {
        console.log('MAKING GRAPH');
        let width = $('div.jarviswidget:first').width();
        width = parseInt(width) * 0.94;
        width= parseInt(width);
        let height = width * 0.55;
        height = parseInt(height.toString());

        //this.urlPath = `${environment.grafanaEndpoint}from=now-${this.data.fromMinutes}m&to=${this.data.toMinutes}m&var-host_regex=${this.data.hostRegex}&var-interface=${this.data.interface}&var-GroupBy=%24__auto_interval&panelId=${this.data.panelId}&width=${width}&height=${height}`;
        this.dataService.getGraphData(this.data)
            .subscribe((graph) => {
                this.graph = graph;
           });
        console.log(this.graph.flotData.chartData);

        this.executeQuery();
    }

}