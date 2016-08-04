import {Forge, BeforeIgnitionEvent} from "./forge";
import {FluentNumberRestrictions} from "validator/index";
import {NumberCheck} from "check/index";
import {NumberGen} from "generate/index";

export class NumberForge extends Forge implements FluentNumberRestrictions{

  _check:NumberCheck

  constructor(checkOverride?:NumberCheck) {
    super(checkOverride || new NumberCheck().autoInit(false))
  }

  static number(defaultValue:number = 0):NumberForge {
    return new NumberForge().initTo(defaultValue)
  }

  static int(defaultValue:number = 0):NumberForge {
    let forge = new NumberForge().initTo(defaultValue)
    return forge.isInt()
  }

  isNumber():this {
    this._check.isNumber()
    return this
  }

  isInt():this{
    this._check.isInt()
    return this
  }

  min(value:number, inclusive?:boolean):this {
    this._check.min(value, inclusive !== false)
    return this
  }

  /**
   * @returns {NumberForge}
   */
  max(value:number, inclusive?:boolean):this {
    this._check.max(value, inclusive !== false)
    return this
  }
}


Forge.onBeforeIgnition(NumberForge, function (event:BeforeIgnitionEvent) {
  let dataGen = new NumberGen().applyRestrictions(event.restrictions)
  event.forge.dataGen = dataGen
  event.forge.gen = () => dataGen.gen()
})


