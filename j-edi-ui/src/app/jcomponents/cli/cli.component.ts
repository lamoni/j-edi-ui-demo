import { Component, OnInit } from '@angular/core';

import { DataService } from '../../services/data/data.service';
import { EventBusService } from '../../services/data/event-bus.service';

import { CommonComponent } from '../common/CommonComponent';

@Component({
  selector: 'jedi-cli',
  templateUrl: './cli.component.html',
  styleUrls: ['./cli.component.css']
})
export class CliComponent implements OnInit, CommonComponent {
    data: any;

    constructor(private dataService:DataService,
                private eventBusService:EventBusService) { }

    command:any = {
        cli: {
            tgt:'',
            fun:'',
            client:'local_async',
            arg:undefined
        },
        token:''
    }

    jobId:string = undefined;
    jobResultMessage:string = undefined;
    jobResults:Array<any> = [];
    jobResultDump:string = `\n\n`;
    jobResultObject:any = undefined;

    private interval:any;
    private intervalCount:number = 0;

    ngOnInit() {
        this.interval = setInterval(() => this.connectEventBus(), 100);
    }

    private connectEventBus():void {
        if(this.eventBusService.eventbus) {
            this.eventBusService.eventbus
                    .map((response: MessageEvent): any => {
                        let data = JSON.parse(response.data);
                        return response.data;
                    })
                    .subscribe(msg => {
                        if(this.jobId && msg.indexOf(this.jobId) >= 0) {
                            let result = JSON.parse(msg);
                            if(result.data.return) {
                                this.jobResults.push(result.data);
                                if(result.data.return.message) {
                                    if(typeof result.data.return.message === "string") {
                                        this.jobResultDump = result.data.return.message;
                                    }
                                    else {
                                        this.jobResultObject = result.data.return.message;
                                    }
                                }
                                else {
                                    this.jobResultObject = result.data;
                                }
                            }
                            console.log(result.data);
                        }
                    },
                    (error) => {
                        console.error(error);
                    },
                    () => {
                        console.log('should kill the socket connection');
                    });
            clearInterval(this.interval);
        }
        else {
            this.intervalCount += 1;
            if(this.intervalCount > 100) {
              clearInterval(this.interval);
            }
            console.log('waiting to connect to eventbus');
        }
    }

    onSubmit() {
        this.jobResults = [];
        this.jobResultDump = undefined;
        this.jobResultObject = undefined;
        this.command.token = sessionStorage.getItem("AUTH_TOKEN");
        if((this.command.cli.arg != undefined) && (this.command.cli.arg.trim().length === 0)) {
            this.command.cli.arg = undefined;
        }
        this.dataService.postSaltEvent(this.command).subscribe(data => {
            let result = JSON.parse(data._body);
            this.jobId = result.return[0].jid;
            if(this.jobId) {
                this.jobResultMessage = `Job Id ${this.jobId}`;
            }
            else {
                this.jobResultDump = `\n   Endpoint ${this.command.cli.tgt} not found.  Are you sure this is a valid endpoint?  \n\n`;
            }
        });
    }
}

