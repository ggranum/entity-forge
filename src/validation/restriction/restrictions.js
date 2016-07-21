/**
 *
 * @type {{notNull: boolean, values: null}}
 */
const BaseRestrictions = {
  notNull: false,
  values: null
}
Object.freeze(BaseRestrictions)


/**
 * Stub for later. ObjectRestrictions will contain restrictions similar to "minOccurs/maxOccurs" in XML Schema.
 * Or maybe that will be something else. We'll see.
 *
 * @type {{notNull: boolean, values: null}}
  */
const ObjectRestrictions = Object.assign({ }, BaseRestrictions)
Object.freeze(ObjectRestrictions)
/**
 * @type {{notNull: boolean, values: null, isBoolean: true }}
 */
const BooleanRestrictions = Object.assign({isBoolean: true }, BaseRestrictions)
Object.freeze(BooleanRestrictions)
/**
 * @type {{notNull: boolean, values: null, isNumber: true, integral: false, min: Number.MIN_VALUE, max: Number.MAX_VALUE, }}
 */
const NumberRestrictions = Object.assign({
  isNumber: true,
  integral: false,
  min: Number.MIN_VALUE,
  max: Number.MAX_VALUE,
}, BaseRestrictions)
Object.freeze(NumberRestrictions)

const StringRestrictions = {
  isString: true,
  minLength: 0,
  maxLength: 1024,
  allowedCodePoints: [0x9, 0x14, 0x20, 0x7E],
  matchesRegex: null,
  notMatchesRegex: null
}
Object.freeze(StringRestrictions)
