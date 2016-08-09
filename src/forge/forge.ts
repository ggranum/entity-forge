import {ValidateFailedError} from "./validate-failed-error";
import {ConfigurationError} from "./configuration-error";
import {Restriction, ValidatorIF, ValidatorErrorsIF, Validator, CommonRestrictions} from "validator/index";
import {DataGen} from "generate/index";



export interface BeforeIgnitionEvent {
  key:string
  forge:Forge
  restrictions:CommonRestrictions
}

let beforeIgnitionListeners = {}
export class Forge {
  private _defaultValue: any = null
  private _lit: boolean = false
  private _immutable: boolean = false
  private _errorsAsEvents: boolean = false
  fieldName: string = null
  private parentFieldName: string = null
  private _enumerable: boolean = false
  private _transactional: boolean = false
  private _version: number = null
  private _versionFieldName: string = 'version'
  private _validator:ValidatorIF
  dataGen: DataGen
  restrictions: Restriction

  constructor() {
    this.restrictions = {}
  }

  static onBeforeIgnition(targetType: any, listenerFn: Function) {
    let ary = beforeIgnitionListeners['' + targetType] || []
    ary.push({fn: listenerFn})
    beforeIgnitionListeners[targetType] = ary
  }

  /**
   * @returns {*}
   */
  newInstance(defaultOverride: any = null) {
    return defaultOverride === null ? this.defaultValue : defaultOverride
  }

  get defaultValue() {
    return this._defaultValue
  }

  validatedBy(validator:ValidatorIF){
    this._validator = validator
  }

  getValidator():ValidatorIF{
    return this._validator
  }

  validate(value: any):ValidatorErrorsIF {
    return this.getValidator().validate(value, this.restrictions)
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

  generatedBy(generator:DataGen){
    this.dataGen = generator
  }

  /* Fluent configuration calls */

  /**
   * Initialize Forged instances/fields-values to the provided value.
   * Using this method is equivalent to calling the primary Forge method with a default value.
   * Use of this method over providing a default to the primary primary Forge method is a matter of preference.
   * @param defaultValue
   * @returns {Forge}
   */
  initTo(defaultValue: any):this {
    this._defaultValue = defaultValue;
    return this
  }

  /*****  Validations /  constraints.  ******/


  /**
   * Forged instances/fields-values will always be valid.
   * This forces newly constructed instances to check their validity state after any default and configuration values
   * are applied.
   *
   * Immutable implies neverInvalid.
   * @param msg
   * @returns {Forge}
   * @todo ggranum: Implement
   */
  neverInvalid(msg = "@validations.neverInvalid") {
    return this
  }

  /**
   * Child instances can only be created by passing a valid config object into either the #newInstance method or
   * into the constructor of a Type created from a call to #asNewable.
   *
   * ```
   * let MyModel = EF.obj({ x: EF.int() } ).immutable().asNewable()
   * let myInstance = new MyModel( { x: 100 } )
   * ```
   *
   * 'Immutable' implies 'neverInvalid'.
   *
   *
   * @param msg
   * @returns {Forge}
   * @todo ggranum: Implement
   */
  immutable(msg = "@validations.immutable") {
    this._immutable = true
    return this
  }


  /*****  Forge directives.  ******/


  /**
   * Enable transactions.
   *
   * Forge instances/values will have three methods: txnStart, txnCommit and txnAbort.
   *
   * Validations will be performed on commit. We use the term 'abort' and not 'rollback' because no modification
   * is exposed prior to the execution of commit. The transaction is simply aborted in place.
   *
   * @returns {Forge}
   * @todo ggranum: Implement
   */
  transactional() {
    this._transactional = true
    return this
  }

  /**
   * Used for field definitions in a parent model, setting this to false will cause the field to be 'hidden',
   * meaning the field will not show up when calling `for...in` loops, or calls made to Parent#getOwnPropertyNames.
   *
   * @param {boolean} isEnumerable
   * @returns {Forge}
   */
  enumerable(isEnumerable: boolean = true) {
    this._enumerable = isEnumerable
    return this
  }

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
   * Generate a new valid instance of this type.
   * @todo ggranum: Retry on invalid. Some validations will be very difficult or impossible to generate random
   * entries for and we'll just have to try a few times to get it. For example, 'matchesRegex' could be easier to
   * just keep trying at rather than spending time coding up a perfect generation function.
   */
  gen(additionalGeneratorConfig: any = null) {
    this.ignite()
    if (!this.dataGen) {
      throw new ConfigurationError("No generator for type: " + this)
    }
    if (additionalGeneratorConfig) {
      // @revisit ggranum: Find a better hack for the field/method collisions inherent in fluent JS.
      Object.keys(additionalGeneratorConfig).forEach((key)=> {
        this.dataGen['_' + key] = additionalGeneratorConfig[key]
      })
    }
    return this.dataGen.gen()
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
      let event:BeforeIgnitionEvent = {key: 'beforeIgnition', forge: this, restrictions: this.restrictions}
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
