import {DataGen} from "./data-gen";
import {StringRestrictions} from "validator/index";
import {FluentStringRestrictions} from "../validator/restriction/restriction";
import {Strings} from "../validator/string";


export class StringGen extends DataGen implements FluentStringRestrictions{


  restrictions:StringRestrictions

  constructor() {
    super()
  }

  getDefaults():StringRestrictions {
    return {
      isString: true,
      minLength: {value: 0, inclusive:true},
      maxLength: {value: 1024, inclusive:true},
      allowedCodePoints: [0x9, 0x14, 0x20, 0x7E],
      matchesRegex: null,
      notMatchesRegex: null
    }
  }


  minLength(value: number, inclusive?: boolean): this {
    this.restrictions.minLength = { value:value, inclusive:inclusive !== false  }
    return this
  }

  maxLength(value: number, inclusive?: boolean): this {
    this.restrictions.maxLength = { value:value, inclusive:inclusive !== false  }
    return this
  }

  matchesRegex(value: string|RegExp, negate?: boolean): this {
    let R = this.restrictions
    R.matchesRegex = R.matchesRegex || []
    R.matchesRegex.push({value:value, negate:negate === true})
    return this
  }

  notMatchesRegex(value: string|RegExp, negate?: boolean): this {
    let R = this.restrictions
    R.notMatchesRegex = R.notMatchesRegex || []
    R.notMatchesRegex.push({value:value, negate:negate === true})
    return this
  }

  allowedCodePoints(codePointRanges:number[]) {
    this.restrictions.allowedCodePoints = codePointRanges
    return this
  }

  allowedChars(values: string[]): this {
    this.restrictions.allowedChars = values
    return this
  }


  gen():any {
    let data = super.gen()
    if (data !== null) {
      let { start, range} = this._range()
      let charCount = start + Math.floor(Math.random() * range)
      if(this.restrictions.allowedChars){
        data = StringGen.generateStringFromChars(charCount, this.restrictions.allowedChars);
      } else {
        data = StringGen.generateStringFromCodePoints(charCount, this.restrictions.allowedCodePoints);
      }
    }
    return data
  }


  static generateStringFromChars(charCount: number, allowedChars:string[]) {
    let data:string[] = new Array(charCount)
    for (let i = 0; i < charCount; i++) {
      data[i] = StringGen._generateChar(allowedChars)
    }
    return data.join('')
  }

  static generateStringFromCodePoints(charCount: number, allowedCodePoints?:number[]) {
    let data:string[] = new Array(charCount)
    for (let i = 0; i < charCount; i++) {
      data[i] = StringGen._generateCodePoint(allowedCodePoints || Strings.COMMON_UTF_RANGES.UTF_PRINTABLE_PLANE_BMP)
    }
    return data.join('')
  }

  private static _generateChar(allowed: string[]) {
    let L = allowed.length
    let randomIndex = Math.floor(Math.random() * L)
    return allowed[randomIndex]
  }

  private _range():{start:number, range:number}{
    let range:number
    let {value: max, inclusive: maxI} = this.restrictions.maxLength
    let {value: min, inclusive: minI} = this.restrictions.minLength
    if(maxI === false){
      max--
    }
    if(minI === false){
      min++
    }
    range = max - min
    return {start: min, range:range}
  }

  private static _generateCodePoint(allowedCodePoints: number[]) {
    let rand = Math.random()
    let allowedPairs = 0
    let L = allowedCodePoints.length
    let pointers:number[] = []
    for (let i = 0; i < L; i += 2) {
      allowedPairs += allowedCodePoints[i + 1] - allowedCodePoints[i] + 1
      pointers.push(allowedPairs)
    }
    let choiceIndex = Math.floor(rand * allowedPairs)
    let randomCodePoint:number
    for (let i = 0; i < pointers.length; i++) {
      if (choiceIndex < pointers[i]) {
        let randomRangeMin = allowedCodePoints[i * 2]
        let correction = i > 0 ? pointers[i - 1] : 0
        randomCodePoint = choiceIndex - correction + randomRangeMin
        break
      }
    }
    return String.fromCodePoint(randomCodePoint)
  }
}




