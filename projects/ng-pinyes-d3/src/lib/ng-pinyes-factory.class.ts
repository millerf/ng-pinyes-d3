import {CastellerLloc, PinyaCastell, SectionPinya} from './pinya.model';


export class PinyaFactory {


  public static generate(number: number, numberOfVents = 2, numberOfMans = 2, numberOfLaterals = 2) {

    number = Math.floor(number);

    if (number < 1) {
      throw 'PinyaFactory: Number must be superior to 1';
    }

    const pinya = new PinyaCastell();
    pinya.isPilar = number === 1;
    if (pinya.isPilar) {
      number = 2;
    }
    for (let i = 0; i < number; i++) {
      const sp = new SectionPinya();
      sp.agulla = number === 2 && i == 1 ? null : new CastellerLloc(); // Only one agulla in torres
      sp.baix = pinya.isPilar && i == 1 ? null : new CastellerLloc();
      sp.contrafort = pinya.isPilar && i == 1 ? null : new CastellerLloc();
      sp.crosses = {
        dreta: pinya.isPilar && i == 1 ? null : new CastellerLloc(),
        esquerra: pinya.isPilar && i == 1 ? null : new CastellerLloc()
      };

      sp.vents = [];
      for (let vent = 0; vent < numberOfVents; vent++) {
        sp.vents.push(new CastellerLloc());
      }

      sp.mans = [];
      for (let man = 0; man < numberOfVents; man++) {
        sp.mans.push(new CastellerLloc());
      }

      sp.laterals = {
        dreta: [],
        esquerra: []
      };

      for (let lat = 0; lat < numberOfLaterals; lat++) {
        sp.laterals.esquerra.push(new CastellerLloc());
        sp.laterals.dreta.push(new CastellerLloc());
      }
      pinya.sections.push(sp);
    }

    return pinya;
  }


}
