"use strict"

let Strings = {
  COMMON_UTF_RANGES: {
    ASCII: [0, 127],
    PRINTABLE_ASCII: [0x9, 0x14, 0x20, 0x7E],
    UTF_PLANE_BMP: [0x00, 0xFFFF]
  }
}

Strings.COMMON_UTF_RANGES.UTF_PRINTABLE_LATIN_IPA = Strings.COMMON_UTF_RANGES.PRINTABLE_ASCII.concat([0xA1, 0x24F])
Strings.COMMON_UTF_RANGES.UTF_PRINTABLE_PLANE_BMP = Strings.COMMON_UTF_RANGES.UTF_PRINTABLE_LATIN_IPA.concat([0x25F, 0XFFFF])

Object.freeze(Strings.COMMON_UTF_RANGES)


let StringRestrictions = {
  notNull: false,
  minLength: 0,
  maxLength: 1024,
  allowedCodePoints: Strings.COMMON_UTF_RANGES.UTF_PRINTABLE_PLANE_BMP,
  matchesRegex: {},
  notMatchesRegex: {}
}

class IsStringValidator extends Validator {
  check(value) {
    return (typeof value === 'string' || value instanceof String)
  }
}
Object.assign(IsStringValidator.prototype, {
  ordinal: 10,
  name: 'isString',
  message: '@restriction.string'
})


class MaxLengthValidator extends Validator {
  constructor(maxLength, inclusive = true) {
    super({maxLength: maxLength, inclusive: inclusive})
  }

  check(value) {
    return this.args.inclusive ? value.length <= this.args.maxLength : value.length < this.args.maxLength
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


class MinLengthValidator extends Validator {
  constructor(minLength, inclusive = true) {
    super({minLength: minLength, inclusive: inclusive})
  }

  check(value) {
    return this.args.inclusive ? value.length >= this.args.minLength : value.length > this.args.minLength
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

class CodePointsValidator extends Validator {
  constructor(codePointRanges = Strings.COMMON_UTF_RANGES.UTF_PRINTABLE_PLANE_BMP) {
    super({codePointRanges: codePointRanges})
  }

  check(value) {
    let result = true
    let L = value.length
    for (let i = 0; i < L; i++) {
      result = this.isCharInRange(value.codePointAt(i), this.args.codePointRanges)
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
  isCharInRange(codePoint, codePointsAry) {
    let i, L, min, max
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




