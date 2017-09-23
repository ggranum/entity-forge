import {BooleanGen} from "@entity-forge/generate";
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

BooleanForge.generatedByType(BooleanGen)
