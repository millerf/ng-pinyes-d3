import {Component, OnInit} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'ng-pynies-d3',
  template: `
    <canvas></canvas>
  `,
})
export class NgPyniesD3Component implements OnInit {
  transform;
  context;
  points;
  radius = 2.5;
  svg;
  width = 960;
  height = 500;

  constructor() {
  }

  ngOnInit() {


    // Setting two constant attributes.
    this.svg = d3.select("canvas");


    this.svg
      .attr('width', this.width)
      .attr('height', this.height);

    this.transform = d3.zoomIdentity;
    this.context = this.svg.node().getContext("2d");
    this.points = d3.range(2000).map(this.phyllotaxis(10));

    this.svg
      .call(d3.drag().subject(() => this.dragsubject()).on("drag", () => this.dragged()))
      .call(d3.zoom().scaleExtent([1 / 2, 8]).on("zoom", () => this.zoomed()))
      .call(() => this.render());


  }

  private zoomed() {
    this.transform = d3.event.transform;
    this.render();
  }

  private dragged() {
    d3.event.subject[0] = this.transform.invertX(d3.event.x);
    d3.event.subject[1] = this.transform.invertY(d3.event.y);
    this.render();
  }

  private render() {

    this.context.save();
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.beginPath();
    this.context.translate(this.transform.x, this.transform.y);
    this.context.scale(this.transform.k, this.transform.k);
    this.points.forEach((p) => this.drawPoint(p));
    this.context.fill();
    this.context.restore();
  }


  drawPoint(point) {
    this.context.moveTo(point[0] + this.radius, point[1]);
    this.context.arc(point[0], point[1], this.radius, 0, 2 * Math.PI);
  }

  private dragsubject() {
    var i,
      x = this.transform.invertX(d3.event.x),
      y = this.transform.invertY(d3.event.y),
      dx,
      dy;

    for (i = this.points.length - 1; i >= 0; --i) {
      const point = this.points[i];
      dx = x - point[0];
      dy = y - point[1];
      if (dx * dx + dy * dy < this.radius * this.radius) {
        point.x = this.transform.applyX(point[0]);
        point.y = this.transform.applyY(point[1]);
        return point;
      }
    }
  }

  phyllotaxis(radius) {
    var theta = Math.PI * (3 - Math.sqrt(5));
    return (i) => {
      var r = radius * Math.sqrt(i), a = theta * i;
      return [
        this.width / 2 + r * Math.cos(a),
        this.height / 2 + r * Math.sin(a)
      ];
    };
  }
}
