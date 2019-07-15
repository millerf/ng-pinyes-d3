export class PinyaCastells {

  sections: SectionPinya[];
  agulla: Casteller

}


export class SectionPinya {
  contrafort: Casteller;
  baix: Casteller;
  agulla: Casteller;
  crosses: {
    dreta: Casteller,
    esquerra: Casteller
  };
  laterals: {
    dreta: Casteller[],
    esquerra: Casteller[]
  };
  vents: Casteller[];
  mans: Casteller[];

}


export class Casteller {
  name = 'test'
}
