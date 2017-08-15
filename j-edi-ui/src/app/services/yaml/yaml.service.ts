import { Injectable } from '@angular/core';

import * as YAML from 'yamljs';
import { L3VPN, L2VPN, Endpoint, NetworkService, ServiceArg } from '../../models/models';

@Injectable()
export class YamlService {

    constructor() { }

    createNetworkService(networkService:NetworkService, yamlName:string):any {
        let serviceStub = {
                    [yamlName]:{
                        "salt.function": [
                            {"name":networkService.functionName},
                            {"tgt":networkService.target},
                            {"expect_minions":networkService.expectMinions}
                        ]
                    }
        };

        if(networkService.arguments && networkService.arguments.length > 0) {
            let kwarg = '{"kwarg":{"template_vars":{';
            for(let arg of networkService.arguments) {
                kwarg += '"' + arg.name + '":"' + arg.value + '",';
            }
            
            kwarg = kwarg.substr(0, (kwarg.length - 1)) + "}}}";
            let kwargResult = JSON.parse(kwarg);
            serviceStub[yamlName]['salt.function'].push(kwargResult);
        }
    
        if(networkService.saltPath != undefined) {
            let templateUrl:any = {"arg": [networkService.saltPath]};
            serviceStub[yamlName]['salt.function'].push(templateUrl);
        }

        if(networkService.failFunction) {
            let failFunction:any = {"fail_function":networkService.failFunction};
            serviceStub[yamlName]['salt.function'].push(failFunction);
        }

        return serviceStub;
    }

    createNetworkServices(serviceChecks:Array<NetworkService>, serviceLoads:Array<NetworkService>, serviceCommitChecks:Array<NetworkService>, serviceUnlock:Array<NetworkService>, serviceCommits:Array<NetworkService>, serviceRollbacks:Array<NetworkService>):Map<string,NetworkService> {
        let networkServices = new Map<string, NetworkService>();

        let requireName = undefined;
        for(let service of serviceChecks) {
            if(requireName) {
                let require:any = {"require":[{"salt":requireName}]};
                service[Object.keys(service)[0]]['salt.function'].push(require);
            }
            requireName = Object.keys(service)[0];
            networkServices.set(requireName, service);
        }

        for(let service of serviceLoads) {
            if(requireName) {
                let require:any = {"require":[{"salt":requireName}]};
                service[Object.keys(service)[0]]['salt.function'].push(require);
            }
            requireName = Object.keys(service)[0];
            networkServices.set(requireName, service);
        }

        for(let service of serviceCommitChecks) {
            if(requireName) {
                let require:any = {"require":[{"salt":requireName}]};
                service[Object.keys(service)[0]]['salt.function'].push(require);
            }
            requireName = Object.keys(service)[0];
            networkServices.set(requireName, service);
        }

        for(let service of serviceCommits) {
            if(requireName) {
                let require:any = {"require":[{"salt":requireName}]};
                service[Object.keys(service)[0]]['salt.function'].push(require);
            }
            requireName = Object.keys(service)[0];
            networkServices.set(requireName, service);           
        }

        for(let service of serviceUnlock) {
            // if(requireName) {
            //     let require:any = {"require":[{"salt":requireName}]};
            //     service[Object.keys(service)[0]]['salt.function'].push(require);
            // }

            let last:any = {"order":"last"};
            service[Object.keys(service)[0]]['salt.function'].push(last);

            requireName = Object.keys(service)[0];
            networkServices.set(requireName, service);
        }

        let rollbackFunctions = Array.from(networkServices.keys());
        let onFailFunctions:Array<string> = [];

        for(let rollback of rollbackFunctions) {
            if(rollback.indexOf('lock', 0) < 0) {
                onFailFunctions.push(rollback);
            }
        }
        for(let rollbackService of serviceRollbacks) {
            let serviceName = Object.keys(rollbackService)[0];
            
            let onFail:any = {"onfail":onFailFunctions};
            rollbackService[serviceName]['salt.function'].push(onFail);

            networkServices.set(serviceName, rollbackService);           
        }

        return networkServices;
    }

