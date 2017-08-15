import { Component, Input, AfterViewInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, OnDestroy, ElementRef } from '@angular/core';

// import { WidgetComponent } from '../shared/widgets/widget/widget.component';
// import { WgtComponent } from './wgt.component';
// import { WidgetDirective } from './widget.directive';

import jarvisWidgetsDefaults from  '../../shared/widgets/widget.defaults';
import 'smartadmin-plugins/smartwidgets/jarvis.widget.ng2.js';

import { CommonComponent } from '../common/CommonComponent';
import { JediComponent } from '../common/JediComponent';

declare var $: any;

@Component({
  selector: 'jedi-wdgt-cntnr',
  template: `
             <ng-template #target></ng-template>
  `
})
export class JediContainerComponent implements AfterViewInit, OnDestroy {
    @Input() widgets: CommonComponent[];
    @Input() colorbutton:any;
    @ViewChild('target', {read:ViewContainerRef}) widgeHost: ViewContainerRef;

    constructor(private componentFactoryResolver: ComponentFactoryResolver, public el: ElementRef) { }

    ngAfterViewInit() {
        this.colorbutton = true;
        //this.loadComponents();
    }

    ngOnDestroy() {
        
    }

    public addComponent(jediComponent:JediComponent) {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(jediComponent.component);
        let componentRef = this.widgeHost.createComponent(componentFactory);
        (<JediComponent>componentRef.instance).data = jediComponent.data;     
    }

    public updateWidgetGridSystem() {
        // let saGrid = $('sa-widgets-grid')[0];
        $('#widgets-grid').jarvisWidgets(jarvisWidgetsDefaults);
    }
}