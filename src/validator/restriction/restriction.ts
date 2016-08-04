export interface RangeLimitRestriction {
  value: number,
  inclusive?: boolean
}

export interface Restriction {
}

export interface NotNullRestriction extends Restriction {
  notNull?: boolean
}

export interface NotNullRestrictionFn {
  notNull(value?: boolean): this
}

export interface MinRestriction extends Restriction {
  min?: RangeLimitRestriction
}

export interface MinRestrictionFn {
  min(value: RangeLimitRestriction): this
}


export interface MinRestrictionFn {
  min(value: RangeLimitRestriction): this
}


export interface CommonRestrictions {
  isFunction?: boolean
  isObject?: boolean
  isBoolean?: boolean
  notNull?: boolean
  isOneOf?: any[]
  isNoneOf?: any[]
}

export interface FluentCommonRestrictions {
  isFunction(): this
  isObject(): this
  isBoolean(): this
  notNull(): this
  isOneOf(values: any[]): this
  isNoneOf(values: any[]): this
}


export interface ObjectRestrictions extends CommonRestrictions {
}

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


export interface FluentStringRestrictions {
  minLength(value: number, inclusive?: boolean): this
  maxLength(value: number, inclusive?: boolean): this
  allowedChars(values: string[]): this
  allowedCodePoints(values: number[]): this
  matchesRegex(value: string|RegExp, negate?: boolean): this
  notMatchesRegex(value: string|RegExp, negate?: boolean): this
}

export interface StringRestrictions extends CommonRestrictions {
  allowedChars?: string[];
  isString?: boolean
  minLength?: RangeLimitRestriction
  maxLength?: RangeLimitRestriction
  allowedCodePoints?: number[]
  matchesRegex?: {value: string|RegExp, negate: boolean}[]
  notMatchesRegex?: {value: string|RegExp, negate: boolean}[]
}

export interface UIDRestrictions {
  notNull?: boolean
}


export interface FluentRefRestrictions {
  arrayIndex(): this
  incremental(): this
  unique(): this
}


export interface RefRestrictions {
  notNull?: boolean
  arrayIndex?: boolean
  incremental?: boolean
  unique?: boolean,
  quoted?: boolean,
  minLength?: RangeLimitRestriction
  maxLength?: RangeLimitRestriction

}
