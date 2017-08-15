import { Routes, RouterModule } from '@angular/router';
import {ServiceListComponent} from "./servicelist.component";
import {ModuleWithProviders} from "@angular/core";

export const serviceListRoutes: Routes = [
    {
        path: '',
        component: ServiceListComponent,
        data: {
            pageTitle: 'Service List'
        }
    }
];

export const serviceListRouting:ModuleWithProviders = RouterModule.forChild(serviceListRoutes);