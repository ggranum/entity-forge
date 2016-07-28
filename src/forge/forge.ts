import {CommonRestrictionDefaults} from "../validation/restriction/restriction";
import {Checks} from "../check/index";
import {Check} from "../check/check";
import {ValidateFailedError} from "./validate-failed-error";
import {ExistsValidator} from "../validation/object";
import {ConfigurationError} from "./configuration-error";
import {Validator} from "../validation/validator";
import {DataGen} from "../generate/data-gen";


let beforeIgnitionListeners = {}
export class Forge {
  private _defaultValue:any = null
  private _lit:boolean = false
  private _immutable:boolean = false
  private _errorsAsEvents:boolean = false
  fieldName:string = null
  private parentFieldName:string = null
  private _enumerable:boolean = false
  private _transactional:boolean = false
  private _version:number = null
  private _versionFieldName:string = 'version'
  private dataGen:DataGen
  restrictions:any
  _check:Check

  constructor(defaultValue:any = null, restrictions:any = null) {
    this._defaultValue = defaultValue
    this.restrictions = Object.assign({}, CommonRestrictionDefaults, restrictions)
  }

  static onBeforeIgnition(targetType:any, listenerFn:Function) {
    let ary = beforeIgnitionListeners['' + targetType] || []
    ary.push({fn: listenerFn})
    beforeIgnitionListeners[targetType] = ary
  }

  /**
   * @returns {*}
   */
  newInstance(defaultOverride:any = null) {
    return defaultOverride === null ? this.defaultValue : defaultOverride
  }

  /**
   * @param {Validator} validation
   * @param {Validator[]} preconditions
   * @returns {Forge}
   */
  applyValidation(validation:Validator, ...preconditions:Validator[]):this {
    if (!this._check) {
      this._check = Checks.any()
    }
    this._check.add(validation, ...preconditions)
    return this
  }

  /**
   * @param {Check} check
   * @returns {Forge}
   */
  applyCheck(check:Check) {
    if (!this._check) {
      this._check = check
    } else {
      this._check.addConstraints(check.constraints)
    }
    return this
  }

  get defaultValue() {
    return this._defaultValue
  }

  validate(value:any) {
    return this._check.validate(value)
  }

  forgeSetter(privateFieldName:string) {
    let fieldForge = this
    return function (value:any) {
      let r = fieldForge.validate(value)
      if (r == null) {
        this[privateFieldName] = value
      } else {
        throw new ValidateFailedError(r.message, r)
      }
    }
  }

  forgeGetter(privateFieldName:string) {
    return function () {
      return this[privateFieldName]
    }
  }


  /* Fluent configuration calls */

  static any(){
    return new Forge()
  }

  /**
   * Initialize Forged instances/fields-values to the provided value.
   * Using this method is equivalent to calling the primary Forge method with a default value.
   * Use of this method over providing a default to the primary primary Forge method is a matter of preference.
   * @param defaultValue
   * @returns {Forge}
   */
  initTo(defaultValue:any) {
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


  /**
   * Forged instances/fields-values cannot be set to null or undefined.
   * @param msg
   * @returns {*}
   */
  notNull(msg:string = "@validations.notNull"):this {
    this.restrictions.notNull = true
    return this.applyValidation(new ExistsValidator())
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
  enumerable(isEnumerable:boolean = true) {
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
  version(version:number = 1, fieldName:string = "version") {
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
  gen(additionalGeneratorConfig:any = null) {
    this.ignite()
    if (!this.dataGen) {
      throw new ConfigurationError("DataGen package not loaded.")
    }
    if (additionalGeneratorConfig) {
      // @revisit ggranum: Find a better hack for the field/method collisions inherent in fluent JS.
      Object.keys(additionalGeneratorConfig).forEach((key)=>{
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
      this.fireEvent(beforeIgnitionListeners, {key: 'beforeIgnition', forge: this})
      if (this.restrictions.notNull && this.defaultValue == null) {
        throw new ConfigurationError("Cannot create forge: default value is null but null is not allowed. ")
      }
      this._lit = true
      Object.freeze(this)
    }
  }

  fireEvent(listeners:any, event:any) {
    let fail = false
    let listenerAry:any = listeners['' + this.constructor] || []
    listenerAry.forEach((listener:any)=> {
      if (listener.fn(event) === false) {
        fail = true
      }
    })
    return fail !== false
  }
}
