import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import { EventBusService } from '../../../services/data/event-bus.service';

declare var $: any;

@Component({
  selector: 'sa-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private eventbus: EventBusService) {}

  searchMobileActive = false;

  color:string = 'yellow';
  title:string = 'connecting';

  ngOnInit() {
      setInterval(() => {
          switch(this.eventbus.status()) {
            case 0:
              this.color = 'yellow';
              this.title = 'connecting';
              break;
            case 1:
              this.color = 'blue';
              this.title = 'connected';
              break;
            default:
              this.color = "red";
              this.title = 'disconnected';
              break;
          }
      }, 500);
  }

  toggleSearchMobile() {
    this.searchMobileActive = !this.searchMobileActive;

    $('body').toggleClass('search-mobile', this.searchMobileActive);
  }

  onSubmit() {
    this.router.navigate(['/miscellaneous/search']);
  }
}