import {DataGen} from "./data-gen";
import {Strings, StringRestrictionsFluent, StringRestrictions} from "@entity-forge/validator";


export class StringGen extends DataGen implements StringRestrictionsFluent {


  restrictions: StringRestrictions

  constructor() {
    super()
  }

  getDefaults(): StringRestrictions {
    return {
      isString: true,
      minLength: {value: 0, inclusive: true},
      maxLength: {value: 1024, inclusive: true},
      allowedChars: null,
      allowedCodePoints: Strings.COMMON_UTF_RANGES.UTF_PRINTABLE_PLANE_BMP,
      matchesRegex: null,
      notMatchesRegex: null
    }
  }


  notNull(value?: boolean): this {
    this.restrictions.notNull = value !== false
    return this
  }

  isString(value?: boolean): this {
    this.restrictions.isString = value !== false
    return this
  }

  allowedChars(values: string[]): this {
    this.restrictions.allowedChars = values
    return this
  }

  allowedCodePoints(values: number[]): this {
    this.restrictions.allowedCodePoints = values
    return this
  }

  minLength(value: number, inclusive?: boolean): this {
    this.restrictions.minLength = {value: value, inclusive: inclusive !== false}
    return this
  }

  maxLength(value: number, inclusive?: boolean): this {
    this.restrictions.maxLength = {value: value, inclusive: inclusive !== false}
    return this
  }

  matchesRegex(value: string|RegExp, negate?: boolean): this {
    let R = this.restrictions
    R.matchesRegex = R.matchesRegex || []
    R.matchesRegex.push({value: value, negate: negate === true})
    return this
  }

  notMatchesRegex(value: string|RegExp, negate?: boolean): this {
    let R = this.restrictions
    R.notMatchesRegex = R.notMatchesRegex || []
    R.notMatchesRegex.push({value: value, negate: negate === true})
    return this
  }


  doGen(R?: StringRestrictions): any {
    let data: string
    let {start, range} = StringGen._range(R)
    let charCount = start + Math.floor(Math.random() * range)
    if (R.allowedChars) {
      data = StringGen.generateStringFromChars(charCount, R.allowedChars);
    } else {
      data = StringGen.generateStringFromCodePoints(charCount, R.allowedCodePoints, R);
    }
    return data
  }


  static generateStringFromChars(charCount: number, allowedChars: string[]) {
    let data: string[] = new Array(charCount)
    for (let i = 0; i < charCount; i++) {
      data[i] = StringGen._generateChar(allowedChars)
    }
    return data.join('')
  }

  static generateStringFromCodePoints(charCount: number, allowedCodePoints: number[], R?: StringRestrictions) {
    let str = ""
    let maxNextLen = charCount
    do {
      let ch = StringGen._generateCodePoint(allowedCodePoints)
      if (ch.length <= maxNextLen) {
        maxNextLen = maxNextLen - ch.length // decrement by the 'string' length of ch - usually 1, sometimes 2
        str = str + ch
      }
    } while (str.length < charCount)
    return str
  }

  private static _generateChar(allowed: string[]) {
    let L = allowed.length
    let randomIndex = Math.floor(Math.random() * L)
    return allowed[randomIndex]
  }

  private static _range(R: StringRestrictions): {start: number, range: number} {
    let range: number
    let {value: max, inclusive: maxI} = R.maxLength
    let {value: min, inclusive: minI} = R.minLength
    if (maxI === false) {
      max--
    }
    if (minI === false) {
      min++
    }
    range = max - min
    return {start: min, range: range}
  }

  private static _generateCodePoint(allowedCodePoints: number[]) {
    let rand = Math.random()
    let choiceIndex = Math.floor(rand * allowedCodePoints.length)
    return String.fromCodePoint(allowedCodePoints[choiceIndex])
  }
}




