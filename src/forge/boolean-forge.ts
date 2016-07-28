import {Forge} from "./forge";
import {Checks} from "../check/index";
import {BooleanRestrictionDefaults} from "../validator/restriction/restriction";
import {BooleanGen} from "../generate/boolean-gen";

/**
 * Forge booleans fields. A boolean field can be true, false or null. Null may be disabled by calling #notNull.
 */
export class BooleanForge extends Forge {

  constructor(defaultValue = false, msg = "@validations.boolean.bool") {
    super(defaultValue, BooleanRestrictionDefaults)
    this.applyCheck(Checks.boolean())
  }

  /**
   * Create a new Forge for boolean field values.
   * A boolean field can be true, false or null. Null may be disabled by calling #notNull.
   * @param defaultValue
   * @param msg
   * @returns {BooleanForge}
   */
  static bool(defaultValue = false, msg = "@validations.boolean.bool") {
    return new BooleanForge(defaultValue, msg)
  }
}


Forge.onBeforeIgnition(BooleanForge, function (event:any) {
  let dataGen = new BooleanGen(event.forge.restrictions)
  event.forge.dataGen = dataGen
  event.forge.gen = () => dataGen.gen()
})










