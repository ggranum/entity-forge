import {ValidatorErrorsIF, CompositeValidator} from "../validator";
import {NotNullRestriction, NotNullRestrictionFluent, NotNullValidator} from "../base-validator";
import {
  LengthRangeRestrictionFluent, LengthRangeRestriction, MinLengthValidator,
  MaxLengthValidator
} from "../common-validator";
import {IsStringRestriction, IsStringRestrictionFluent, IsStringValidator} from "./is-string-validator";
import {
  AllowedCharactersRestriction,
  AllowedCharactersRestrictionFluent,
  AllowedCharactersValidator
} from "./allowed-characters-validator";
import {
  AllowedCodePointsRestriction,
  AllowedCodePointsRestrictionFluent,
  AllowedCodePointsValidator
} from "./allowed-codepoints-validator";

let rangePairsToFlatList = function(pairs: number[]): number[] {
  let allowedPairs = 0
  let L = pairs.length
  let flatIdx = 0
  let flat: number[] = []
  let j: number;
  for (let i = 0; i < L; i += 2) {
    let start = pairs[i]
    let end = pairs[i + 1]
    for (j = start; j <= end; j++) {
      if (flatIdx === 0 || (flat[flatIdx - 1] !== j)) {
        flat[flatIdx++] = j
      }
    }
  }
  return flat
}

export let Strings: {
  isHighSurrogate(charCode:number):boolean,
  rangePairsToFlatList(pairs: number[]): number[],
  COMMON_UTF_RANGES: {ASCII: number[]; PRINTABLE_ASCII: number[]; UTF_PLANE_BMP: number[]; UTF_PRINTABLE_LATIN_IPA: any; UTF_PRINTABLE_PLANE_BMP: any}};


Strings = {
  isHighSurrogate(charCode:number) {
    return  charCode >= 0xD800 && charCode <= 0xDBFF
  },
  COMMON_UTF_RANGES: {
    ASCII: rangePairsToFlatList([0, 127]),
    PRINTABLE_ASCII: rangePairsToFlatList([0x9, 0x14, 0x20, 0x7E]),
    // See https://en.wikibooks.org/wiki/Unicode/Character_reference/D000-DFFF for explanation of middle gap.
    UTF_PLANE_BMP: rangePairsToFlatList([0x00, 0xD800, 0xE000, 0xFFFF]),
    UTF_PRINTABLE_LATIN_IPA: null,
    UTF_PRINTABLE_PLANE_BMP: null
  },
  rangePairsToFlatList: rangePairsToFlatList
}

Strings.COMMON_UTF_RANGES.UTF_PRINTABLE_LATIN_IPA = Strings.COMMON_UTF_RANGES.PRINTABLE_ASCII.concat(rangePairsToFlatList([0xA1, 0x24F])).sort()
Strings.COMMON_UTF_RANGES.UTF_PRINTABLE_PLANE_BMP = Strings.COMMON_UTF_RANGES.UTF_PRINTABLE_LATIN_IPA.concat(rangePairsToFlatList([0x25F, 0xD800, 0xE000, 0XFFFF])).sort()


Object.freeze(Strings.COMMON_UTF_RANGES)


export interface StringRestrictions extends NotNullRestriction,
  IsStringRestriction,
  LengthRangeRestriction,
  AllowedCharactersRestriction,
  AllowedCodePointsRestriction {
  matchesRegex?: {value: string|RegExp, negate: boolean}[]
  notMatchesRegex?: {value: string|RegExp, negate: boolean}[]
}

export interface StringRestrictionsFluent extends NotNullRestrictionFluent,
  IsStringRestrictionFluent,
  LengthRangeRestrictionFluent,
  AllowedCharactersRestrictionFluent,
  AllowedCodePointsRestrictionFluent {
  matchesRegex(value: string|RegExp, negate?: boolean): this
  notMatchesRegex(value: string|RegExp, negate?: boolean): this
}

export class StringValidator extends CompositeValidator implements NotNullValidator,
  IsStringValidator,
  AllowedCharactersValidator,
  AllowedCodePointsValidator {

  static key = 'string'
  static message = '@restriction.string'

  restrictions: StringRestrictions

  constructor() {
    super()
    this.isString()
  }

  static string(): StringValidator {
    return new StringValidator()
  }

  notNull(value?: boolean): this {
    this.restrictions.notNull = value !== false
    return this
  }

  isString(value?: boolean): this {
    this.restrictions.isString = value !== false
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

  minLength(value: number, inclusive: boolean = true): this {
    this.restrictions.minLength = {
      value: value,
      inclusive: inclusive !== false
    }
    return this
  }

  maxLength(value: number, inclusive: boolean = true): this {
    this.restrictions.maxLength = {
      value: value,
      inclusive: inclusive !== false
    }
    return this
  }


  allowedChars(values: string[]): this {
    this.restrictions.allowedChars = values
    return this
  }

  allowedCodePoints(values: number[] = Strings.COMMON_UTF_RANGES.UTF_PRINTABLE_PLANE_BMP): this {
    this.restrictions.allowedCodePoints = values
    return this
  }


  doValidate(value: any, R: StringRestrictions): ValidatorErrorsIF {
    let chain = [
      NotNullValidator.instance(),
      IsStringValidator.instance(),
      AllowedCharactersValidator.instance(),
      AllowedCodePointsValidator.instance(),
      MinLengthValidator.instance(),
      MaxLengthValidator.instance(),
    ]
    return super.doValidateComposite(value, R, chain)
  }
}


