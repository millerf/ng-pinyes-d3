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

    const sp2 = new SectionPinya();
    sp2.agulla = new Casteller();
    sp2.baix = new Casteller();
    sp2.contrafort = new Casteller();
    sp2.crosses = {dreta: new Casteller(), esquerra: new Casteller()};
    sp2.vents = [new Casteller(), new Casteller(), new Casteller(), new Casteller()];
    sp2.mans = [new Casteller(), new Casteller(), new Casteller(), new Casteller()];
    sp2.laterals = {
      dreta: [new Casteller(), new Casteller(), new Casteller()],
      esquerra: [new Casteller(), new Casteller(), new Casteller()]
    };


    this.pinya.sections = [sp, sp2, {...sp2}];

    setTimeout(()=> {
      sp.mans[1].name = 'dwqwdw';
      sp.mans[0].id = 12332;
      sp.mans[0] = {...sp.mans[0]}
      this.pinya = {...this.pinya};
    }, 2000)

    setTimeout(()=> {
      sp.vents = sp.vents.slice(2,4);
      console.info(sp.vents);
      this.pinya = {...this.pinya};
    }, 4000)
  }

}
