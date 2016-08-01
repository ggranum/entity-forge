export interface RangeLimitRestriction {
  value: number,
  inclusive?: boolean
}


export interface CommonRestrictions {
  isFunction?: boolean
  isObject?: boolean
  isBoolean?: boolean
  notNull?: boolean
  isOneOf?: any[]
}

export interface FluentCommonRestrictions {
  isFunction(): this
  isObject(): this
  isBoolean(): this
  notNull(): this
  isOneOf(values: any[]): this
}


export const CommonRestrictionDefaults: CommonRestrictions = {
  isFunction: false,
  isObject: false,
  notNull: false,
  isOneOf: null
}

export interface ObjectRestrictions extends CommonRestrictions {
}
export const ObjectRestrictionDefaults: ObjectRestrictions = Object.assign({}, CommonRestrictionDefaults)

export interface BooleanRestrictions extends CommonRestrictions {
}
export const BooleanRestrictionDefaults: BooleanRestrictions = Object.assign({isBoolean: true}, CommonRestrictionDefaults)

export interface FluentNumberRestrictions {
  isNumber(): this
  isInt(): this
  min(value: number, inclusive?: boolean): this
  max(value: number, inclusive?: boolean): this
}

export interface NumberRestrictions extends CommonRestrictions {
  numeric?: boolean
  integral?: boolean
  min?: RangeLimitRestriction
  max?: RangeLimitRestriction
}
let x: NumberRestrictions = {
  numeric: true,
  integral: false,
  min: {
    value: Number.MIN_VALUE,
    inclusive: false
  },
  max: {
    value: Number.MAX_VALUE,
    inclusive: false
  },
}
export const NumberRestrictionDefaults: NumberRestrictions = Object.assign(x, CommonRestrictionDefaults)


export interface FluentStringRestrictions {
  isString(): this
  minLength(value: number, inclusive?: boolean): this
  maxLength(value: number, inclusive?: boolean): this
  allowedCodePoints(values: number[]): this
  matchesRegex(value: string|RegExp, negate?: boolean): this
  notMatchesRegex(value: string|RegExp): this
}

export interface StringRestrictions extends CommonRestrictions {
  isString?: boolean
  minLength?: RangeLimitRestriction
  maxLength?: RangeLimitRestriction
  allowedCodePoints?: number[]
  matchesRegex?: any
  notMatchesRegex?: any
}

export const StringRestrictionDefaults: StringRestrictions = Object.assign({
  isString: true,
  minLength: {value: 0, inclusive:true},
  maxLength: {value: 1024, inclusive:true},
  allowedCodePoints: [0x9, 0x14, 0x20, 0x7E],
  matchesRegex: null,
  notMatchesRegex: null
}, CommonRestrictionDefaults)
