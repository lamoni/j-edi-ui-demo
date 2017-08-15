import { Component, OnInit, ViewChild } from '@angular/core';


import { FadeInTop } from "../shared/animations/fade-in-top.decorator";

import { DataService } from '../services/data/data.service';
import {NotificationService} from "../shared/utils/notification.service";

import { JediContainerComponent } from '../jcomponents/widget-container/jedi-container.component';
import { OpenntiGraphComponent } from "app/jcomponents/opennti-graph/opennti-graph.component";
import { JediComponent } from "app/jcomponents/common/JediComponent";

import * as moment from 'moment';

import { UUID } from 'angular2-uuid';

declare var $: any;

@FadeInTop()
@Component({
    selector: 'app-open-nti',
    templateUrl: './opennti.component.html'
})
export class OpenNtiComponent implements OnInit {
    @ViewChild(JediContainerComponent) jediContainer: JediContainerComponent;

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

    data = {
        fromDate: undefined,
        toDate: undefined,
        fromTime: undefined,
        toTime: undefined,
        views: undefined,
        graphData: undefined,
        hostRegex: undefined,
        interface: undefined,
        metric: undefined,
        influxQuery: undefined,
        title: undefined
    };

    interfacesForDeviceQuery: any = '';

    // influxQuery: any;

    // hostRegexs: any = [{
    //         "key": "device",
    //         "value": "All"
    //     },
    //     {
    //         "key": "device",
    //         "value": "vmx01:192.168.122.7"
    //     },
    //     {
    //         "key": "device",
    //         "value": "vmx02:192.168.122.9"
    //     }
    // ];
    hostRegexs: any = [];
    interfaces: any = [];
    metrics: any = [];

    panelCount: any = 0;

    onQueryClick(event) {
        console.log(this.data.influxQuery);
        let query = {"query":this.data.influxQuery};
        this.dataService.postInfluxDbQuery(query)
            .map(response => response.json())
            .subscribe((rows) => {
                console.log(rows);
            });   
    }

