import {Component, Input, OnInit} from '@angular/core';
import * as d3 from 'd3';
import {Casteller, PinyaCastells, SectionPinya} from './pinya.model';
import {resolveTxt} from 'dns';

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
  @Input() borderCurve = 5;
  idRandom;
  firsDraw = true;
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
    if (this.firsDraw) {
      this.pinya.sections.forEach((section, i) => {
        let group = this.g.append('g').attr('id', 'main'+i);
        this._add_point_filler(group);
        this.drawAgulla(group, i);
        this.drawBaix(group, i);
        this.drawContrefort(group, i);
        this.drawMans(group, i);
        this.drawCrosses(group, i);
        const group_vents = group.append('g').attr('id','vents'+i);
        this._add_point_filler(group_vents);
        this.drawVents(group_vents, i);
        const group_laterals_left = group.append('g').attr('id', 'lateralsleft'+i);
        this._add_point_filler(group_laterals_left);
        const group_laterals_right = group.append('g').attr('id', 'lateralsright'+i);
        this._add_point_filler(group_laterals_right);
        this.drawLaterals(group_laterals_right, group_laterals_left, i);
        this.firsDraw = false;
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
    } else {
      this.pinya.sections.forEach((section, i) => {
        let group = this.g.select('g#main'+i);
        let group_vents = this.g.select('g#vents'+i);
        let group_laterals_right = this.g.select('g#lateralsright'+i);
        let group_laterals_left = this.g.select('g#lateralsleft'+i);
        this.drawAgulla(group, i);
        this.drawBaix(group, i);
        this.drawContrefort(group, i);
        this.drawMans(group, i);
        this.drawCrosses(group, i);
        this.drawVents(group_vents, i);
        this.drawLaterals(group_laterals_right, group_laterals_left, i);
      });
    }
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

  private drawAgulla(container, index: number) {
    const section = this.pinya.sections[index];
    if (section.agulla) {
      this.drawCasteller('agualla' + index,
        container,
        [section.agulla],
        0,
        this.first_margin - (this.rect_height + this.margin));
    }
  }

  private drawBaix(container, index: number) {
    const section = this.pinya.sections[index];
    if (section.baix) {
      this.drawCasteller('baix' + index,
        container,
        [section.baix],
        0,
        this.first_margin);
    }
  }

  private drawContrefort(container, index: number) {
    const section = this.pinya.sections[index];
    if (section.contrafort) {
      this.drawCasteller('contrafort' + index,
        container,
        [section.contrafort],
        0,
        (d, i) => (this.rect_height + this.margin) * (i + 1) + this.first_margin);
    }
  }

  private drawCrosses(container, index: number) {
    const section = this.pinya.sections[index];
    if (section.crosses) {
      this.drawCasteller('cossesdreta' + index,
        container,
        [section.crosses.dreta],
        -(this.rect_height + this.margin),
        this.first_margin,
        this.rect_width,
        this.rect_height,
        true);
      this.drawCasteller('cossesesquerra' + index,
        container,
        [section.crosses.esquerra],
        this.rect_width + this.margin,
        this.first_margin,
        this.rect_width,
        this.rect_height,
        true);
    }
  }

  private drawMans(container, index: number) {
    const section = this.pinya.sections[index];

    this.drawCasteller('mans' + index,
      container,
      section.mans,
      0,
      (d, i) => (this.rect_height + this.margin) * (i + 2) + this.first_margin)
  }

  private drawVents(container, index: number) {

    const section = this.pinya.sections[index];

    this.drawCasteller('vents' + index,
      container,
      section.vents,
      0,
      (d, i) => (this.rect_height + this.margin) * (i + 1) + this.first_margin);
  }

  private drawLaterals(container_right, container_left, index: number) {
    const section = this.pinya.sections[index];
    if (section.laterals) {
      this.drawCasteller('lateralsdreta' + index,
        container_right,
        section.laterals.dreta,
        0,
        (d, i) => (this.rect_height + this.margin) * (i + 3) + this.first_margin
      );

      this.drawCasteller('lateralsesquerra' + index,
        container_left,
        section.laterals.esquerra,
        0,
        (d, i) => (this.rect_height + this.margin) * (i + 3) + this.first_margin
      );
    }
  }

  private drawCasteller(unique_selector,
                        container,
                        data: Casteller[],
                        x: number | ((Casteller, number) => number),
                        y: number | ((Casteller, number) => number),
                        height: number | ((Casteller, number) => number) = this.rect_height,
                        width: number | ((Casteller, number) => number) = this.rect_width,
                        textReversed = false) {

    let groups = container.select('g#' + unique_selector);
    console.info(groups.empty())
    if (groups.empty()) {
      groups = container.append('g').attr('id', unique_selector);
    }

    const rectangles = groups.selectAll('rect')
      .data(data)

    //Remove old
    rectangles.exit().remove()

    // Update exiting
    rectangles.attr('id', (d: Casteller) => d ? 'casteller_' + d.id : null)

    // Create new
    rectangles.enter()
      .append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('rx', this.borderCurve)
      .attr('ry', this.borderCurve)
      .attr('width', width)
      .attr('height', height)
      .attr('id', (d: Casteller) => d ? 'casteller_' + d.id : null)
      .style('fill', this.fillColor)
      .style('stroke', this.strokeColor)
      .style('stroke-width', this.strokeWidth);


    const texts = groups.selectAll('text')
      .data(data);

    //Remove old
    texts.exit().remove();

    // Update exiting
    texts.text((d: Casteller) => {console.info(d);return d.name + ' ' + d.id;})

    // Create new
    texts
      .enter()
      .append('text')
      .attr('x', (d, i) => {
        return (typeof x == 'function' ? x(d, i) : x) +
          (typeof width == 'function' ? width(d, i) : width) / 2;
      })
      .attr('y', (d, i) => {
        return (typeof y == 'function' ? y(d, i) : y) +
          (typeof height == 'function' ? height(d, i) : height) / 2;
      })
      .attr('text-anchor', 'middle')
      .text((d: Casteller) => {console.info(d);return d.name + ' ' + d.id;})
      .style('transform-origin', !textReversed ? '' : 'center center')
      .style('transform-box', !textReversed ? '' : 'fill-box');
    setTimeout(() => {
      groups.selectAll('text').style('transform', !textReversed ? '' : 'rotate(90deg)');
    });
  }
}
