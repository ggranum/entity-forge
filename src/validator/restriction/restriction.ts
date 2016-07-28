
export interface CommonRestrictions {notNull: boolean; values: any}
export const CommonRestrictionDefaults: CommonRestrictions = {
  notNull: false,
  values: null
}

export interface ObjectRestrictions extends CommonRestrictions {}
export const ObjectRestrictionDefaults:ObjectRestrictions = Object.assign({}, CommonRestrictionDefaults)

export interface BooleanRestrictions extends CommonRestrictions {}
export const BooleanRestrictionDefaults:BooleanRestrictions = Object.assign({isBoolean: true}, CommonRestrictionDefaults)

export interface NumberRestrictions extends CommonRestrictions {
  isNumber: boolean
  integral: boolean
  min: number
  max: number
}
export const NumberRestrictionDefaults:NumberRestrictions = Object.assign({
  isNumber: true,
  integral: false,
  min: Number.MIN_VALUE,
  max: Number.MAX_VALUE,
}, CommonRestrictionDefaults)


export interface StringRestrictions extends CommonRestrictions{
  isString: boolean
  minLength: number
  maxLength: number
  allowedCodePoints: number[]
  matchesRegex: any
  notMatchesRegex: any
}

export const StringRestrictionDefaults: StringRestrictions = Object.assign({
  isString: true,
  minLength: 0,
  maxLength: 1024,
  allowedCodePoints: [0x9, 0x14, 0x20, 0x7E],
  matchesRegex: null,
  notMatchesRegex: null
}, CommonRestrictionDefaults)
