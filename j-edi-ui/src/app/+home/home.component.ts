import { Type } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { JediContainerComponent } from '../jcomponents/widget-container/jedi-container.component';
import { CloudMeshComponent } from '../jcomponents/cloud-mesh/cloud-mesh.component';
import { JediComponent } from "app/jcomponents/common/JediComponent";
import { CliComponent } from "../jcomponents/cli/cli.component";
import { DataService } from "app/services/data/data.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    @ViewChild(JediContainerComponent) jediContainer: JediContainerComponent;

    constructor(private dataService:DataService) {}

    addGraph() {
        let jediComponent: JediComponent = new JediComponent(CloudMeshComponent, null);
        this.jediContainer.addComponent(jediComponent);
        this.jediContainer.updateWidgetGridSystem();
    }

    addForm() {
        let cliComponent: JediComponent = new JediComponent(CliComponent, null);
        this.jediContainer.addComponent(cliComponent);
        this.jediContainer.updateWidgetGridSystem();
    }

    ngOnInit() {
        let data = {
            key:'sample-value',
            data: JSON.stringify({name:'this is a new key'})
        };

        this.dataService.postKeyValue(data)
            .map(response => response.json())
            .subscribe((message) => {
                console.log(message);
        });

        this.dataService.getKeyValue(data.key)
            .map(response => response.json())
            .subscribe((message) => {
                console.log(message);
        });

        // this.dataService.deleteKeyValue(data.key)
        //     .map(response => response.json())
        //     .subscribe((message) => {
        //         console.log(message);
        // });
    }
}