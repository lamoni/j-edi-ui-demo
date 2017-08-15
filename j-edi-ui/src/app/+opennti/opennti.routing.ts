import { Routes, RouterModule } from '@angular/router';
import {OpenNtiComponent} from "./opennti.component";
import {ModuleWithProviders} from "@angular/core";

export const openNtiRoutes: Routes = [
    {
        path: '',
        component: OpenNtiComponent,
        data: {
            pageTitle: 'Open NTI'
        }
    }
];

export const openNtiRouting:ModuleWithProviders = RouterModule.forChild(openNtiRoutes);