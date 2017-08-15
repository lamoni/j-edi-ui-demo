import {Endpoint} from './Endpoint';

export interface L3VPN {
    vpnName: string;
    ebgpGroupName: string;
    endpoints:Array<Endpoint>;
    target:string;
    saltPath:string;
    serviceName:string;
    serviceId:any;
    routeTarget?:string;
}