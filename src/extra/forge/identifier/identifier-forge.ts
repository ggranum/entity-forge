import {Forge, BaseForge, BeforeIgnitionEvent} from "forge/index";
import {StringGen} from "generate/index";
import {IdentifierGenRestrictions} from "extra/generate/index";
import {IdentifierRestrictions, IdentifierFluent} from "extra/validator/index";


/**
 * Forge ECMAScript identifier keys.
 *
 * This forge restricts values to valid ES6 Identifiers.
 *
 * For a good summary, see [](https://mathiasbynens.be/notes/javascript-identifiers-es6).
 * For the specification, see: http://www.ecma-international.org/ecma-262/6.0/index.html#sec-names-and-keywords
 *
 */
export class IdentifierForge extends BaseForge implements IdentifierFluent {

  restrictions: IdentifierRestrictions

  constructor() {
    super()
  }

  static key(defaultValue: string) {
    return  new IdentifierForge()
      .initTo(defaultValue === undefined ? "" : defaultValue)
      .notNull()
      .minLength(1)
      .maxLength(100)
  }

  minLength(value: number, inclusive?: boolean): this {
    this.restrictions.minLength = {value: value, inclusive: inclusive !== false}
    return this
  }

  maxLength(value: number, inclusive?: boolean): this {
    this.restrictions.maxLength = {value: value, inclusive: inclusive !== false}
    return this
  }

  isIdentifier(value?: boolean): this {
    this.restrictions.isIdentifier = value !== false
    return this
  }

  objectKey(value?: boolean): this {
    this.restrictions.objectKey = value !== false
    return this
  }

  quoted(value?: boolean): this {
    this.restrictions.quoted = value !== false
    return this
  }

  arrayIndex(value?: boolean): this {
    this.restrictions.arrayIndex = value !== false
    return this
  }
}


Forge.onBeforeIgnition(IdentifierForge, function (event: BeforeIgnitionEvent) {
  let dataGen = new StringGen()
  dataGen.restrictions = <IdentifierGenRestrictions>event.restrictions
  event.forge._generatedBy = dataGen
  event.forge.gen = () => dataGen.gen()
})

