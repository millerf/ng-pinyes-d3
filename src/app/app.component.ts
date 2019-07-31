import {Component} from '@angular/core';
import {
  CastellerInterface,
  CastellerLloc,
  PinyaCastell,
} from '../../projects/ng-pinyes-d3/src/lib/pinya.model';
import {PinyaFactory} from '../../projects/ng-pinyes-d3/src/lib/ng-pinyes-factory.class';

class Casteller implements CastellerInterface {
  pk = Math.floor(Math.random() * 10000) + 1;
  name = 'test name';

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
  editMode = true;

  constructor() {

    this.pinya = PinyaFactory.generate(1, 4, 4, 4);
    this.pinya.sections[0].mans[0].casteller= new Casteller();
    this.pinya.sections[0].laterals.esquerra[2].casteller= new Casteller();
    this.pinya.sections[0].laterals.dreta[3].casteller= new Casteller();

  }

  clickOnCastellerLloc(lloc: CastellerLloc) {
    lloc.casteller = new Casteller();
    this.pinya = new PinyaCastell().assign(this.pinya);
  }
}
