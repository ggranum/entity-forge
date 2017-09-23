import {BaseRestrictions} from "@entity-forge/validator";
import {BaseGen} from "./base-gen";

export class EnumGen extends BaseGen {

  restrictions: BaseRestrictions

  constructor() {
    super()
  }

  values(values: any[]): this {
    super.isOneOf(values)
    return this
  }

}



