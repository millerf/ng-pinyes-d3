import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NgPyniesD3Module} from '../../projects/ng-pynies-d3/src/lib/ng-pynies-d3.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgPyniesD3Module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
