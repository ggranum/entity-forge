import {Forge, BeforeIgnitionEvent} from "./forge";
import {BooleanGen} from "generate/index";
import {BaseForge} from "./base-forge";

/**
 * Forge booleans fields. A boolean field can be true, false or null. Null may be disabled by calling #notNull.
 */
export class BooleanForge extends BaseForge {

  constructor() {
    super()
    this.isOneOf([null, true, false])
  }

  /**
   * Create a new Forge for boolean field values.
   * A boolean field can be true, false or null. Null may be disabled by calling #notNull.
   * @param defaultValue
   * @returns {BooleanForge}
   */
  static bool(defaultValue = false): BooleanForge {
    return new BooleanForge().initTo(defaultValue)
  }
}


Forge.onBeforeIgnition(BooleanForge, function (event: BeforeIgnitionEvent) {
  let dataGen = new BooleanGen().applyRestrictions(event.restrictions)
  event.forge.dataGen = dataGen
  event.forge.gen = () => dataGen.gen()
})
