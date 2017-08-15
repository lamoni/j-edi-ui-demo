import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataService } from './data/data.service';
import { EventBusService } from './data/event-bus.service';
import { WebSocketService } from './data/websocket.service';
import { YamlService } from './yaml/yaml.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers:[DataService, WebSocketService, EventBusService,YamlService]
})
export class ServicesModule { 
  constructor( @Optional() @SkipSelf() parentModule: ServicesModule) {}
}
