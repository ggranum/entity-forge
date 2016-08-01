import {Validator, Validators, IsOneOfValidator, CommonRestrictions, FluentCommonRestrictions} from "validator/index";
import {Constraint} from "./constraint";


/**
 * A 'Check' is essentially a set of Validations that perform a composite validation operation.
 *
 * Consider the case where an input field is optional, such as an alternate phone number. It is valid when:
 *
 * 1) It is empty (null, undefined or empty string)
 * 2) It is a valid phone number.
 *
 * A phone number validation should not assume null is an allowed value.
 *
 * If phone numbers were but a rare example of this occurring we would simply add an 'allowEmpty' parameter to the
 * validator for phone numbers and move on with life. However, it is actually quite common to have a set of
 * preconditions that fail, but their failure doesn't imply our ultimate (primary) validation has itself failed.
 *
 *
 * Validating 'isObject' or 'isFunction' (or any other 'is{Type}' test) on a null or undefined value is ambiguous
 * when null is allowed.
 *
 * A null value might sometimes be considered equal to an array with zero items, or an Object with no properties.
 *
 *
 *
 */
export class Check implements FluentCommonRestrictions {

  _autoInit: boolean
  restrictions: CommonRestrictions = {}
  private constraints: any[]
  private _initialized: boolean

  constructor(autoInit?: boolean) {
    this.constraints = []
    this._autoInit = autoInit !== false
  }

  static any(): Check {
    return new Check()
  }

  autoInit(value?: boolean): this {
    this._autoInit = value !== false
    return this
  }

  add(primaryValidation: Validator, ...preconditions: Validator[]) {
    this.constraints.push(new Constraint(primaryValidation, ...preconditions))
  }

  private addConstraints(check: Check) {
    this.constraints.push(check.constraints)
  }

  isValid(value: any) {
    return this.validate(value) === null
  }

  validate(value: any): any {
    let results: any = null
    let failed = false
    this.constraints.forEach((test) => {
      let r = test.validate(value)
      if (r != null) {
        failed = true
        results = Object.assign(results || {}, r)
      }
    })
    return results
  }

  notNull(): this {
    this.restrictions.notNull = true
    return this._init()
  }

  isObject(): this {
    this.restrictions.isObject = true
    return this._init()
  }

  isBoolean(): this {
    this.restrictions.isBoolean = true
    return this._init()
  }

  isFunction(): this {
    this.restrictions.isFunction = true
    return this._init()
  }

  isOneOf(values: any[]): this {
    this.restrictions.isOneOf = values
    return this._init()
  }

  /**
   * Internal method. See source for use.
   * @returns {Check}
   * @private
   */
  _init(): this {
    this._initialized = false
    if (this._autoInit) {
      this.init()
    }
    return this
  }

  /**
   * Initialize this Check. Calling this method when autoInit is true will not harm anything, but doing so will
   * waste some cycles.
   *
   * Do not override this method for custom initialization. Override `#_doInit` instead.
   * @returns {Check} The initialized check.
   */
  init(): this {
    if (!this._initialized) {
      this.constraints = []
      this._doInitPrivate()
      this._doInit()
      this._initialized = true
    }
    return this
  }

  /**
   * Override me.
   *
   * This method isn't intended to be private, just not called directly from consumers. E.g. protected in Java land.
   */
  _doInit() {  }

  /**
   * Separated into a private and public version so that we can throw an error if _doInit isn't implemented.
   * @private
   */
  private _doInitPrivate() {
    // @todo ggranum: If notNull is true we can drop the notNull precondition from all the following validations.
    if (this.restrictions.notNull) {
      this.add(Validators.notNull)
    }
    if (this.restrictions.isObject) {
      this.add(Validators.isObject, Validators.notNull)
    }
    if (this.restrictions.isFunction) {
      this.add(Validators.isFunction, Validators.notNull)
    }
    if (this.restrictions.isBoolean) {
      this.add(Validators.isBoolean, Validators.notNull)
    }
    if (this.restrictions.isOneOf) {
      this.add(new IsOneOfValidator(this.restrictions.isOneOf), Validators.notNull)
    }
  }
}
