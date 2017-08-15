import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable, Subject } from "rxjs/Rx";
import { environment } from '../../../environments/environment';

import { WebSocketService } from './websocket.service';


@Injectable()
export class EventBusService {
    
    public eventbus: Subject<MessageEvent>;

    constructor(private websocket:WebSocketService) {}

    public create(authToken:string):void {
        console.log('creating the websocket in the EventBusService');
        this.eventbus = this.websocket.connect(environment.websocketUrl + authToken);
    }

    public status():number {
        return this.websocket.status();
    }

    

}