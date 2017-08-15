import {ModuleWithProviders} from "@angular/core"
import {Routes, RouterModule} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'cli'
  },
  {
    path: 'cli',
    loadChildren: './+cli/cli-view.module#CliViewModule'
  },
  {
    path: 'l3vpn',
    loadChildren: './+l3vpn/l3vpn.module#L3vpnModule'
  },
  {
    path: 'interface',
    loadChildren: './+interface/interface.module#InterfaceModule'
  },
  {
    path: 'l2vpn',
    loadChildren: './+l2vpn/l2vpn.module#L2vpnModule'
  },
  {
    path: 'evpn',
    loadChildren: './+evpn/evpn.module#EvpnModule'
  },
  {
    path: 'ec',
    loadChildren: './+ec/ec.module#EcModule'
  },
  {
    path: 'infra',
    loadChildren: './+infra/infra.module#InfraModule'
  },
];

export const routing = RouterModule.forChild(routes);