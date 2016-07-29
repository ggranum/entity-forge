import {Forge, BeforeIgnitionEvent} from "./forge";
import {BooleanGen} from "../generate/boolean-gen";
import {BooleanCheck} from "../check/boolean-check";

/**
 * Forge booleans fields. A boolean field can be true, false or null. Null may be disabled by calling #notNull.
 */
export class BooleanForge extends Forge {

  constructor(checkOverride?:BooleanCheck) {
    super(checkOverride||new BooleanCheck().autoInit(false))
  }

  /**
   * Create a new Forge for boolean field values.
   * A boolean field can be true, false or null. Null may be disabled by calling #notNull.
   * @param defaultValue
   * @returns {BooleanForge}
   */
  static bool(defaultValue = false):BooleanForge {
    return new BooleanForge().initTo(defaultValue)
  }
}


Forge.onBeforeIgnition(BooleanForge, function (event:BeforeIgnitionEvent) {
  let dataGen = new BooleanGen(event.restrictions)
  event.forge.dataGen = dataGen
  event.forge.gen = () => dataGen.gen()
})










