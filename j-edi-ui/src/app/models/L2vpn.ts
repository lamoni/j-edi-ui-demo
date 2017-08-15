import {Endpoint} from './Endpoint';

export interface L2VPN {
    vpnName: string;
    endpoints:Array<Endpoint>;
    saltPath:string;
    serviceId:any;
    serviceName:string;
    routeTarget:string;
    routeDistinguisher:string;
    target?:string;
    vlanMagic:string;
}