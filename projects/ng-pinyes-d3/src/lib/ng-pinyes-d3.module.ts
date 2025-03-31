import { NgModule } from '@angular/core';
import { NgPinyesD3Component } from './ng-pinyes-d3.component';
import { ComponentNameComponent } from './component-name/component-name.component';



@NgModule({
  declarations: [NgPinyesD3Component, ComponentNameComponent],
  imports: [
  ],
  exports: [NgPinyesD3Component]
})
export class NgPinyesD3Module { }
