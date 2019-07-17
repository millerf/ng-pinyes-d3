import {Component} from '@angular/core';
import {
  AttendanceType,
  AttendanceTypeUnanswered,
  Casteller,
  CastellerLloc,
  PinyaCastells,
  SectionPinya
} from '../../projects/ng-pinyes-d3/src/lib/pinya.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  pinya: PinyaCastells;
  editMode = false;

  constructor() {

    this.pinya = new PinyaCastells();


    const sp = new SectionPinya();
    sp.agulla = new CastellerLloc();
    sp.baix = new CastellerLloc();
    sp.contrafort = new CastellerLloc();
    sp.crosses = {dreta: new CastellerLloc(), esquerra: new CastellerLloc()};
    sp.vents = [new CastellerLloc(), new CastellerLloc(), new CastellerLloc(), new CastellerLloc()];
    sp.mans = [new CastellerLloc(), new CastellerLloc(), new CastellerLloc(), new CastellerLloc()];
    sp.laterals = {
      dreta: [new CastellerLloc(), new CastellerLloc(), new CastellerLloc()],
      esquerra: [new CastellerLloc(), new CastellerLloc(), new CastellerLloc()]
    };

    const sp2 = new SectionPinya();
    sp2.agulla = new CastellerLloc();
    sp2.baix = new CastellerLloc();
    sp2.contrafort = new CastellerLloc();
    sp2.crosses = {dreta: new CastellerLloc(), esquerra: new CastellerLloc()};
    sp2.vents = [new CastellerLloc(), new CastellerLloc(), new CastellerLloc(), new CastellerLloc()];
    sp2.mans = [new CastellerLloc(), new CastellerLloc(), new CastellerLloc(), new CastellerLloc()];
    sp2.laterals = {
      dreta: [new CastellerLloc(), new CastellerLloc(), new CastellerLloc()],
      esquerra: [new CastellerLloc(), new CastellerLloc(), new CastellerLloc()]
    };

    const attendances : any = [AttendanceTypeUnanswered, AttendanceType.maybe, AttendanceType.cannotAttend, AttendanceType.attend];
    sp.mans.forEach((d) => d.casteller = new Casteller());
    sp.mans.forEach((d) => d.attendance = attendances[Math.floor(Math.random() * 4)]);
    this.pinya.sections = [sp, sp2, {...sp2}];

    setTimeout(() => {
      sp.vents = sp.vents.slice(2, 4);
      this.pinya = {...this.pinya};
    }, 4000)
  }

  clickOnCastellerLloc(lloc: CastellerLloc) {
    lloc.casteller = new Casteller();
    this.pinya = {...this.pinya};
  }
}
