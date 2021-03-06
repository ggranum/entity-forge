import {BaseForge} from "./base-forge";
import {EnumGen} from "../generate/enum-gen";



export class EnumForge extends BaseForge {

  constructor() {
    super()
  }

  static enumeration(defaultValue?:any) {
    return new EnumForge().initTo(defaultValue)
  }


  ignite() {
    if (this.restrictions.notNull && this.defaultValue === undefined ) {
      this.initTo(this.restrictions.isOneOf![0])
    }
    super.ignite()
  }

  values(values: any[]) {
    this.restrictions.isOneOf = values
    return this
  }
}
EnumForge.generatedByType(EnumGen)
