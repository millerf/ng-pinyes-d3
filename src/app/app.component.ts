import {Component} from '@angular/core';
import {
  AttendanceType,
  AttendanceTypeUnanswered,
  CastellerInterface,
  CastellerLloc,
  PinyaCastell,
  SectionPinya
} from '../../projects/ng-pinyes-d3/src/lib/pinya.model';
import {PinyaFactory} from '../../projects/ng-pinyes-d3/src/lib/ng-pinyes-factory.class';

class Casteller implements CastellerInterface {
  pk = Math.floor(Math.random() * 10000) + 1;
  name = '';

  getName() {
    return this.name;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  pinya: PinyaCastell;
  editMode = false;

  constructor() {

    this.pinya = PinyaFactory.generate(3, 4, 4, 4);


    setTimeout(() => {
      this.pinya.sections[1].vents = this.pinya.sections[1].vents.slice(2, 4);
      this.pinya = new PinyaCastell().assign(this.pinya);
    }, 4000)
  }

  clickOnCastellerLloc(lloc: CastellerLloc) {
    lloc.casteller = new Casteller();
    this.pinya = new PinyaCastell().assign(this.pinya);
  }
}
