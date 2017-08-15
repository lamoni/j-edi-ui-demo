import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data/data.service';
import { EventBusService } from '../../services/data/event-bus.service';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";

import { CliComponent } from '../../jcomponents/cli/cli.component';

@FadeInTop()
@Component({
  selector: 'app-cli',
  templateUrl: './cli-view.component.html'
})
export class CliViewComponent {


}
