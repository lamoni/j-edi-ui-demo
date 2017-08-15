import { Component, OnInit } from '@angular/core';

import { L2VPN, Endpoint, NetworkService, ServiceArg } from '../../models/models';
import { YamlService } from '../../services/yaml/yaml.service';
import { DataService } from '../../services/data/data.service';
import { EventBusService } from '../../services/data/event-bus.service';

import * as YAML from 'yamljs';

@Component({
  selector: 'app-evpn',
  templateUrl: './evpn.component.html',
  styleUrls: ['./evpn.component.css']
})
export class EvpnComponent implements OnInit {

    constructor(private yamlService:YamlService, private dataService:DataService, private eventBusService:EventBusService) { }

    l2vpn:any = {
        vpnName:'',
        endpoints:[],
        routeTarget:'',
        routeDistinguisher:'',
        saltPath:"salt://templates/junos/l2vpn.config",
        serviceName:'',
        serviceId:'',
        vlanMagic:''
    };

    isSuccess:boolean = false;

    deviceList:Array<string> = undefined;
    interfaceList:Array<string> = undefined;

    endpoint:Endpoint = {
        interface: "",
        localAddress: '',
        peerAddress: '',
        deviceName: '',
        subnet:undefined,
        inputPolicerName:undefined,
        outputPolicerName:undefined,
        unit:undefined,
        siteIdentifier:undefined,
        remoteSiteIdentifier:undefined
    }

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
        this.endpoint.interface = undefined;
        this.endpoint.localAddress = undefined;
        this.endpoint.peerAddress = undefined;
        this.endpoint.deviceName = undefined;
        this.endpoint.inputPolicerName = undefined;
        this.endpoint.outputPolicerName = undefined;
        this.endpoint.neighborAddress = undefined;
        this.endpoint.unit = undefined;
        this.endpoint.subnet = undefined;
        this.endpoint.inputPolicerName = undefined;
        this.endpoint.outputPolicerName = undefined;
        this.endpoint.vlanTag = '';
        this.endpoint.innerVlanTag = '';

    }

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
                console.log(error);
            });
    }

    onSubmit() {

          try {
            let l2vpnService = this.yamlService.convertL2vpn(this.l2vpn);
            console.log(l2vpnService);
            
            this.command.cli.kwarg.file_contents = l2vpnService;
            this.command.cli.kwarg.service_name = this.l2vpn.serviceName;

            this.command.token = sessionStorage.getItem("AUTH_TOKEN");
            this.dataService.postSaltEvent(this.command).subscribe(data => {

                let result = JSON.parse(data._body);
                // this.jobId = result.return[0].jid;
                // if(this.jobId) {
                //     this.jobResultMessage = `Job Id ${this.jobId}`;
                // }
                // else {
                //     this.jobResultDump = `\n   Endpoint ${this.command.cli.tgt} not found.  Are you sure this is a valid endpoint?  \n\n`;
                // }
            });
          }
          catch(err) {
              console.log(err);
          }
          
//         console.log(finalYaml);
    }

    ngOnInit() {
        //this.interval = setInterval(() => this.connectEventBus(), 100);
        this.deviceListCommand.token = sessionStorage.getItem("AUTH_TOKEN");
        this.dataService.getManagedDevices(this.deviceListCommand)
            .map(response => response.json())
              .subscribe((ret) => {
                  if (ret['return'] != 'undefined') {
                    this.deviceList = ret['return'][0];
                  }
            });
    }

    onEndpointAdd(event) {
        this.l2vpn.endpoints.push(Object.assign({}, this.endpoint));
        this.setEnpointPristine();
    }

}
