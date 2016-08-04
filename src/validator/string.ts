import {Validator} from "./validator";

export let Strings:{COMMON_UTF_RANGES:{ASCII:number[]; PRINTABLE_ASCII:number[]; UTF_PLANE_BMP:number[]; UTF_PRINTABLE_LATIN_IPA:any; UTF_PRINTABLE_PLANE_BMP:any}};
Strings = {
  COMMON_UTF_RANGES: {
    ASCII: [0, 127],
    PRINTABLE_ASCII: [0x9, 0x14, 0x20, 0x7E],
    // See https://en.wikibooks.org/wiki/Unicode/Character_reference/D000-DFFF for explanation of middle gap.
    UTF_PLANE_BMP: [0x00, 0xD800, 0xE000, 0xFFFF],
    UTF_PRINTABLE_LATIN_IPA: null,
    UTF_PRINTABLE_PLANE_BMP: null
  }
}

Strings.COMMON_UTF_RANGES.UTF_PRINTABLE_LATIN_IPA = Strings.COMMON_UTF_RANGES.PRINTABLE_ASCII.concat([0xA1, 0x24F])
Strings.COMMON_UTF_RANGES.UTF_PRINTABLE_PLANE_BMP = Strings.COMMON_UTF_RANGES.UTF_PRINTABLE_LATIN_IPA.concat([0x25F, 0xD800, 0xE000, 0XFFFF])

Object.freeze(Strings.COMMON_UTF_RANGES)



export class IsStringValidator extends Validator {
  isValid(value:any):boolean {
    return (typeof value === 'string' || value instanceof String)
  }
}
Object.assign(IsStringValidator.prototype, {
  ordinal: 10,
  name: 'isString',
  message: '@restriction.string'
})


export class MaxLengthValidator extends Validator {
  constructor(maxLength:number, inclusive:boolean = true) {
    super({maxLength: maxLength, inclusive: inclusive})
  }

  isValid(value:any):boolean {
    return this.restrictions.inclusive ? value.length <= this.restrictions.maxLength : value.length < this.restrictions.maxLength
  }
}
Object.assign(MaxLengthValidator.prototype, {
  ordinal: 100,
  name: 'maxLength',
  args: {
    maxLength: 1024,
    inclusive: true
  },
  message: '@restriction.maxLength'
})


export class MinLengthValidator extends Validator {
  constructor(minLength:number, inclusive:boolean = true) {
    super({minLength: minLength, inclusive: inclusive})
  }

  isValid(value:any):boolean {
    return this.restrictions.inclusive ? value.length >= this.restrictions.minLength : value.length > this.restrictions.minLength
  }
}
Object.assign(MinLengthValidator.prototype, {
  ordinal: 100,
  name: 'minLength',
  args: {
    minLength: 1,
    inclusive: true
  },
  message: '@restriction.minLength'
})

export class AllowedCharactersValidator extends Validator {
  constructor(allowedChars:string[]) {
    super({allowedChars: allowedChars})
  }

  isValid(value: any): boolean {
    let result = true
    let L = value.length
    for (let i = 0; i < L; i++) {
      result = this.isCharInRange(value.charAt(i), this.restrictions.allowedChars)
      if (!result) {
        break
      }
    }
    return result
  }

  //noinspection JSMethodCanBeStatic
  isCharInRange(char:string, allowed:string[]) {
    return allowed.indexOf(char) >= 0
  }
}

export class CodePointsValidator extends Validator {
  constructor(codePointRanges = Strings.COMMON_UTF_RANGES.UTF_PRINTABLE_PLANE_BMP) {
    super({codePointRanges: codePointRanges})
  }

  isValid(value:any):boolean {
    let result = true
    let L = value.length
    for (let i = 0; i < L; i++) {
      result = this.isCharInRange(value.codePointAt(i), this.restrictions.codePointRanges)
      if (!result) {
        break
      }
    }
    return result
  }

  //noinspection JSMethodCanBeStatic
  /**
   *
   * @param codePoint See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt
   * @param codePointsAry An array of range pairs. `codePoint` is checked against each 'from, to' pair using
   * inclusive/inclusive comparison.
   * @returns {boolean} True if `codePoint` can be found within the range of any of the provided codePoint pairs.
   */
  isCharInRange(codePoint:number, codePointsAry:number[]) {
    let i:number, L:number, min:number, max:number
    let isInRange = false
    for (i = 0, L = codePointsAry.length; i < L; i += 2) {
      min = codePointsAry[i]
      max = codePointsAry[i + 1]
      if (codePoint >= min && codePoint <= max) {
        isInRange = true
        break
      }
    }
    return isInRange
  }
}
Object.assign(CodePointsValidator.prototype, {
  ordinal: 100,
  name: 'codePoint',
  args: {
    codePointRanges: []
  }
})




