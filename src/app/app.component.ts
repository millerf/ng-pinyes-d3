import {Component} from '@angular/core';
import {Casteller, PinyaCastells, SectionPinya} from '../../projects/ng-pinyes-d3/src/lib/pinya.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'ng-pinyes-d3-app';
  pinya: PinyaCastells;

  constructor() {

    this.pinya = new PinyaCastells();


    const sp = new SectionPinya();
    sp.agulla = new Casteller();
    sp.baix = new Casteller();
    sp.contrafort = new Casteller();
    sp.crosses = {dreta: new Casteller(), esquerra: new Casteller()};
    sp.vents = [new Casteller(), new Casteller(), new Casteller(), new Casteller()];
    sp.mans = [new Casteller(), new Casteller(), new Casteller(), new Casteller()];
    sp.laterals = {
      dreta: [new Casteller(), new Casteller(), new Casteller()],
      esquerra: [new Casteller(), new Casteller(), new Casteller()]
    };
    this.pinya.sections = [sp, {...sp}, {...sp}, {...sp}, ];


  }

}
