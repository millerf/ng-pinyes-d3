import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NgPinyesD3Module} from '../../projects/ng-pinyes-d3/src/lib/ng-pinyes-d3.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgPinyesD3Module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
