

import {Forge} from "./forge";
import {NumberRestrictionDefaults} from "../validation/restriction/restriction";
import {Checks} from "../check/index";
import {NumberCheck} from "../check/number-check";
import {NumberGen} from "../generate/number-gen";
export class NumberForge extends Forge {

  _check:NumberCheck

  constructor(defaultValue:number = 0, msg = "@validations.number.number" ) {
    super(defaultValue, NumberRestrictionDefaults)
    this.applyCheck(Checks.number())
  }

  /**
   *
   * @param defaultValue
   * @param msg
   * @returns {NumberForge}
   */
  static number(defaultValue = 0, msg = "@validations.number.number") {
    return new NumberForge(defaultValue, msg)
  }

  /**
   *
   * @param defaultValue
   * @param msg
   * @returns {NumberForge}
   */
  static int(defaultValue:number = 0, msg = "@validations.number.int") {
    let forge = new NumberForge(defaultValue, msg)
    return forge.integer(msg)
  }

  /**
   *
   * @param msg
   * @returns {NumberForge}
   */
  integer(msg = "@validations.number.int"){
    this.restrictions.integral = true
    this.restrictions.min = this.restrictions.min === Number.MIN_VALUE ? Number.MIN_SAFE_INTEGER : this.restrictions.min
    this.restrictions.max = this.restrictions.max === Number.MAX_VALUE ? Number.MAX_SAFE_INTEGER : this.restrictions.max
    this._check.isInt()
    return this
  }

  /**
   *
   * @param min
   * @param msg
   * @returns {NumberForge}
   */
  min(min:number, msg = "@validations.number.min") {
    this.restrictions.min = min
    this._check.min(min)
    return this
  }

  /**
   * @returns {NumberForge}
   */
  max(max:number, msg = "@validations.number.max") {
    this.restrictions.max = max
    this._check.max(max)
    return this
  }

}


Forge.onBeforeIgnition(NumberForge, function (event:any) {
  let dataGen = new NumberGen(event.forge.restrictions)
  event.forge.dataGen = dataGen
  event.forge.gen = () => dataGen.gen()
})


