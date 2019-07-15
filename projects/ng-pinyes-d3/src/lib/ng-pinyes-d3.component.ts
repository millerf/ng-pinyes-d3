import {Component, Input, OnInit} from '@angular/core';
import * as d3 from 'd3';
import {PinyaCastells, SectionPinya} from './pinya.model';

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
  height = 960;

  rect_width = 100;
  rect_height = 50;
  margin = 5;
  first_margin;

  @Input() pinya: PinyaCastells;

  ngOnInit() {

    // Setting two constant attributes.
    this.svg = d3.select("svg");

    this.g = this.svg.append("g");

    this.svg
      .attr('width', this.width)
      .attr('height', this.height);

    this.svg
      .append("line")
      .attr('stroke', 'red')
      .attr('x1', 0)
      .attr('y1', this.height / 2)
      .attr('x2', this.width)
      .attr('y2', this.height / 2);


    this.svg
      .append("line")
      .attr('stroke', 'red')
      .attr('x1', this.width / 2)
      .attr('y1', 0)
      .attr('x2', this.width / 2)
      .attr('y2', this.height);

    this.svg.append("rect")
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .attr("width", this.width)
      .attr("height", this.height)
      .call(d3.zoom()
        .scaleExtent([0, 8])
        .on("zoom",
          () => this.zoom()));


    this.first_margin = this.rect_height  *(this.pinya.sections.length -1)

    this.pinya.sections.forEach((section, i) => {
      let group = this.g.append("g");
      this._add_point_filler(group);
      this.drawBaix(group, section);
      this.drawAgulla(group, section);
      this.drawMans(group, section);
      this.drawCrosses(group, section);
      const group_vents = group.append("g");
      this._add_point_filler(group_vents);
      this.drawVents(group_vents, section);
      const group_laterals_left = group.append("g");
      this._add_point_filler(group_laterals_left);
      const group_laterals_right = group.append("g");
      this._add_point_filler(group_laterals_right);
      this.drawLaterals(group_laterals_right, group_laterals_left, section);

      setTimeout(() => {
        const angle = (2 * Math.PI / this.pinya.sections.length) * i;
        const angle_vents = 2 * Math.PI / (this.pinya.sections.length * 2);
        const angle_laterals = 2 * Math.PI / (this.pinya.sections.length * 4);
        group.style('transform', 'translate(' + (this.width / 2 - this.rect_width / 2) + 'px, ' + (this.height / 2) + 'px) rotate(' + this._rad_to_deg(angle) + 'deg)');
        group_vents.style('transform', 'rotate(' + this._rad_to_deg(angle_vents) + 'deg)');
        group_laterals_right.style('transform', 'rotate(' + this._rad_to_deg(angle_laterals) + 'deg)');
        group_laterals_left.style('transform', 'rotate(' + -1 * this._rad_to_deg(angle_laterals) + 'deg)');
      })


    });


  }

  private _rad_to_deg(ang_rad: number): number {
    return ang_rad / Math.PI * 180;
  }

  private _add_point_filler(container) {
    container.style('transform-origin', 'top center');
    container.style('transform-box', 'fill-box');
    container.append('circle')
      .attr('cx', this.rect_width/2)
      .attr('cy', 0)
      .attr("r", 1)
      .attr('stroke', '#FFF')
      .attr('fill', '#FFF');
  }
  private zoom() {
    this.g.attr("transform", d3.event.transform);
  }

  private drawAgulla(container, section: SectionPinya) {
    this.drawRectangle(container.append('rect')
      .datum(section.agulla), 0, this.first_margin)

  }

  private drawBaix(container, section: SectionPinya) {
    this.drawRectangle(container.append('rect')
      .attr('fill', 'cyan')
      .datum(section.baix), 0, this.first_margin - (this.rect_height + this. margin))

  }

  private drawCrosses(container, section: SectionPinya) {
    if (section.crosses) {
      this.drawRectangle(container.append('rect')
        .attr('fill', 'blue')
        .datum(section.crosses.dreta), -(this.rect_height + this.margin), this.first_margin, this.rect_width, this.rect_height);
      this.drawRectangle(container.append('rect')
        .attr('fill', 'blue')
        .datum(section.crosses.esquerra), this.rect_width + this.margin, this.first_margin, this.rect_width, this.rect_height);
    }
  }

  private drawMans(container, section: SectionPinya) {
    section.mans.forEach((m, i) => {
      this.drawRectangle(container.append('rect')
        .attr('fill', 'green')
        .datum(m), 0, (this.rect_height + this.margin) * (i + 1)+ this.first_margin)
    });
  }

  private drawVents(container, section: SectionPinya) {
    section.vents.forEach((m, i) => {
      this.drawRectangle(container.append('rect')
        .attr('fill', 'yellow')
        .datum(m), 0, (this.rect_height + this.margin) * (i + 1)+ this.first_margin)
    });
  }

  private drawLaterals(container_right, container_left, section: SectionPinya) {
    if (section.laterals) {
      section.laterals.dreta.forEach((m, i) => {
        this.drawRectangle(container_right.append('rect')
          .attr('fill', 'purple')
          .datum(m), 0, (this.rect_height + this.margin) * (i + 3) + this.first_margin)
      });
      section.laterals.esquerra.forEach((m, i) => {
        this.drawRectangle(container_left.append('rect')
          .attr('fill', 'purple')
          .datum(m), 0, (this.rect_height + this.margin) * (i + 3) + this.first_margin)
      });
    }
  }

  private drawRectangle(rect, x, y, height=this.rect_height, width=this.rect_width) {
    return rect
      .attr("x", x)
      .attr("y", y)
      .attr("width", width)
      .attr("height", height);
  }
}