    onClick(event, title, panelIds) {
        if(!this.data.hostRegex) this.data.hostRegex = "All";
        if(!this.data.interface) this.data.interface = "All";
        if(!this.data.metric) this.data.metric = "All";

        let fromMoment = moment(this.data.fromDate + ' ' + $('#fromTime').val());
        let toMoment = moment(this.data.toDate + ' ' + $('#toTime').val());
        let nowMoment = moment();

        //turns the difference into minutes
        let toMinutes = (nowMoment.valueOf() - toMoment.valueOf()) / 60000;
        let fromMinutes = (nowMoment.valueOf() - fromMoment.valueOf()) / 60000;

        let panels = panelIds.split(',');


        let cleaned_hostRegex = this.data.hostRegex.replace(/\./g, '\\.');
        let cleaned_interface = this.data.interface.replace(/\//g, '\\/').replace(/\./g, '\\.');

        console.log(cleaned_hostRegex);
        console.log(cleaned_interface);

        for(let panelId of panels) {
            let panelComponent: JediComponent = new JediComponent(OpenntiGraphComponent, {
                id: UUID.UUID(),
                title: this.data.title,
                hostRegex: cleaned_hostRegex,
                interface: cleaned_interface,
                metric: this.data.metric,
                toMinutes: parseInt(toMinutes.toString()),
                fromMinutes: parseInt(fromMinutes.toString()),
                panelId:panelId
            }); 
            this.jediContainer.addComponent(panelComponent);     
        }



        // let panel1Component: JediComponent = new JediComponent(OpenntiGraphComponent, {
        //     id: 'e0fw0fwjsifj',
        //     title: title,
        //     hostRegex: this.data.hostRegex,
        //     interface: this.data.interface,
        //     minutes: '15',
        //     panelId:panelId
        // });
        // this.jediContainer.addComponent(panel1Component);
        // let panel2Component: JediComponent = new JediComponent(OpenntiGraphComponent, {
        //     id: 'iefowjief32',
        //     title: title,
        //     hostRegex: this.data.hostRegex,
        //     interface: this.data.interface,
        //     minutes: '15',
        //     panelId:panelId
        // });
        // this.jediContainer.addComponent(panel2Component);
        
        this.jediContainer.updateWidgetGridSystem();
        // this.dataService.getGraphData("1")
        //                 .subscribe((graph) => {
        //                     let jediComponent:JediComponent = new JediComponent(OpenntiGraphComponent, {id:"test", title:"My Test"});
        //                     this.jediContainer.addComponent(jediComponent);
        //                     this.jediContainer.updateWidgetGridSystem();
        //                       // let name = new Date().getTime().toString();
        //                       // this.widgeHost.addComponent(new WidgetItem(WgtComponent, {widgetName:name, widgetTitle:graph.title, flotData:graph.flotData, siteStatsDemoOptions:this.siteStatsDemoOptions}));
        //                       // this.widgeHost.updateWidgetGridSystem();                          
        //                 });
    }

    addGraph(event) {
        if(!this.data.hostRegex) this.data.hostRegex = "All";
        if(!this.data.interface) this.data.interface = "All";
        if(!this.data.metric) this.data.metric = "All";

        let fromMoment = moment(this.data.fromDate + ' ' + $('#fromTime').val());
        let toMoment = moment(this.data.toDate + ' ' + $('#toTime').val());

        let fromUnix = fromMoment.unix() * 1000;
        let toUnix = toMoment.unix() * 1000;

        let title = this.data.hostRegex + " " + this.data.interface;

        let panelComponent: JediComponent = new JediComponent(OpenntiGraphComponent, {
            id: UUID.UUID(),
            title: title,
            hostRegex: this.data.hostRegex.replace(/\./g, '\\.'),
            interface: this.data.interface.replace(/\//g, '\\/').replace(/\./g, '\\.'),
            metric: this.data.metric,
            toMinutes: toUnix,
            fromMinutes: fromUnix,
            panelId:this.panelCount
        });
        this.panelCount += 1;
        this.jediContainer.addComponent(panelComponent);


        this.jediContainer.updateWidgetGridSystem();

    }

    constructor(private dataService: DataService, private notificationService: NotificationService) {}

    onChange(event) {
        console.log("onchange");
    }

    onShowAlert() {
        this.notificationService.smallBox({
            title: "J-EDI Alert Notification",
            content: "Interface ge-/0/0/1.0 has become unreachable.  Please check the cloud mesh view for more details.",
            color: "#C46A69",
            timeout: 4000,
            icon: "fa fa-exclamation"
        });
    }

    ngOnInit() {

        this.dataService.getInfluxDbDevices()
            .map(response => response.json())
            .subscribe((rows) => {
                console.log(rows);
                this.hostRegexs = rows;
            });

        this.dataService.getInfluxDbInterfaces()
            .map(response => response.json())
            .subscribe((rows) => {
                console.log(rows);
                this.interfaces = rows;
            });

        this.dataService.getInfluxDbMetrics()
            .map(response => response.json())
            .subscribe((rows) => {
                console.log(rows);
                this.metrics = rows;
            });

        this.data.fromDate = moment().format("MM/DD/YYYY");
        this.data.toDate = moment().format("MM/DD/YYYY");
        
        let nowMoment = moment();
        
        $('#fromTime').val(moment().add(-15, "minutes").format("h:mm A"));
        $('#toTime').val(nowMoment.format("h:mm A"));

        this.dataService.getGraphViews("1")
            .subscribe((graphViews) => {
                this.data.views = graphViews;
            });
        this.dataService.getGraphDataByView("1")
            .subscribe((graphData) => {
                this.data.graphData = graphData;
                // graphData.graphs.forEach(graph => {
                //       let jediComponent:JediComponent = new JediComponent(OpenntiGraphComponent, null);
                //       this.jediContainer.addComponent(jediComponent);
                //       this.jediContainer.updateWidgetGridSystem();                        
                // });
            });

        // setTimeout(() => {this.onShowAlert()}, 5000);
    }

    loadInterfacesForDevice() {
        let q = `SHOW TAG VALUES WITH KEY = "interface" WHERE device =~ /` + this.data.hostRegex + `/`;
        let query = {'query': q};

        console.log('loading interfaces for device')
        this.dataService.postInfluxDbQuery(query)
            .map(response => response.json())
            .subscribe((rows) => {
                console.log(rows);
                console.log(rows);
                this.interfaces = rows;
        });


    }
}