    convertL2vpn(l2vpn:L2VPN): string {
        let serviceCount = 1;

        let serviceChecks:Array<NetworkService> = [];
        let serviceCommits:Array<NetworkService> = [];
        let serviceRollbacks:Array<NetworkService> = [];
        let serviceLoads:Array<NetworkService> = [];
        let serviceCommitChecks:Array<NetworkService> = [];
        let serviceUnlock:Array<NetworkService> = [];

        let networkServices = new Map<string, NetworkService>();

        let networkService:NetworkService = {
            expectMinions:true,
            saltPath:undefined,
            failFunction:"jnpr_orchestration.verify_return",
            functionName:"junos.lock",
            serviceName:'lock',
            target: l2vpn.target,
            arguments: []
        };

        let loadService:NetworkService = {
            expectMinions:true,
            saltPath:l2vpn.saltPath,
            failFunction:"jnpr_orchestration.verify_return",
            functionName:"junos.load",
            serviceName:'load',
            target: l2vpn.target,
            arguments: []
        };

        let commitCheckService:NetworkService = {
            expectMinions:true,
            saltPath:undefined,
            failFunction:"jnpr_orchestration.verify_return",
            functionName:"junos.commit_check",
            serviceName:'check',
            target: l2vpn.target,
            arguments: []           
        }

        let commitService:NetworkService = {
            expectMinions:true,
            failFunction:"jnpr_orchestration.verify_return",
            functionName:"junos.commit",
            serviceName:'commit',
            target: l2vpn.target,
            arguments:[]        
        };

        let unlockService:NetworkService = {
            expectMinions:true,
            failFunction:"jnpr_orchestration.verify_return",
            functionName:"junos.unlock",
            serviceName:'unlock',
            target: l2vpn.target,
            arguments:[]        
        };

        let rollbackService:NetworkService = {
            expectMinions:true,
            failFunction:undefined,
            functionName:"junos.rollback",
            serviceName:'rollback',
            target: l2vpn.target,
            saltPath:0,
            arguments: []         
        }

        for(let endpoint of l2vpn.endpoints) {
            let yamlName = `lock_${serviceCount}`;
            networkService.target = endpoint.deviceName;
            serviceChecks.push(this.createNetworkService(networkService, yamlName));

            let loadYamlName = `load_${serviceCount}`;
            loadService.target = endpoint.deviceName;
            loadService.arguments.push({name:'instance_name', value:l2vpn.serviceName});
            loadService.arguments.push({name:'interface_name', value:endpoint.interface});
            loadService.arguments.push({name:'serviceId', value:l2vpn.serviceId});
            loadService.arguments.push({name:'siteIdentifier', value:endpoint.siteIdentifier});
            loadService.arguments.push({name:'remoteSiteIdentifier', value:endpoint.remoteSiteIdentifier});
            loadService.arguments.push({name:'routeTarget', value:l2vpn.routeTarget});
            loadService.arguments.push({name:'routeDistinguisher', value:endpoint.routeDistinguisher});
            loadService.arguments.push({name:'inputPolicerName', value:endpoint.inputPolicerName});
            loadService.arguments.push({name:'outputPolicerName', value:endpoint.outputPolicerName});
            loadService.arguments.push({name:'vlanTag', value:endpoint.vlanTag});
            loadService.arguments.push({name:'innerVlanTag', value:endpoint.innerVlanTag});
            loadService.arguments.push({name:'vlanMagic', value:l2vpn.vlanMagic});
            loadService.arguments.push({name:'unit', value:endpoint.unit});
            serviceLoads.push(this.createNetworkService(loadService, loadYamlName));

            let commitCheckYamlName = `check_${serviceCount}`;
            commitCheckService.target = endpoint.deviceName;
            serviceCommitChecks.push(this.createNetworkService(commitCheckService, commitCheckYamlName));

            let commitYamlName = `commit_${serviceCount}`;
            commitService.target = endpoint.deviceName;
            serviceCommits.push(this.createNetworkService(commitService, commitYamlName));

            let unlockYamlName = `unlock_${serviceCount}`;
            unlockService.target = endpoint.deviceName;
            serviceUnlock.push(this.createNetworkService(unlockService, unlockYamlName));
            
            let rollbackYamlName = `rollback_${serviceCount}`;
            rollbackService.target = endpoint.deviceName;
            serviceRollbacks.push(this.createNetworkService(rollbackService, rollbackYamlName));

            networkService.arguments = [];
            serviceCount++;
        }

        let nss = this.createNetworkServices(serviceChecks, serviceLoads, serviceCommitChecks, serviceUnlock, serviceCommits, serviceRollbacks);
        let simpleData = Array.from(nss.values());

        return this.createFinalYaml(simpleData);
    }

