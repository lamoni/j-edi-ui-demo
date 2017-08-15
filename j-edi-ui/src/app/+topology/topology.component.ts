import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../shared/animations/fade-in-top.decorator";

import { DataService } from "app/services/data/data.service";

import { TopologyProvider } from '../services/topology.service';

//Here is your access to jquery
declare var $: any;

@FadeInTop()
@Component({
    selector: 'app-topology',
    templateUrl: './topology.component.html',
    styleUrls: ['./topology.component.css']
})
export class TopologyComponent implements OnInit {

    constructor(private dataService:DataService) {}

    getData:any = {
        key:undefined,
        data:undefined
    };

    deleteData:any = {
        key:undefined
    }

    postData:any = {
        key:undefined,
        data:undefined
    };

    addNetworkDeviceParams:any = {
        name:undefined,
        ip:undefined,
        icon_type:undefined
    }

    deviceDetails:any = {
        saltData:undefined,
        deviceName:undefined,
        syslog_host:undefined,
        telemetry_host:undefined,
        ntp_host:undefined
    }

    deviceFacts: any = {
        os_family: undefined,
        uptime: undefined,
        model: undefined,
        serial: undefined,
        version: undefined,
        nodename: undefined
    }

    tools:any = {
        tool:undefined,
        arg:undefined,
        output:' '
    }

    showSuccess: boolean = false;
    showFail: boolean = false;

    deleteSuccess: boolean = false;
    deleteFail: boolean = false;

    $: any = undefined;
    canvas: any = undefined;

    topologyName: any = undefined;
    loadTopologyName: any = undefined;

    topologyList: any = undefined;

    canvas_layout: any = undefined;

    onPostSubmit(postForm) {
        this.dataService.postKeyValue(this.postData)
            .map(response => response.json())
            .subscribe((message) => {
                TopologyProvider.addIcon(null);
                this.showSuccess = true;
                this.showFail = false;
        });
    }

    onGetSubmit(getForm) {
        this.dataService.getKeyValue(this.getData.key)
            .map(response => response.json())
            .subscribe((message) => {
                this.getData.data = message;
        });
    }

    onDeleteSubmit(deleteForm) {
        this.dataService.deleteKeyValue(this.deleteData.key)
            .map(response => response.json())
            .subscribe((message) => {
                this.deleteSuccess = true;
                this.deleteFail = false;
        });

        // get the latest topologyList and delete this name to it when it returns
        this.dataService.getKeyValue('jedi_topologies')
            .map(response => response.json())
            .subscribe(val => this.deleteTopologyFromList(this.deleteData.key, val));
    }

    executeTroubleshootingTool() {
        console.log('troubleshooting begin!');
        /*
            <option value="ping">Ping</option>
            <option value="traceroute">Traceroute</option>
            <option value="utilization">System Utilization</option>
            <option value="bgp">Show BGP Status</option>
            <option value="ospf">Show OSPF Neighbors</option>
            <option value="route">Show Route</option>
            <option value="cli">CLI command</option>

        */

        var fun = 'test.ping'
        var arg = undefined

        this.tools.output = 'Executing Command ... ';

        switch(this.tools.tool) {

            case 'ping':
                fun = 'junos.cli';
                arg = 'ping ' + this.tools.arg + ' count 3';
                break;
            case 'interface':
                fun = 'junos.cli';
                arg = 'show interfaces terse';
                break;
            case 'config':
                fun = 'junos.cli';
                arg = 'show configuration';
                break;

            case 'bgp':
                fun = 'junos.cli';
                arg = 'show bgp summary';
                break;
            case 'ospf':
                fun = 'junos.cli';
                arg = 'show ospf neighbors';
                break;

            case 'route':
                fun = 'junos.cli';
                arg = 'show route';
                break;
            case 'cli':
                fun = 'junos.cli';
                arg = this.tools.arg;
                break;
            default:
                fun = 'test.ping'
                arg = undefined;

        }

        var cmd = {
            cli: {
                'tgt': this.deviceDetails.deviceName,
                'fun': fun,
                'client':'local',
                'arg': arg
            },
            token: sessionStorage.getItem("AUTH_TOKEN")
        }

        this.dataService.postSaltEvent(cmd)
            .map(response => response.json())
            .subscribe(val => {
                console.log(val);
                if (val['return'][0][this.deviceDetails.deviceName] != undefined) {
                    if (val['return'][0][this.deviceDetails.deviceName]['message'] != undefined) {
                        this.tools.output = val['return'][0][this.deviceDetails.deviceName]['message'];
                    } else {
                         this.tools.output = val['return'][0][this.deviceDetails.deviceName];
                    }
                } else {
                    this.tools.output = val;
                }
            });
    }

