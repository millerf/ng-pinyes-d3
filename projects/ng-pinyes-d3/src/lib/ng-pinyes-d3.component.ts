import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as d3 from "d3";
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
  width = 960;
  height = 960;
  @Input() fillColor = '#FFF';
  @Input() strokeColor = '911305';
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

    this.first_margin = this.rect_height * (this.pinya.sections.length - 1);

    this.updatePinya();
  }

  private updatePinya() {
    if (this.firsDraw) {
      this.pinya.sections.forEach((section, i) => {
        let group = this.g.append('g').attr('id', 'main' + i);
        this._add_point_filler(group);
        this.drawAgulla(group, i);
        this.drawBaix(group, i);
        this.drawContrefort(group, i);
        this.drawMans(group, i);
        this.drawCrosses(group, i);
        const group_vents = group.append('g').attr('id', 'vents' + i);
        this._add_point_filler(group_vents);
        this.drawVents(group_vents, i);
        const group_laterals_left = group.append('g').attr('id', 'lateralsleft' + i);
        this._add_point_filler(group_laterals_left);
        const group_laterals_right = group.append('g').attr('id', 'lateralsright' + i);
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
        let group = this.g.select('g#main' + i);
        let group_vents = this.g.select('g#vents' + i);
        let group_laterals_right = this.g.select('g#lateralsright' + i);
        let group_laterals_left = this.g.select('g#lateralsleft' + i);
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

  public zoomOn(id = null) {
    if (id === null) {
      d3.select('.casteller')
        .style('fill', 'none');
    } else {
      const element = d3.select('#casteller_' + id);
      element.style('fill', 'green');
      // (element.node() as HTMLElement).dispatchEvent(new ButtonEvent("click"));
    }
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
      this.drawCasteller('cossesdreta' + index,
        container,
        [section.crosses.dreta],
        -(this.rect_height + this.margin),
        this.first_margin,
        false,
        false,
        this.rect_width,
        this.rect_height,
        true);
      this.drawCasteller('cossesesquerra' + index,
        container,
        [section.crosses.esquerra],
        this.rect_width + this.margin,
        this.first_margin,
        false,
        false,
        this.rect_width,
        this.rect_height,
        true);
    }
  }

  private drawMans(container, index: number) {
    const section = this.pinya.sections[index];

    this.drawCasteller('mans' + index,
      container,
      section.mans.filter((c) => this.editMode || c.casteller !== null),
      0,
      (d, i) => (this.rect_height + this.margin) * (i + 2) + this.first_margin,
      this.isTextReversed(index),
      true);
  }

  private drawVents(container, index: number) {

    const section = this.pinya.sections[index];

    this.drawCasteller('vents' + index,
      container,
      section.vents.filter((c) => this.editMode || c.casteller !== null),
      0,
      (d, i) => (this.rect_height + this.margin) * (i + 1) + this.first_margin,
      this.isTextReversed(index),
      true);
  }

  private drawLaterals(container_right, container_left, index: number) {
    const section = this.pinya.sections[index];
    if (section.laterals) {
      this.drawCasteller('lateralsdreta' + index,
        container_right,
        section.laterals.dreta.filter((c) => this.editMode || c.casteller !== null),
        0,
        (d, i) => (this.rect_height + this.margin) * (i + 3) + this.first_margin,
        this.isTextReversed(index),
        true
      );

      this.drawCasteller('lateralsesquerra' + index,
        container_left,
        section.laterals.esquerra.filter((c) => this.editMode || c.casteller !== null),
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

    const texts = groups.selectAll('text')
      .data(data);

    //Remove old
    texts.exit().remove();

    // Update exiting
    texts
      .style('fill', (d) => this.getColor(d))
      .text((d: CastellerLloc) => {
        return d.casteller ? d.casteller.getName() : null;
      });


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
      .style('fill', (d) => this.getColor(d))
      .style('user-select', 'none')
      .text((d: CastellerLloc) => {
        return d.casteller ? d.casteller.getName() : null;
      })
      .attr('transform', (d, i) => {
        const _x = (typeof x == 'function' ? x(d, i) : x) +
          (typeof width == 'function' ? width(d, i) : width) / 2;

        const _y = (typeof y == 'function' ? y(d, i) : y) +
          (typeof height == 'function' ? height(d, i) : height) / 2;
        return !textVertical ? (
          textReversed ? 'rotate(180, ' + _x + ', ' + _y + ')' : '') :
          'rotate(90, ' + _x + ', ' + _y + ')';
      });


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
    return this.editMode && d && d.casteller && d.attendance?
      (d.attendance === AttendanceType.cannotAttend ? 'red' :
        (d.attendance === AttendanceType.maybe ? 'orange' :
          (d.attendance === AttendanceTypeUnanswered ? (showUnanswered ? 'yellow' : '') : ''))) : '';
  }


  private isTextReversed(index) {
    return index > this.pinya.sections.length / 2 - 1;
  }
}
