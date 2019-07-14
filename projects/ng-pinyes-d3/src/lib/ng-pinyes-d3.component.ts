import {Component, Input, OnInit} from '@angular/core';
import * as d3 from 'd3';
import {PinyaCastells} from './pinya.model';

@Component({
  selector: 'ng-pinyes-d3',
  template: `
    <svg></svg>
  `,
})
export class NgPinyesD3Component implements OnInit {
  g;
  svg;
  width = 960;
  height = 500;

  @Input() pinya: PinyaCastells;

  ngOnInit() {

    // Setting two constant attributes.
    this.svg = d3.select("svg");

    this.g = this.svg.append("g");

    this.svg
      .attr('width', this.width)
      .attr('height', this.height);

    this.svg.append("rect")
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .attr("width", this.width)
      .attr("height", this.height)
      .call(d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom",
          () => this.zoom()))
  }

  private zoom() {
    this.g.attr("transform", d3.event.transform);
  }

}
