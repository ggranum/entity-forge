import {Forge, BeforeIgnitionEvent} from "./forge";
import {Strings} from "validator/index";
import {StringCheck, Check} from "check/index";
import {StringGen} from "generate/index";
import {StringForge} from "./string-forge";


/**
 * Forge ECMAScript identifier keys.
 *
 * This forge restricts values to valid ES6 Identifiers.
 *
 * For a good summary, see [](https://mathiasbynens.be/notes/javascript-identifiers-es6).
 * For the specification, see: http://www.ecma-international.org/ecma-262/6.0/index.html#sec-names-and-keywords
 *
 */
export class KeyForge extends StringForge {

  _check: StringCheck

  constructor(checkOverride?: Check) {
    super(checkOverride || new StringCheck().autoInit(false))
    this.allowedCodePoints(Strings.COMMON_UTF_RANGES.UTF_PLANE_BMP)
  }

  static key(defaultValue: string) {
    let kf = new KeyForge()
      .initTo(defaultValue === undefined ? "" : defaultValue)
      .notNull()
      .minLength(1)
      .maxLength(100)
      .allowedCodePoints()

    return kf
  }


}


Forge.onBeforeIgnition(KeyForge, function (event: BeforeIgnitionEvent) {
  let dataGen = new StringGen(event.restrictions)
  event.forge.dataGen = dataGen
  event.forge.gen = () => dataGen.gen()
})

