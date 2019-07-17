


/**
 * AssignedObject
 *
 * An helper class to help to cast Json / any objects into a "proper" object
 *
 */

export class AssignedObjectWithoutPk {

  /**
   * Assign properties to the object passed by param.
   * `forceAssign` is used for not remove the class' optional properties.
   * @param object
   * @param forceAssign
   * @returns
   */
  assign(object: any, forceAssign = false) {
    const paramsToDelete = [];
    if (!forceAssign) {
      for (const param in object) {
        if (object.hasOwnProperty(param) && !this.hasOwnProperty(param)) {
          paramsToDelete.push(param);
        }
      }
    }
    Object.assign(this, object);
    for (const param of paramsToDelete) {
      delete(this[param]);
    }
    this.afterAssign();

    return this;
  }


  /**
   *  Hoook when the object finished assignment.
   *  It would have to be overriden by child class
   */
  protected afterAssign() {
    // It would have to be overriden by child class
  }
}

export class AssignedObject extends AssignedObjectWithoutPk {
  public pk: number = null;
}



export class PinyaCastell extends AssignedObject {
  sections: SectionPinya[] = [];

  protected afterAssign() {
    super.afterAssign();

    this.sections = this.sections.map(s => new SectionPinya().assign(s));
  }
}


export class SectionPinya extends AssignedObjectWithoutPk {

  contrafort: CastellerLloc = null;
  baix: CastellerLloc  = null;
  agulla: CastellerLloc  = null;
  crosses: {
    dreta: CastellerLloc,
    esquerra: CastellerLloc
  } = {
    dreta: null,
    esquerra: null};
  laterals: {
    dreta: CastellerLloc[],
    esquerra: CastellerLloc[]
  } = {
    dreta: [],
    esquerra: []
  };
  vents: CastellerLloc[] = null;
  mans: CastellerLloc[] = null;

  protected afterAssign() {
    super.afterAssign();

    this.agulla = new CastellerLloc().assign(this.agulla);
    this.contrafort = new CastellerLloc().assign(this.contrafort);
    this.baix = new CastellerLloc().assign(this.baix);
    this.vents = this.vents.map(s => new CastellerLloc().assign(s));
    this.mans = this.mans.map(s => new CastellerLloc().assign(s));
    this.laterals.esquerra = this.laterals.esquerra.map(s => new CastellerLloc().assign(s));
    this.laterals.dreta = this.laterals.dreta.map(s => new CastellerLloc().assign(s));
    this.crosses.esquerra = new CastellerLloc().assign(this.crosses.esquerra);
    this.crosses.dreta = new CastellerLloc().assign(this.crosses.dreta);
  }

}


export class CastellerLloc extends AssignedObjectWithoutPk{
  casteller: CastellerInterface =  null;
  attendance: AttendanceType | typeof AttendanceTypeUnanswered = AttendanceTypeUnanswered;
}

export interface CastellerInterface {
  pk;

  getName(): string;
}


export enum AttendanceType {
  attend = 'attend',
  cannotAttend = 'cannotAttend',
  maybe = 'maybe'
}
export const AttendanceTypeUnanswered = 'unanswered';