    loadTopology(topologyName) {
        console.log(topologyName);

        // save this value incase of an update
        this.topologyName = topologyName;

        this.dataService.getKeyValue(topologyName)
            .map(response => response.json())
            .subscribe(val => TopologyProvider.renderTopology(this.canvas, val));
    }

    loadTopologyManual(loadTopologyForm) {
        console.log(this.loadTopologyName);

        // save this value incase of an update
        this.topologyName = this.loadTopologyName;

        this.dataService.getKeyValue(this.loadTopologyName)
            .map(response => response.json())
            .subscribe(val => TopologyProvider.renderTopology(this.canvas, val));
    }

    loadDeviceDetails(deviceName) {
        console.log("Device Name is " + deviceName );
        console.log(deviceName);

        var cmd = {
            cli: {
                'tgt': deviceName,
                'fun':'pillar.items',
                'client':'local',
                'arg':undefined
            },
            token: sessionStorage.getItem("AUTH_TOKEN")
        }

        var grainsCmd = {
            cli: {
                'tgt': deviceName,
                'fun':'grains.items',
                'client':'local',
                'arg':undefined
            },
            token: sessionStorage.getItem("AUTH_TOKEN")
        }

        this.deviceDetails.deviceName = deviceName;

        this.dataService.postSaltEvent(grainsCmd)
            .map(response => response.json())
            .subscribe(val => {
                if (val['return'][0][deviceName] != undefined) {
                    this.deviceFacts.osFamily = val['return'][0][deviceName]['os_family'];
                    this.deviceFacts.uptime = val['return'][0][deviceName]['junos_facts']['RE0']['up_time'];
                    this.deviceFacts.model = val['return'][0][deviceName]['junos_facts']['model'];
                    this.deviceFacts.serial = val['return'][0][deviceName]['junos_facts']['serialnumber'];
                    this.deviceFacts.version = val['return'][0][deviceName]['junos_facts']['version'];
                    this.deviceFacts.nodename = val['return'][0][deviceName]['nodename'];
                } else {
                    this.deviceFacts.osFamily = 'n/a';
                    this.deviceFacts.uptime = 'n/a';
                    this.deviceFacts.model = 'n/a';
                    this.deviceFacts.serial = 'n/a';
                    this.deviceFacts.version = 'n/a';
                    this.deviceFacts.nodename = 'n/a';
                }
                $('#iconDetails').modal();
            });


        this.dataService.postSaltEvent(cmd)
            .map(response => response.json())
            .subscribe(val => {
                if (val['return'][0][deviceName] != undefined) {
                    this.deviceDetails.saltData = val['return'][0][deviceName];
                    this.deviceDetails.syslog_host = val['return'][0][deviceName]['syslog_host'];
                    this.deviceDetails.telemetry_host = val['return'][0][deviceName]['telemetry']['collector'];
                    this.deviceDetails.ntp_host = 'FIXME';
                } else {
                    this.deviceDetails.syslog_host = 'n/a';
                    this.deviceDetails.telemetry_host = 'n/a';
                    this.deviceDetails.ntp_host = 'n/a';
                }
            });
    }

    loadTroubleshooting() {

    }

