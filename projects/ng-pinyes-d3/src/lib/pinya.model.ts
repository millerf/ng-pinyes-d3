export class PinyaCastells {

  sections: SectionPinya[];
  agulla: Casteller

}


export class SectionPinya {
  contrafort: Casteller;
  baix: Casteller;
  crosses: {
    dreta: Casteller,
    esquerra: Casteller
  };
  laterals: Casteller[];
  vents: Casteller[];
  mans: Casteller[];

}


export class Casteller {
  name = 'test'
}
