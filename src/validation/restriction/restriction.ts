const BaseRestrictions:{notNull:boolean; values:any} = {
  notNull: false,
  values: null
}
Object.freeze(BaseRestrictions)

const ObjectRestrictions = Object.assign({ }, BaseRestrictions)
Object.freeze(ObjectRestrictions)
const BooleanRestrictions = Object.assign({isBoolean: true }, BaseRestrictions)
Object.freeze(BooleanRestrictions)
const NumberRestrictions = Object.assign({
  isNumber: true,
  integral: false,
  min: Number.MIN_VALUE,
  max: Number.MAX_VALUE,
}, BaseRestrictions)
Object.freeze(NumberRestrictions)

const StringRestrictions:{isString:boolean; minLength:number; maxLength:number; allowedCodePoints:number[]; matchesRegex:any; notMatchesRegex:any} = {
  isString: true,
  minLength: 0,
  maxLength: 1024,
  allowedCodePoints: [0x9, 0x14, 0x20, 0x7E],
  matchesRegex: null,
  notMatchesRegex: null
}
Object.freeze(StringRestrictions)

export {BaseRestrictions, BooleanRestrictions, NumberRestrictions, ObjectRestrictions,StringRestrictions}
