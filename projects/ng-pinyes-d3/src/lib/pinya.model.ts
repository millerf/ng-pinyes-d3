export class PinyaCastells {

  sections: SectionPinya[];
  agulla: CastellerLloc

}


export class SectionPinya {
  contrafort: CastellerLloc;
  baix: CastellerLloc;
  agulla: CastellerLloc;
  crosses: {
    dreta: CastellerLloc,
    esquerra: CastellerLloc
  };
  laterals: {
    dreta: CastellerLloc[],
    esquerra: CastellerLloc[]
  };
  vents: CastellerLloc[];
  mans: CastellerLloc[];

}


export class CastellerLloc {
  casteller: Casteller =  null;
  attendance: AttendanceType | typeof AttendanceTypeUnanswered = AttendanceTypeUnanswered;
}

export class Casteller {
  id = Math.floor(Math.random() * 10000) + 1;
  name = 'nombre';
}


export enum AttendanceType {
  attend = 'attend',
  cannotAttend = 'cannotAttend',
  maybe = 'maybe'
}
export const AttendanceTypeUnanswered = 'unanswered';
