class StringForge extends Forge{

  constructor(defaultValue = null, msg = "@validations.string.string") {
    super(defaultValue, StringRestrictions)
    this.restrictions.allowedCodePoints = Strings.COMMON_UTF_RANGES.UTF_PLANE_BMP
    this.restrictions.minLength = null
    this.restrictions.maxLength = null
    this._check = Checks.string()
  }

  static string(defaultValue = null, msg = "@validations.string.string") {
    return new StringForge(defaultValue, msg)
  }


  notNull(msg = "@validations.notNull") {
    if(this.defaultValue === null){
      this.initTo("")
    }
    return super.notNull(msg);
  }

  ascii(){
    this.restrictions.allowedCodePoints = Strings.COMMON_UTF_RANGES.PRINTABLE_ASCII
    return this
  }

  /**
   * Inclusive
   * @param min
   * @param msg
   * @returns {*}
   */
  minLength(min, msg = "@validations.string.minLength") {
    this.restrictions.minLength = min
    this._check.minLength(min)
    return this
  }

  /**
   * Exclusive.
   * @param max
   * @param msg
   * @returns {*}
   */
  maxLength(max, msg = "@validations.string.maxLength") {
    this.restrictions.maxLength = max
    this._check.maxLength(max)
    return this
  }

  allowCodePoints(codePointRanges = Strings.COMMON_UTF_RANGES.UTF_PRINTABLE_PLANE_BMP, msg = "@validations.string.allowedCharacterRange") {
    this.restrictions.allowedCodePoints = codePointRanges
    this._check.allowCodePoints(codePointRanges)
    return this
  }
}


Forge.onBeforeIgnition(StringForge, function (event) {
  let dataGen = new StringGen(event.forge.restrictions)
  event.forge.dataGen = dataGen
  event.forge.gen = () => dataGen.gen()
})

