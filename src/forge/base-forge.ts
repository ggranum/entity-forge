import {Forge, BeforeIgnitionEvent} from "./forge";
import {NumberGen} from "generate/index";
import {BaseRestrictions, BaseRestrictionsFluent, BaseValidator} from "validator/index";

export class BaseForge extends Forge implements BaseRestrictionsFluent{

  restrictions:BaseRestrictions

  constructor() {
    super()
    super.validatedBy(BaseValidator.instance())
  }

  static any(defaultValue?:any):BaseForge {
    return new BaseForge().initTo(defaultValue)
  }

  notNull(value?:boolean):this {
    this.restrictions.notNull = value !== false
    return this
  }

  isOneOf(value: any[]): this {
    this.restrictions.isOneOf = value
    return this
  }
}


Forge.onBeforeIgnition(BaseForge, function (event:BeforeIgnitionEvent) {
  let dataGen = new NumberGen().applyRestrictions(event.restrictions)
  event.forge.dataGen = dataGen
  event.forge.gen = () => dataGen.gen()
})


