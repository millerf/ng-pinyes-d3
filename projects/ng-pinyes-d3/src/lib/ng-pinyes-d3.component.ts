import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as d3 from "d3";
import * as d3plus from "d3plus-text"


import {AttendanceType, AttendanceTypeUnanswered, CastellerLloc, PinyaCastell} from './pinya.model';

@Component({
  selector: 'ng-pinyes-d3',
  template: `
    <svg></svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgPinyesD3Component implements OnInit {
  g;
  svg;
  @Input() width = 960;
  @Input() height = 960;
  @Input() fillColor = '#FFF';
  @Input() strokeColor = '#911305';
  @Input() strokeWidth = 2;
  @Input() borderCurve = 5;

  @Input()
  set showId(showId) {
    this.zoomOn(showId)
  }

  @Output() clickOnCastellerLloc = new EventEmitter<CastellerLloc>();

  firsDraw = true;
  rect_width = 100;
  rect_height = 50;
  margin = 5;
  first_margin;

  private _pinya: PinyaCastell;
  @Input()
  set pinya(pinya: PinyaCastell) {
    this._pinya = pinya;

    if (this.g) {
      this.updatePinya();
    }
  }

  get pinya(): PinyaCastell {
    return this._pinya;
  }

  private _editMode = false;
  @Input()
  set editMode(editMode: boolean) {
    this._editMode = editMode;
    if (this.g) {
      this.updatePinya();
    }
  };

  get editMode() {
    return this._editMode;
  }

  ngOnInit() {

    // Setting two constant attributes.
    this.svg = d3.select('svg');

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
    this.g = this.svg.append('g');

    this.first_margin = this.rect_height * (this.pinya.isPilar ? -0.5 : (this.pinya.sections.length - 1));

    this.updatePinya();
  }

  private updatePinya() {
    if (this.firsDraw) {
      this.pinya.sections.forEach((section, i) => {
        let group = this.g.append('g').attr('id', 'main' + i);

        if (!(this.pinya.isPilar && i === 1)) {
          this.drawAgulla(group, i);
          this.drawBaix(group, i);
          this.drawContrefort(group, i);
          this.drawCrosses(group, i);
        }

        this.drawMans(group, i);
        const group_vents = group.append('g').attr('id', 'vents' + i);
        this.drawVents(group_vents, i);
        const group_laterals_left = group.append('g').attr('id', 'lateralsleft' + i);
        const group_laterals_right = group.append('g').attr('id', 'lateralsright' + i);
        this.drawLaterals(group_laterals_right, group_laterals_left, i);
        this.firsDraw = false;
        
        const nb_sections = this.pinya.sections.length;
        const angle = (2 * Math.PI / nb_sections) * i;
        const angle_vents = 2 * Math.PI / (nb_sections * 2);
        const angle_laterals = 2 * Math.PI / (nb_sections * 4);
        group.style('transform', 'translate(' + (this.width / 2 - this.rect_width / 2) + 'px, ' + (this.height / 2) + 'px) rotate(' + this._rad_to_deg(angle) + 'deg)');
        group.style('transform-origin', this.rect_width / 2 + 'px 0');
        group_vents.style('transform', 'rotate(' + this._rad_to_deg(angle_vents) + 'deg)');
        group_vents.style('transform-origin', this.rect_width / 2 + 'px 0');
        group_laterals_left.style('transform', 'rotate(' + -1 * this._rad_to_deg(angle_laterals) + 'deg)');
        group_laterals_right.style('transform', 'rotate(' + this._rad_to_deg(angle_laterals) + 'deg)');
        group_laterals_left.style('transform-origin', this.rect_width + 'px 0');
      });
    } else {
      this.pinya.sections.forEach((section, i) => {
        let group = this.g.select('g#main' + i);
        let group_vents = this.g.select('g#vents' + i);
        let group_laterals_right = this.g.select('g#lateralsright' + i);
        let group_laterals_left = this.g.select('g#lateralsleft' + i);
        if (!(this.pinya.isPilar && i === 1)) {
          this.drawAgulla(group, i);
          this.drawBaix(group, i);
          this.drawCrosses(group, i);
          this.drawContrefort(group, i);
        }
        this.drawMans(group, i);
        this.drawVents(group_vents, i);
        this.drawLaterals(group_laterals_right, group_laterals_left, i);
      });
    }
  }

  public zoomOn(id = null) {
    if (id === null) {
      d3.select('.casteller')
        .style('fill', 'none');
    } else {
      const element = d3.select('#casteller_' + id);
      element.style('fill', 'green');
    }
  }

  private _rad_to_deg(ang_rad: number): number {
    return ang_rad / Math.PI * 180;
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
        this.first_margin - (this.rect_height + this.margin),
        this.isTextReversed(index),
      );
    }
  }

  private drawBaix(container, index: number) {
    const section = this.pinya.sections[index];
    if (section.baix) {
      this.drawCasteller('baix' + index,
        container,
        [section.baix],
        0,
        this.first_margin,
        this.isTextReversed(index),
      );
    }
  }

  private drawContrefort(container, index: number) {
    const section = this.pinya.sections[index];
    if (section.contrafort) {
      this.drawCasteller('contrafort' + index,
        container,
        [section.contrafort],
        0,
        (d, i) => (this.rect_height + this.margin) * (i + 1) + this.first_margin,
        this.isTextReversed(index)
      );
    }
  }

  private drawCrosses(container, index: number) {
    const section = this.pinya.sections[index];
    if (section.crosses) {

      if (section.crosses.dreta) {
        this.drawCasteller('cossesdreta' + index,
          container,
          [section.crosses.dreta],
          -(this.rect_height + this.margin),
          this.first_margin - this.rect_height / 2,
          false,
          false,
          this.rect_width,
          this.rect_height,
          true);
      }
      if (section.crosses.esquerra) {
        this.drawCasteller('cossesesquerra' + index,
          container,
          [section.crosses.esquerra],
          this.rect_width + this.margin,
          this.first_margin - this.rect_height / 2,
          false,
          false,
          this.rect_width,
          this.rect_height,
          true);
      }
    }
  }

  private drawMans(container, index: number) {
    const section = this.pinya.sections[index];

    this.drawCasteller('mans' + index,
      container,
      section.mans,
      0,
      (d, i) => (this.rect_height + this.margin) * (i + 2.5) + this.first_margin,
      this.isTextReversed(index),
      true);
  }

  private drawVents(container, index: number) {

    const section = this.pinya.sections[index];

    this.drawCasteller('vents' + index,
      container,
      section.vents,
      0,
      (d, i) => (this.rect_height + this.margin) * (i + (this.pinya.isPilar ? 3 : 2)) + this.first_margin,
      this.isTextReversed(index),
      true);
  }

  private drawLaterals(container_right, container_left, index: number) {
    const section = this.pinya.sections[index];
    if (section.laterals) {
      this.drawCasteller('lateralsdreta' + index,
        container_right,
        section.laterals.dreta,
        0,
        (d, i) => (this.rect_height + this.margin) * (i + 3) + this.first_margin,
        this.isTextReversed(index),
        true
      );

      this.drawCasteller('lateralsesquerra' + index,
        container_left,
        section.laterals.esquerra,
        0,
        (d, i) => (this.rect_height + this.margin) * (i + 3) + this.first_margin,
        this.isTextReversed(index),
        true
      );
    }
  }

  private drawCasteller(unique_selector,
                        container,
                        data: CastellerLloc[],
                        x: number | ((Casteller, number) => number),
                        y: number | ((Casteller, number) => number),
                        textReversed = false,
                        canAddNewPosition = false,
                        height: number | ((Casteller, number) => number) = this.rect_height,
                        width: number | ((Casteller, number) => number) = this.rect_width,
                        textVertical = false) {


    if (!this.editMode && canAddNewPosition) {
      data = data.filter((c) => this.editMode || c.casteller !== null);
    }

    let groups = container.select('g#' + unique_selector);
    if (groups.empty()) {
      groups = container.append('g').attr('id', unique_selector);
    } else {
      container.select('.add-new-lloc.' + unique_selector).remove();
    }

    // Button to add new Castellers
    if (this.editMode && canAddNewPosition) {
      // This button is at the end of lists. X is always 0

      container.append('rect')
        .attr('class', 'add-new-lloc ' + unique_selector)
        .attr('x', x)
        .attr('y', () => (typeof y == 'function' ? y(null, data.length) : 0))
        .attr('rx', this.borderCurve)
        .attr('ry', this.borderCurve)
        .attr('width', this.rect_width)
        .attr('height', this.rect_height)
        .style('fill', this.fillColor)
        .style('cursor', 'pointer')
        .style('stroke', this.strokeColor)
        .style('stroke-width', this.strokeWidth)
        .style('stroke-dasharray', 5)
        .on('click', () => {
          data.push(new CastellerLloc());
          this.updatePinya();
        });
    }

    const rectangles = groups.selectAll('rect.casteller')
      .data(data);

    //Remove old
    rectangles.exit().remove();

    // Update exiting
    rectangles
      .attr('id', (d: CastellerLloc) => d && d.casteller ? 'casteller_' + d.casteller.pk : null)
      .style('stroke', (d) => this.getColor(d, true) || this.strokeColor);

    // Create new
    rectangles.enter()
      .append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('rx', this.borderCurve)
      .attr('ry', this.borderCurve)
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'casteller')
      .attr('id', (d: CastellerLloc) => d && d.casteller ? 'casteller_' + d.casteller.pk : null)
      .style('fill', this.fillColor)
      .style('stroke', (d) => this.getColor(d, true) || this.strokeColor)
      .style('stroke-width', this.strokeWidth);


    new d3plus.TextBox()
      .data(data)
      .text(d => d.casteller ? d.casteller.getName() : '')
      .verticalAlign('middle')
      .textAnchor('middle')
      .padding(10)
      .fontResize(true)
      .rotateAnchor(d => textVertical ? [d.h / 2, d.h / 2] : [d.w / 2, d.h / 2])
      .rotate(() => textVertical ? 90 : (textReversed ? 180 : 0))
      .x(x)
      .y(y)
      .fontMax(14)
      .height(textVertical ? width : height)
      .width(textVertical ? height : width)
      .select('g#' + unique_selector)
      .render();


    const rectangles_click = groups.selectAll('rect.casteller_click')
      .data(this.editMode ? data : []);

    //Remove old
    rectangles_click.exit().remove();

    // Create new
    rectangles_click.enter()
      .append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('class', 'casteller_click')
      .attr('rx', this.borderCurve)
      .attr('ry', this.borderCurve)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'transparent')
      .attr('stroke', 'transparent')
      .style('cursor', () => 'pointer')
      .on('click', (d) => {
        if (this.editMode) {
          this.clickOnCastellerLloc.emit(d);
        }
      });

  }

  private getColor(d: CastellerLloc, showUnanswered = false): string {
    return this.editMode && d && d.casteller && d.attendance ?
      (d.attendance === AttendanceType.cannotAttend ? 'red' :
        (d.attendance === AttendanceType.maybe ? 'orange' :
          (d.attendance === AttendanceTypeUnanswered ? (showUnanswered ? 'yellow' : '') : ''))) : '';
  }


  private isTextReversed(index) {
    return index > this.pinya.sections.length / 2 - 1;
  }
}
