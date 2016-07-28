import {Forge} from "./forge";
import {StringRestrictionDefaults} from "../validator/restriction/restriction";
import {Strings} from "../validator/string";
import {Checks} from "../check/index";
import {StringCheck} from "../check/string-check";
import {StringGen} from "../generate/string-gen";
export class StringForge extends Forge{

  _check:StringCheck

  constructor(defaultValue:string = null, msg = "@validations.string.string") {
    super(defaultValue, StringRestrictionDefaults)
    this.restrictions.allowedCodePoints = Strings.COMMON_UTF_RANGES.UTF_PLANE_BMP
    this.restrictions.minLength = null
    this.restrictions.maxLength = null
    this._check = Checks.string()
  }

  static string(defaultValue:string = null, msg = "@validations.string.string") {
    return new StringForge(defaultValue, msg)
  }


  notNull(msg:string = "@validations.notNull"):this {
    if(this.defaultValue === null){
      this.initTo("")
    }
    super.notNull(msg)
    return this
  }

  ascii(){
    this.restrictions.allowedCodePoints = Strings.COMMON_UTF_RANGES.PRINTABLE_ASCII
    return this
  }

  /**
   * Inclusive
   * @param min
   * @param msg
   * @returns {*}
   */
  minLength(min:number, msg = "@validations.string.minLength"):this {
    this.restrictions.minLength = min
    this._check.minLength(min)
    return this
  }

  /**
   * Exclusive.
   * @param max
   * @param msg
   * @returns {*}
   */
  maxLength(max:number, msg = "@validations.string.maxLength"):this {
    this.restrictions.maxLength = max
    this._check.maxLength(max)
    return this
  }

  allowCodePoints(codePointRanges = Strings.COMMON_UTF_RANGES.UTF_PRINTABLE_PLANE_BMP, msg = "@validations.string.allowedCharacterRange") {
    this.restrictions.allowedCodePoints = codePointRanges
    this._check.allowCodePoints(codePointRanges)
    return this
  }
}


Forge.onBeforeIgnition(StringForge, function (event:any) {
  let dataGen = new StringGen(event.forge.restrictions)
  event.forge.dataGen = dataGen
  event.forge.gen = () => dataGen.gen()
})

