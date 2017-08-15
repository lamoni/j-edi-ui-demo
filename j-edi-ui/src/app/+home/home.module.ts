import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { homeRouting } from './home.routing';
import {SmartadminModule} from "../shared/smartadmin.module";
import {HomeComponent} from "./home.component";
import { JcomponentsModule } from "../jcomponents/jcomponents.module";

@NgModule({
  imports: [
    CommonModule,
    homeRouting,
    SmartadminModule,
    JcomponentsModule
  ],
  exports: [],
  declarations: [HomeComponent]
})
export class HomeModule { }
