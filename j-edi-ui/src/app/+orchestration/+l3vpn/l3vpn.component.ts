import { Component, OnInit } from '@angular/core';

import { L3VPN, Endpoint, NetworkService, ServiceArg } from '../../models/models';
import { YamlService } from '../../services/yaml/yaml.service';
import { DataService } from '../../services/data/data.service';
import { EventBusService } from '../../services/data/event-bus.service';

import * as YAML from 'yamljs';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";

@FadeInTop()
@Component({
  selector: 'app-l3vpn',
  templateUrl: './l3vpn.component.html',
  providers:[YamlService]
})

export class L3vpnComponent implements OnInit {

    constructor(private yamlService:YamlService, private dataService:DataService, private eventBusService:EventBusService) { }

    l3vpn:L3VPN = {
        ebgpGroupName:"",
        vpnName:'',
        endpoints:[],
        target:'',
        saltPath:"salt://templates/junos/l3vpn.config",
        serviceName:'',
        serviceId:''
    };

    isSuccess:boolean = false;
    
    endpoint:Endpoint = {
        interface: "",
        localAddress: '',
        peerAddress: '',
        deviceName: '',
        subnet:undefined,
        inputPolicerName:undefined,
        outputPolicerName:undefined,
        unit:undefined,
        vlanTag:'',
        innerVlanTag:''
    }

    deviceList:Array<string> = undefined;
    interfaceList:Array<string> = undefined;

    private jobId:string = undefined;
    private jobResultMessage:string = undefined;
    private jobResultDump:string = undefined;
    private jobResults:Array<string> = [];
    private jobResultObject:any = undefined;

    private command:any = {
        cli: {
            tgt:undefined,
            fun:'orchestration.create_instance',
            client:'runner_async',
            arg:undefined,
            // arg:undefined,
            kwarg: {
                file_contents:undefined,
                service_name:undefined
            }
        },
        token:''
    }

    private deviceListCommand:any = {
        cli: {
            tgt:undefined,
            fun:'manage.up',
            client:'runner'
        },
        token:''
    }

    private interfaceListCommand:any = {
        cli: {
            tgt:undefined,
            fun:'junos.rpc',
            client:'local',
            arg: 'get_interface_information'
        },
        token:''
    }

    private setEnpointPristine() {
        this.endpoint.interface = '';
        this.endpoint.localAddress = '';
        this.endpoint.peerAddress = '';
        this.endpoint.deviceName = '';
        this.endpoint.inputPolicerName = '';
        this.endpoint.outputPolicerName = '';
        this.endpoint.neighborAddress = '';
        this.endpoint.unit = '0';
        this.endpoint.subnet = '';
        this.endpoint.routeDistinguisher = '';
        this.endpoint.vlanTag = '';
        this.endpoint.innerVlanTag = '';
    }

    private interval:any = undefined;
    private intervalCount:number = 0;

    getInterfaceList() {
        this.interfaceList = [];
        this.endpoint.interface = '';
        this.interfaceListCommand.token = sessionStorage.getItem("AUTH_TOKEN");
        this.interfaceListCommand.cli.tgt = this.endpoint.deviceName;

        if (this.endpoint.deviceName == '') {
            return;
        }
        this.dataService.getManagedInterfaces(this.interfaceListCommand)
            .map(response => response.json())
              .subscribe((ret) => {
                  console.log(ret);
                  this.interfaceList = ret;
            },(error) => {
                //this.interfaceList = ['none available'];
                console.log(error);
            });
    }

    ngOnInit() {
        this.interval = setInterval(() => this.connectEventBus(), 100);
        this.deviceListCommand.token = sessionStorage.getItem("AUTH_TOKEN");
        this.dataService.getManagedDevices(this.deviceListCommand)
            .map(response => response.json())
              .subscribe((ret) => {
                  if (ret['return'] != 'undefined') {
                    this.deviceList = ret['return'][0];
                  }
            });
    }

    private connectEventBus():void {
        if(this.eventBusService.eventbus) {
            this.eventBusService.eventbus
                    .map((response: MessageEvent): any => {
                        let data = JSON.parse(response.data);
                        return response.data;
                    })
                    .subscribe(msg => {
                        if(this.jobId && msg.indexOf(this.jobId) >= 0) {
                            let result = JSON.parse(msg);
                            this.isSuccess = true;
                            if(result.data.return) {
                                this.jobResults.push(result.data);
                                if(result.data.return.message) {
                                    if(typeof result.data.return.message === "string") {
                                        this.jobResultDump = result.data.return.message;
                                    }
                                    else {
                                        this.jobResultObject = result.data.return.message;
                                    }
                                }
                                else {
                                    this.jobResultObject = result.data;
                                }
                            }
                            console.log(result.data);
                        }
                    },
                    (error) => {
                        console.error(error);
                    },
                    () => {
                        console.log('should kill the socket connection');
                    });
            clearInterval(this.interval);
        }
        else {
            this.intervalCount += 1;
            if(this.intervalCount > 100) {
              clearInterval(this.interval);
            }
            console.log('waiting to connect to eventbus');
        }
    }

    onSubmit() {

          try {
            let l3vpnService = this.yamlService.convertL3vpn(this.l3vpn);
            console.log(l3vpnService);
            
            this.command.cli.kwarg.file_contents = l3vpnService;
            this.command.cli.kwarg.service_name = this.l3vpn.serviceName;

            this.command.token = sessionStorage.getItem("AUTH_TOKEN");
            this.dataService.postSaltEvent(this.command).subscribe(data => {

                let result = JSON.parse(data._body);
                this.jobId = result.return[0].jid;
                if(this.jobId) {
                    this.jobResultMessage = `Job Id ${this.jobId}`;
                }
                else {
                    this.jobResultDump = `\n   Endpoint ${this.command.cli.tgt} not found.  Are you sure this is a valid endpoint?  \n\n`;
                }
            });
          }
          catch(err) {
              console.log(err);
          }
          
//         console.log(finalYaml);
    }

    onEndpointAdd(event) {
        this.l3vpn.endpoints.push(Object.assign({}, this.endpoint));
        this.setEnpointPristine();
    }

    onEdit(index) {
        this.endpoint = this.l3vpn.endpoints[index];
    }

    onRemove(index) {
        index++;
        this.l3vpn.endpoints = this.l3vpn.endpoints.splice(index, 1);
    }

}
