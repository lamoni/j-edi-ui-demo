import { Observable, Subject, Observer } from "rxjs/Rx";
import { Injectable } from '@angular/core';

@Injectable()
export class WebSocketService {
    private subject: Subject<MessageEvent>;
    private ws = undefined;

    public connect(url): Subject<MessageEvent> {
        if(!this.subject) {
            this.subject = this.create(url);
        }

        return this.subject;
    }

    public status():number {
       return (this.ws &&  this.ws.readyState) ? this.ws.readyState : 3;
    }

    private create(url): Subject<MessageEvent> {
        this.ws = new WebSocket(url);

        let observable = Observable.create((obs: Observer<MessageEvent>) => {
            this.ws.onmessage = obs.next.bind(obs);
            this.ws.onerror = obs.error.bind(obs);
            this.ws.onclose = obs.complete.bind(obs);

            return this.ws.close.bind(this.ws);
        });

        let observer = {
            next: (data: Object) => {
                if (this.ws.readyState === WebSocket.OPEN) {
                    this.ws.send(JSON.stringify(data));
                }
            },
        };
        console.log('creating the websocket observable!');
        return Subject.create(observer, observable);
    }
}