import {ValidateFailedError} from "./validate-failed-error";
import {ConfigurationError} from "./configuration-error";
import {Restriction, ValidatorIF, ValidatorErrorsIF, Validator, CommonRestrictions} from "validator/index";
import {DataGen} from "generate/index";


export interface BeforeIgnitionEvent {
  key: string
  forge: Forge
  restrictions: CommonRestrictions
}

let beforeIgnitionListeners = {}
export class Forge {

  static GENERATED_BY: Object

  private _defaultValue: any = null
  private _lit: boolean = false
  private _version: number = null
  private _versionFieldName: string = 'version'
  private _validator: ValidatorIF
  _generatedBy: DataGen
  fieldName: string = null
  restrictions: Restriction

  constructor() {
    this.restrictions = {}
  }

  static generatedByType(type: Object) {
    this.GENERATED_BY = type
  }

  static onBeforeIgnition(targetType: any, listenerFn: Function) {
    let ary = beforeIgnitionListeners['' + targetType] || []
    ary.push({fn: listenerFn})
    beforeIgnitionListeners[targetType] = ary
  }

  clone(): this {
    let instance = this
    let ctor:any = instance.constructor
    let copy = new ctor()
    copy.defaultValue(instance.defaultValue)
    copy.validatedBy(instance.getValidator().clone())
    copy.generatedBy(instance.getGenerator().clone())
    copy._version = instance._version
    copy._versionFieldName = instance._versionFieldName
    copy.fieldName = instance.fieldName
    copy.restrictions = JSON.parse(JSON.stringify(instance.restrictions))
    copy._lit = false
    return copy
  }

  get defaultValue() {
    return this._defaultValue
  }

  validatedBy(validator: ValidatorIF) {
    this._validator = validator
  }

  getValidator(): ValidatorIF {
    return this._validator
  }

  generatedBy(generator: DataGen) {
    this._generatedBy = generator
  }

  getGenerator(): DataGen {
    return this._generatedBy
  }

  forgeSetter(privateFieldName: string) {
    let fieldForge = this
    return function (value: any) {
      let r = fieldForge.validate(value)
      if (r == null) {
        this[privateFieldName] = value
      } else {
        throw new ValidateFailedError("Validation Failed", r)
      }
    }
  }

  forgeGetter(privateFieldName: string) {
    return function () {
      return this[privateFieldName]
    }
  }

  validate(value: any): ValidatorErrorsIF {
    let R = Object.assign({}, this.getValidator().restrictions, this.restrictions)
    return this.getValidator().validate(value, R)
  }


  /**
   * Generate a new valid instance of this type.
   */
  gen() {
    this.ignite()
    return this._generatedBy.gen(this.restrictions)
  }

  /**
   * @returns {*}
   */
  newInstance(defaultOverride: any = null) {
    return defaultOverride === null ? this.defaultValue : defaultOverride
  }


  /* Fluent configuration calls */

  /**
   * Initialize Forged instances/fields-values to the provided value.
   * Using this method is equivalent to calling the primary Forge method with a default value.
   * Use of this method over providing a default to the primary primary Forge method is a matter of preference.
   * @param defaultValue
   * @returns {Forge}
   */
  initTo(defaultValue: any): this {
    this._defaultValue = defaultValue;
    return this
  }

  /*****  Validations /  constraints.  ******/

  /**
   * Sets a version number for your Forge. Instances created with the forge will also have a 'version' field.
   * The name of the version field can be set, but must be consistent between versions if you wish to use the
   * data migration facilities provided by EntityForge.
   *
   * @param {int} version
   * @param {string} fieldName
   * @returns {Forge}
   */
  version(version: number = 1, fieldName: string = "version") {
    this._version = version
    this._versionFieldName = fieldName
    return this
  }


  /**
   * Light the forge. Initialize all values, sanity check default values against constraints, ensure applied
   * constraints are not contradictory, etc.
   *
   * This freezes the Forge instance against modification. For production apps you should define your Forge, use it
   * to create an instance type (`MyType = myForge.asNewable()`) and then forget that the forge ever existed.
   *
   *
   * All but the simplest forges will need to override this method.
   */
  ignite() {
    if (!this._lit) {
      if (!this._generatedBy) {
        if (this.constructor['GENERATED_BY']) {
          this._generatedBy = this.constructor['GENERATED_BY'].instance()
        } else {
          throw new ConfigurationError("No generator for type: " + this)
        }
      }
      let event: BeforeIgnitionEvent = {key: 'beforeIgnition', forge: this, restrictions: this.restrictions}
      this.fireEvent(beforeIgnitionListeners, event)
      // if (this.restrictions.restrictions.notNull && this.defaultValue == null) {
      //   throw new ConfigurationError(`Cannot create forge for '${this.fieldName || '[unknown]'}': default value is null but null is not allowed. `)
      // }
      this._lit = true
      Object.freeze(this)
    }
  }

  fireEvent(listeners: any, event: any) {
    let fail = false
    let listenerAry: any = listeners['' + this.constructor] || []
    listenerAry.forEach((listener: any)=> {
      if (listener.fn(event) === false) {
        fail = true
      }
    })
    return fail !== false
  }
}
