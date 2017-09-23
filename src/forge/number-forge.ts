import {Forge, BeforeIgnitionEvent} from "./forge";
import {NumberValidator, NumberRestrictions, NumberRestrictionsFluent} from "@entity-forge/validator";
import {NumberGen} from "@entity-forge/generate";
import {BaseForge} from "./base-forge";

export class NumberForge extends BaseForge implements NumberRestrictionsFluent{

  restrictions:NumberRestrictions

  constructor() {
    super()
    this.validatedBy(NumberValidator.instance())
    this.isNumber()
  }

  static number(defaultValue:number = 0):NumberForge {
    return new NumberForge().initTo(defaultValue)
  }

  static int(defaultValue:number = 0):NumberForge {
    let forge = new NumberForge().initTo(defaultValue)
    return forge.isInt()
  }

  isNumber(): this {
    this.restrictions.isNumber = true
    return this
  }

  isInt(): this {
    this.restrictions.isInt = true
    return this
  }

  min(value: number, inclusive?: boolean): this {
    this.restrictions.min = {value: value, inclusive: inclusive !== false}
    return this
  }

  max(value: number, inclusive?: boolean): this {
    this.restrictions.max = {value: value, inclusive: inclusive !== false}
    return this
  }
}

NumberForge.generatedByType(NumberGen)
