import { Component, OnInit, ViewChild } from '@angular/core';


import { FadeInTop } from "../shared/animations/fade-in-top.decorator";

import { DataService } from '../services/data/data.service';


//Here is your access to jquery
declare var $: any;

@FadeInTop()
@Component({
    selector: 'app-service-list',
    templateUrl: './servicelist.component.html'
})
export class ServiceListComponent implements OnInit {

    constructor(private dataService: DataService) {}

    services:any = undefined;
    serviceDetails:any = [];
    serviceDetailName:any = "";

    ngOnInit() {

        var cmd = {
            cli: {
                'fun':'orchestration.list_instances',
                'client':'runner',
                'arg':undefined
            },
            token: sessionStorage.getItem("AUTH_TOKEN")
        }

        this.dataService.postSaltEvent(cmd)
            .map(response => response.json())
            .subscribe(val =>
                this.services = val['return'][0]
            );
     }

     deleteService(serviceName) {

         var cmd = {
             cli: {
                 'fun':'orchestration.delete_instance',
                 'client':'runner',
                 'arg':serviceName
             },
             token: sessionStorage.getItem("AUTH_TOKEN")
         }

         this.dataService.postSaltEvent(cmd)
             .map(response => response.json())
             .subscribe(val => {
                console.log(val);
             });
     }

     getServiceDetails(serviceName) {
        this.serviceDetailName = serviceName;

         var cmd = {
             cli: {
                 'fun':'orchestration.get_instance',
                 'client':'runner',
                 'arg':serviceName
             },
             token: sessionStorage.getItem("AUTH_TOKEN")
         }

         this.dataService.postSaltEvent(cmd)
             .map(response => response.json())
             .subscribe(val =>
                 {
                     this.serviceDetails = [];

                     var tempType = "";

                     for (var i in val['return'][0]) {
                         if(i.includes('load')) {
                             var tempDeviceName = val['return'][0][i]['salt.function'][1]['tgt'];

                             tempType = val['return'][0][i]['salt.function'][4]['arg'][0];

                             var tempDevice = {
                                 'deviceName': tempDeviceName,
                                 'template_vars': val['return'][0][i]['salt.function'][3]['kwarg']['template_vars'],

                             };

                             this.serviceDetails.push(tempDevice);
                             console.log(tempType);

                         }
                     }

                     if (tempType.includes('l3vpn')) {
                         $('#L3VPN_serviceDetailsModal').modal();

                     }
                     else if (tempType.includes('l2vpn')) {
                         $('#L2VPN_serviceDetailsModal').modal();
                     }

                 }
             );

     }
}