import {RefRestrictions, FluentRefRestrictions} from "../validator/restriction/restriction";
import {NumberGen} from "./number-gen";
import {StringGen} from "./string-gen";
import {ConfigurationError} from "../forge/configuration-error";
import {Strings} from "validator/index";
import {IsIdentifierValidator} from "../validator/identifier";

/**
 * Many thanks to https://mathiasbynens.be/notes/javascript-properties
 *
 */
export class IdentifierGen extends StringGen implements FluentRefRestrictions {

  restrictions: RefRestrictions
  private _instanceData: {previous: number|string, used?: {[key: string]: boolean}}
  maxAttempts = 10;

  constructor() {
    super()
    this.reset()
    this.allowedCodePoints(Strings.COMMON_UTF_RANGES.UTF_PRINTABLE_LATIN_IPA)
    this.validatedBy(new IsIdentifierValidator())
  }

  reset() {
    this._instanceData = {
      previous: -1,
      used: {}
    }
  }

  getDefaults(): RefRestrictions {
    return {
      notNull: true,
      arrayIndex: null,
      quoted: null,
      incremental: null,
      unique: null,
      minLength: {value: 1, inclusive:true},
      maxLength: {value: 25, inclusive:true},
    }
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

  gen(): any {
    let data:any = null
    if (!super._provideNull()) {
      let R = this.restrictions
      let v:any
      let attempts = this.maxAttempts
      this._validator.restrictions = this.restrictions
      do {
        if (R.arrayIndex) {
          v = IdentifierGen.nextArrayIndex(R.incremental, <number>this._instanceData.previous);
        } else {
          v = super.gen()
          // v = RefGen.nextValidStringIdentifier(super, R.quoted, <string>this._instanceData.previous)
        }
      } while (!this._validator.isValid(v) || (R.unique && (this._instanceData.used[v] == true && --attempts )  ))
      if(attempts === 0){
        throw new ConfigurationError("Could not generate valid identifier values within the constraints provided.")
      }
      this._instanceData.used[v] = true
      this._instanceData.previous = v
      data = v
    }
    return data
  }

  static nextArrayIndex(incremental: boolean, previous: number) {
    let v:number
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




