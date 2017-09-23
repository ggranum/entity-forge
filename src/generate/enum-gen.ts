import {BaseGen} from "./base-gen";
import {BaseRestrictions} from "../validator/base-validator";

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