    convertL3vpn(l3vpn:L3VPN):string {
        let serviceCount = 1;

        let serviceChecks:Array<NetworkService> = [];
        let serviceCommits:Array<NetworkService> = [];
        let serviceRollbacks:Array<NetworkService> = [];
        let serviceLoads:Array<NetworkService> = [];
        let serviceCommitChecks:Array<NetworkService> = [];
        let serviceUnlock:Array<NetworkService> = [];

        let networkServices = new Map<string, NetworkService>();

        let networkService:NetworkService = {
            expectMinions:true,
            saltPath:undefined,
            failFunction:"jnpr_orchestration.verify_return",
            functionName:"junos.lock",
            serviceName:'lock',
            target: l3vpn.target,
            arguments: []
        };

        let loadService:NetworkService = {
            expectMinions:true,
            saltPath:l3vpn.saltPath,
            failFunction:"jnpr_orchestration.verify_return",
            functionName:"junos.load",
            serviceName:'load',
            target: l3vpn.target,
            arguments: []
        };

        let commitCheckService:NetworkService = {
            expectMinions:true,
            saltPath:undefined,
            failFunction:"jnpr_orchestration.verify_return",
            functionName:"junos.commit_check",
            serviceName:'check',
            target: l3vpn.target,
            arguments: []           
        }

        let commitService:NetworkService = {
            expectMinions:true,
            failFunction:"jnpr_orchestration.verify_return",
            functionName:"junos.commit",
            serviceName:'commit',
            target: l3vpn.target,
            arguments:[]        
        };

        let unlockService:NetworkService = {
            expectMinions:true,
            failFunction:"jnpr_orchestration.verify_return",
            functionName:"junos.unlock",
            serviceName:'unlock',
            target: l3vpn.target,
            arguments:[]        
        };

        let rollbackService:NetworkService = {
            expectMinions:true,
            failFunction:undefined,
            functionName:"junos.rollback",
            serviceName:'rollback',
            target: l3vpn.target,
            saltPath:0,
            arguments: []         
        }

        for(let endpoint of l3vpn.endpoints) {
            let yamlName = `lock_${serviceCount}`;
            networkService.target = endpoint.deviceName;
            serviceChecks.push(this.createNetworkService(networkService, yamlName));

            let loadYamlName = `load_${serviceCount}`;
            loadService.target = endpoint.deviceName;
            loadService.arguments.push({name:'instance_name', value:l3vpn.serviceName});
            loadService.arguments.push({name:'interface_name', value:endpoint.interface});
            loadService.arguments.push({name:'serviceId', value:l3vpn.serviceId});
            loadService.arguments.push({name:'unit', value:endpoint.unit});
            loadService.arguments.push({name:'routeTarget', value:l3vpn.routeTarget});
            loadService.arguments.push({name:'routeDistinguisher', value:endpoint.routeDistinguisher});
            loadService.arguments.push({name:'localAddress', value:endpoint.localAddress});
            loadService.arguments.push({name:'subnet', value:endpoint.subnet});
            loadService.arguments.push({name:'peerAddress', value:endpoint.peerAddress});
            loadService.arguments.push({name:'localAddress', value:endpoint.localAddress});
            loadService.arguments.push({name:'neighborAddress', value:endpoint.neighborAddress});
            loadService.arguments.push({name:'inputPolicerName', value:endpoint.inputPolicerName});
            loadService.arguments.push({name:'outputPolicerName', value:endpoint.outputPolicerName});
            loadService.arguments.push({name:'vlanTag', value:endpoint.vlanTag});
            loadService.arguments.push({name:'innerVlanTag', value:endpoint.innerVlanTag});
            loadService.arguments.push({name:'target', value:l3vpn.target});
            serviceLoads.push(this.createNetworkService(loadService, loadYamlName));

            let commitCheckYamlName = `check_${serviceCount}`;
            commitCheckService.target = endpoint.deviceName;
            serviceCommitChecks.push(this.createNetworkService(commitCheckService, commitCheckYamlName));

            let commitYamlName = `commit_${serviceCount}`;
            commitService.target = endpoint.deviceName;
            serviceCommits.push(this.createNetworkService(commitService, commitYamlName));

            let unlockYamlName = `unlock_${serviceCount}`;
            unlockService.target = endpoint.deviceName;
            serviceUnlock.push(this.createNetworkService(unlockService, unlockYamlName));
            
            let rollbackYamlName = `rollback_${serviceCount}`;
            rollbackService.target = endpoint.deviceName;
            serviceRollbacks.push(this.createNetworkService(rollbackService, rollbackYamlName));

            networkService.arguments = [];
            serviceCount++;
        }

        let nss = this.createNetworkServices(serviceChecks, serviceLoads, serviceCommitChecks, serviceUnlock, serviceCommits, serviceRollbacks);
        let simpleData = Array.from(nss.values());

        return this.createFinalYaml(simpleData);
    }

    createFinalYaml(networkServices:Array<NetworkService>) {
        let finalYaml = '';
        for(let dat of networkServices) {
            finalYaml += YAML.stringify(dat);
        }
        
        return finalYaml;
    }

}