    listTopologies() {

       this.dataService.getKeyValue('jedi_topologies')
            .map(response => response.json())
            .subscribe(val => {
                if (val != null) {
                    TopologyProvider.renderTopologyList(this.canvas, val);
                } else {
                    console.log('no topologies found');
                }
            });
    }

    addNetworkDevice(addNetworkDeviceForm) {
        console.log('OK');
        // console.log(this.addNetworkDeviceParams);

        var icon_array = this.addNetworkDeviceParams.icon_type.split(':');
        var icon_name = icon_array[0];
        var icon_width = icon_array[1];
        var icon_height = icon_array[2];
        // draw2d: any, jQuery: any, label, ip, icon, width, height
        var z = TopologyProvider.getDeviceIcon(this.addNetworkDeviceParams.name, this.addNetworkDeviceParams.ip, icon_name, icon_width, icon_height);
        //var z = TopologyProvider.getCloudIcon(this.draw2d, this.$, icon_name);
        TopologyProvider.addIconToCanvas(this.canvas, z);

    }

    addTopologyToList(topologyName: any, topologyList: any) {

        console.log(topologyName);
        console.log(topologyList);
        console.log(typeof(topologyList));

        var j = [];
        if (topologyList != null) {
            j = JSON.parse(topologyList);
        }

        if($.inArray(topologyName, j) != -1) {
            console.log('already added!');
            return;
        }

        if (typeof(j) != 'object') {
            console.log('resetting list to be an actual list!');
            j = [];
        }

        j.push(topologyName);

        var kv = {
            'key': 'jedi_topologies',
            'data': JSON.stringify(j)
        }

        console.log('pushing kv');
        console.log(kv);

        this.dataService.postKeyValue(kv)
            .map(response => response.json())
            .subscribe((message) => {
                this.showSuccess = true;
                this.showFail = false;
        });
    }

    deleteTopologyFromList(topologyName: any, topologyList: any) {

        console.log(topologyName);
        console.log(topologyList);
        console.log(typeof(topologyList));

        var j = JSON.parse(topologyList);

        if($.inArray(topologyName, j) == -1) {
            console.log('already removed!');
            return;
        }

        if (typeof(j) != 'object') {
            console.log('resetting list to be an actual list!');
            j = [];
        }

        j.splice(j.indexOf(topologyName), 1);

        // temporary cleanup - can remove me
        if (j.indexOf(null) != -1) {
            console.log('we have a null value in there somehow!');
            j.splice(j.indexOf(null), 1);
        }

        var kv = {
            'key': 'jedi_topologies',
            'data': JSON.stringify(j)
        }

        console.log('pushing kv');
        console.log(kv);

        this.dataService.postKeyValue(kv)
            .map(response => response.json())
            .subscribe((message) => {
                this.deleteSuccess = true;
                this.deleteFail = false;
        });
    }

    saveTopology(topologyForm) {

        var data = TopologyProvider.getTopologyJson(this.canvas);
        var params = {
            'key': this.topologyName,
            'data': data
        }
        // fix me verify topologyName is set!
        console.log(params);

        this.dataService.postKeyValue(params)
            .map(response => response.json())
            .subscribe((message) => {
                console.log('saved ok!');
        });

        // get the latest topologyList and add this name to it when it returns
        this.dataService.getKeyValue('jedi_topologies')
            .map(response => response.json())
            .subscribe(val => this.addTopologyToList(this.topologyName, val));
    }

    addCloud() {
        TopologyProvider.addCloud(this.canvas);
    }

    clearTopology() {
        this.canvas.clear();
    }

    ngOnInit() {;
        //let test = draw2d;

        this.$ = jQuery();
        var d = TopologyProvider.getDraw2d();
        this.canvas = new d.Canvas("network_topology_0", true);
        TopologyProvider.eventEmitter1.subscribe((message) => {
            this.loadTopology(message);
        });

        TopologyProvider.eventEmitter2.subscribe((message) => {
            this.loadDeviceDetails(message);
        });

    }
}
