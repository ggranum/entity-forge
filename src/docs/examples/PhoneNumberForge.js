
// 1) Subclass the base Forge
class PhoneNumberForge extends Forge{

  // 2) Define a constructor that calls super:
  constructor(defaultValue = null) {
    super(defaultValue)
  }

  // 3) Define one or more static methods that describe the related entity or entities in fluent style.
  // These will be called when defining a new field, for instance `let x = EF.myType('foo')`.
  // In this example we create two phone number types - European and North American Numbering Plan.
  // The NumberForge defines two related static forge methods: 'number' and 'int'.
  /**
   * Create a field that is a North American Numbering Plan phone number:
   */
  static nanp(defaultValue = null, msg = "@validations.phoneNumber.nanp") {
    // 4) Each call to generate an entity requires its own instance of your Forge.
    let forge = new PhoneNumberForge(defaultValue)
    // 5) provide the primary validation definition. (No, you shouldn't use this valdation to test real phone numbers.)
    let isNanp = (v) => {
      return Verify.isString(v) && v.length <= 10 && v.length > 7;
    }
    return forge.applyValidation({name: 'nanp', fn: isNanp, msg: msg, abortOnFail: true})
  }


  static emea(defaultValue = null, msg = "@validations.phoneNumber.emea") {
    // 4) Each call to generate an entity requires its own instance of your Forge.
    let forge = new PhoneNumberForge(defaultValue)
    // 5) provide the primary validation definition. (No, you shouldn't use this valdation to test real phone numbers.)
    let isEmea = (v) => {
      return Verify.isString(v) && v.length <= 12 && v.length >= 8;
    }
    return forge.applyValidation({name: 'emea', fn: isEmea, msg: msg, abortOnFail: true})
  }


  // 6) Define fluent instance methods that offer options for configuring your primary type
  allowExtraChars(allowed = "(-_.") {

  }

}
