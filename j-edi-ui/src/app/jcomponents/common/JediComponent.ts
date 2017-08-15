import { Type } from '@angular/core';
import { CommonComponent } from './CommonComponent';

export class JediComponent {
  constructor(public component: Type<CommonComponent>, public data: any) {}
}