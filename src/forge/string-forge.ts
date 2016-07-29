import {Forge, BeforeIgnitionEvent} from "./forge";
import {Strings} from "../validator/string";
import {StringCheck} from "../check/string-check";
import {StringGen} from "../generate/string-gen";
import {Check} from "../check/check";
export class StringForge extends Forge{

  _check:StringCheck

  constructor(checkOverride?:Check) {
    super(checkOverride || new StringCheck().autoInit(false))
    this.allowedCodePoints(Strings.COMMON_UTF_RANGES.UTF_PLANE_BMP)
  }

  static string(defaultValue:string = null) {
    return new StringForge().initTo(defaultValue)
  }


  notNull():this {
    if(this.defaultValue == null){
      this.initTo("")
    }
    super.notNull()
    return this
  }

  ascii(){
    this.allowedCodePoints(Strings.COMMON_UTF_RANGES.PRINTABLE_ASCII)
    return this
  }

  minLength(value:number):this {
    this._check.minLength(value, true)
    return this
  }

  maxLength(max:number):this {
    this._check.maxLength(max)
    return this
  }

  allowedCodePoints(codePointRanges?:number[]) {
    this._check.allowedCodePoints(codePointRanges)
    return this
  }
}


Forge.onBeforeIgnition(StringForge, function (event:BeforeIgnitionEvent) {
  let dataGen = new StringGen(event.restrictions)
  event.forge.dataGen = dataGen
  event.forge.gen = () => dataGen.gen()
})

