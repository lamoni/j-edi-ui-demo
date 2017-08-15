import { ServiceArg } from './ServiceArg';

export interface NetworkService {
    arguments:Array<ServiceArg>
    serviceName:string,
    target:string,
    saltPath?:any,
    failFunction?:string,
    expectMinions:boolean,
    require?:any,
    onFail?:any,
    functionName:string,
    lock?:boolean,
    unlock?:boolean
};