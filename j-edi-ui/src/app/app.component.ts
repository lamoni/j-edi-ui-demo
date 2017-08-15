import {Component, OnInit, ViewContainerRef} from '@angular/core';

import { WebSocketService } from './services/data/websocket.service';
import { DataService } from './services/data/data.service';
import { EventBusService } from './services/data/event-bus.service';

import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  providers: [DataService, WebSocketService, EventBusService]
})
export class AppComponent {
    public title = 'app works!';

    public constructor(private viewContainerRef: ViewContainerRef, private dataService:DataService, private eventBusService:EventBusService) {}

    credentials = {
        username: environment.saltCredentials.username,
        password: environment.saltCredentials.password,
        eauth: environment.saltCredentials.eauth
    };

    loginResponse = undefined;

    ngOnInit() {
        this.dataService.loginSaltEDI(this.credentials).subscribe(data => {
            let response = JSON.parse(data._body);
            this.loginResponse = `Auth Token: ${response.token}`;
            sessionStorage.setItem("AUTH_TOKEN", response.token);
            //this.dataService.authToken = response.token;

            /*************************************************************************************/
            // This is how you call a websocket client using observables
            /*************************************************************************************/
            console.log('creating connection to websocket in app.module');
            this.eventBusService.create(response.token);
            // console.log(this.eventBusService.status());


            // setInterval(() => {
            //     console.log(this.eventBusService.status());
            // }, 2000);
                // .map((response: MessageEvent): any => {
                //     let data = JSON.parse(response.data);
                //     return response.data;
                // })
                // .subscribe(msg => {
                //     console.log(msg);
                //     // this.series1.push(msg);
                //     // this.labelCount += 1;
                //     // this.lineChartData = this.series1;
                //     // this.plot.push(this.labelCount.toString());
                //     // this.lineChartLabels = this.plot;
                // });
            /*************************************************************************************/
      });
  }

}
