


import {IdentifierFluent, IdentifierRestrictions, IsIdentifierValidator} from "../../validator/identifier/identifier";
import {StringRestrictions} from "../../validator/string/string-validator";
import {StringGen} from "../string-gen";
import {UNICODE} from "../../validator/identifier/identifier_constants";
import {NumberGen} from "../number-gen";

export interface IdentifierGenRestrictions extends IdentifierRestrictions, StringRestrictions {
  unique?: boolean;
  incremental?: boolean;
}

export interface IdentifierGenFluent extends IdentifierFluent {
  unique(value?: boolean): this
  incremental(value?: boolean): this
}


/**
 * Many thanks to https://mathiasbynens.be/notes/javascript-properties
 *
 */
export class IdentifierGen extends StringGen implements IdentifierGenFluent {
  restrictions: IdentifierGenRestrictions
  private _instanceData: {previous: number|string, used?: {[key: string]: boolean}}
  maxAttempts = 10;

  constructor() {
    super()
    this.reset()
    this.validatedBy(new IsIdentifierValidator())
  }

  reset() {
    this._instanceData = {
      previous: -1,
      used: {}
    }
  }

  getDefaults(): IdentifierGenRestrictions {
    return {
      allowedChars: null,
      allowedCodePoints: UNICODE.ID_Start,
      notNull: true,
      arrayIndex: null,
      quoted: null,
      incremental: null,
      unique: null,
      minLength: {value: 1, inclusive: true},
      maxLength: {value: 20, inclusive: true},
    }
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

  incremental(): this {
    this.restrictions.incremental = true
    return this
  }

  unique(): this {
    this.restrictions.unique = true
    return this
  }

  /**
   * Generate a valid array index. Sets incremental and unique to 'true' if they are unset.
   */
  arrayIndex(): this {
    let R = this.restrictions
    R.arrayIndex = true
    R.incremental = R.incremental === null ? true : R.incremental
    R.unique = R.unique === null ? true : R.unique
    return this
  }

  doGen(R?: IdentifierGenRestrictions): string {
    let data: any
    let attempts = this.maxAttempts
    do {
      if (R.arrayIndex) {
        data = IdentifierGen.nextArrayIndex(R.incremental, <number>this._instanceData.previous);
      } else {
        data = super.doGen(R)
        // v = RefGen.nextValidStringIdentifier(super, R.quoted, <string>this._instanceData.previous)
      }
    } while (--attempts && (!this.validator.isValid(data) || (R.unique && (this._instanceData.used[data] == true ) )))
    if (attempts === 0) {
      throw new Error("Could not generate valid identifier values within the constraints provided.")
    }
    this._instanceData.used[data] = true
    this._instanceData.previous = data

    return data
  }

  static nextArrayIndex(incremental: boolean, previous: number) {
    let v: number
    if (incremental) {
      v = previous + 1
    } else {
      v = NumberGen.nextInt(0, Number.MAX_SAFE_INTEGER)
    }
    return v;
  }

  static nextValidStringIdentifier(generator: StringGen, quoted: boolean, previous: string) {
    return generator.gen()
  }
}
