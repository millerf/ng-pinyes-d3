import {Component, Input, OnInit} from '@angular/core';
import * as d3 from 'd3';
import {Casteller, PinyaCastells, SectionPinya} from './pinya.model';

@Component({
  selector: 'ng-pinyes-d3',
  template: `
    <button (click)="zoomOn()"> zoom {{idRandom}}</button>
    <br/>
    <svg></svg>
  `,
})
export class NgPinyesD3Component implements OnInit {
  g;
  svg;
  width = 960;
  height = 960;
  @Input() fillColor = '#FFF';
  @Input() strokeColor = '911305';
  @Input() strokeWidth = 2;
  idRandom;
  rect_width = 100;
  rect_height = 50;
  margin = 5;
  first_margin;

  private _pinya: PinyaCastells;
  @Input()
  set pinya(pinya: PinyaCastells) {
    this._pinya = pinya;

    if (this.g) {
      console.info('updated');
      this.updatePinya();
    }
  }

  get pinya(): PinyaCastells {
    return this._pinya;
  }

  ngOnInit() {

    // Setting two constant attributes.
    this.svg = d3.select('svg');

    this.g = this.svg.append('g');

    this.svg
      .attr('width', this.width)
      .attr('height', this.height);

    this.svg.append('rect')
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .attr('width', this.width)
      .attr('height', this.height)
      .call(d3.zoom()
        .scaleExtent([0.1, 8])
        .on('zoom',
          () => this.zoom()));


    this.first_margin = this.rect_height * (this.pinya.sections.length - 1)

    this.idRandom = this.pinya.sections[1].mans[2].id;

    this.updatePinya();
  }

  private updatePinya() {

    this.g.selectAll("*").remove();

    this.pinya.sections.forEach((section, i) => {
      let group = this.g.append('g');
      this._add_point_filler(group);
      this.drawAgulla(group, section);
      this.drawBaix(group, section);
      this.drawContrefort(group, section);
      this.drawMans(group, section);
      this.drawCrosses(group, section);
      const group_vents = group.append('g');
      this._add_point_filler(group_vents);
      this.drawVents(group_vents, section);
      const group_laterals_left = group.append('g');
      this._add_point_filler(group_laterals_left);
      const group_laterals_right = group.append('g');
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
      }, 50)
    });
  }

  public zoomOn() {
    const element = d3.select('#casteller_' + this.idRandom);
    element.style('fill', 'green')
  }

  private _rad_to_deg(ang_rad: number): number {
    return ang_rad / Math.PI * 180;
  }

  private _add_point_filler(container) {
    container.style('transform-origin', 'top center');
    container.style('transform-box', 'fill-box');
    container.append('circle')
      .attr('cx', this.rect_width / 2)
      .attr('cy', 0)
      .attr('r', 1)
      .attr('stroke', '#FFF')
      .attr('fill', '#FFF');
  }

  private zoom() {
    this.g.attr('transform', d3.event.transform);
  }

  private drawAgulla(container, section: SectionPinya) {
    if (section.agulla) {
      this.drawCasteller(container,
        [section.agulla],
        0,
        this.first_margin - (this.rect_height + this.margin));
    }
  }

  private drawBaix(container, section: SectionPinya) {
    if (section.baix) {
      this.drawCasteller(container,
        [section.baix],
        0,
        this.first_margin);
    }
  }

  private drawContrefort(container, section: SectionPinya) {
    if (section.contrafort) {
      this.drawCasteller(container,
        [section.contrafort],
        0,
        (d, i) => (this.rect_height + this.margin) * (i + 1) + this.first_margin);
    }
  }

  private drawCrosses(container, section: SectionPinya) {
    if (section.crosses) {
      this.drawCasteller(container,
        [section.crosses.dreta],
        -(this.rect_height + this.margin),
        this.first_margin,
        this.rect_width,
        this.rect_height,
        true);
      this.drawCasteller(container,
        [section.crosses.esquerra],
        this.rect_width + this.margin,
        this.first_margin,
        this.rect_width,
        this.rect_height,
        true);
    }
  }

  private drawMans(container, section: SectionPinya) {

    this.drawCasteller(container,
      section.mans,
      0,
      (d, i) => (this.rect_height + this.margin) * (i + 2) + this.first_margin)
  }

  private drawVents(container, section: SectionPinya) {


    this.drawCasteller(container,
      section.vents,
      0,
      (d, i) => (this.rect_height + this.margin) * (i + 1) + this.first_margin);
  }

  private drawLaterals(container_right, container_left, section: SectionPinya) {
    if (section.laterals) {
      this.drawCasteller(container_right,
        section.laterals.dreta,
        0,
        (d, i) => (this.rect_height + this.margin) * (i + 3) + this.first_margin
      );

      this.drawCasteller(container_left,
        section.laterals.esquerra,
        0,
        (d, i) => (this.rect_height + this.margin) * (i + 3) + this.first_margin
      );
    }
  }

  private drawCasteller(container,
                        data: Casteller[],
                        x, y,
                        height: number | ((Casteller, number) => number) = this.rect_height,
                        width: number | ((Casteller, number) => number) = this.rect_width,
                        textReversed = false) {

    const groups = container.append('g').selectAll('g')
      .data(data)
      .enter()
      .append('g');
    groups.append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('width', width)
      .attr('height', height)
      .attr('id', (d: Casteller) => d ? 'casteller_' + d.id : null)
      .style('fill', this.fillColor)
      .style('stroke', this.strokeColor)
      .style('stroke-width', this.strokeWidth);


    groups.append('text')
      .attr('x', (d, i) => {
        return (typeof x == 'function' ? x(d, i) : x) +
          (typeof width == 'function' ? width(d, i) : width) / 2;
      })
      .attr('y', (d, i) => {
        return (typeof y == 'function' ? y(d, i) : y) +
          (typeof height == 'function' ? height(d, i) : height) / 2;
      })
      .attr('text-anchor', 'middle')
      .text((d: Casteller) => d.name + ' ' + d.id)
      .style('transform-origin', !textReversed ? '' : 'center center')
      .style('transform-box', !textReversed ? '' : 'fill-box');
    setTimeout(() => {
      groups.selectAll('text').style('transform', !textReversed ? '' : 'rotate(90deg)');
    });
  }
}
