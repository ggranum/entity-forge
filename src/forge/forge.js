"use strict"

/**
 * State 1: Defining a new data type:
 *    let EF = EntityForge
 *    let Foo = EF.obj("Foo", { name : EF.string().minLength(1).maxLength(25) }).notNull().asNewable()
 *
 * State 2: Creating an instance of a data type and setting values:
 *    let fooInstance = new Foo()
 *    fooInstance.name = null // throws validation error
 *    fooInstance.name = '' // throws validation error
 *    fooInstance.name = 'Narwhal' // no error
 *
 * State 3: Calling validate on an instance of a data type (e.g. 'Foo', above).
 *    let fooInstance = new Foo()
 *    fooInstance.validate() // throws error, name is null.
 *    fooInstance.name = 'Honey Badger' // no error
 *    fooInstance.validate() // no error
 *
 *  ------
 *
 *  State 2 flow:
 *     - newInstance is called
 *     - - optional config object used as defaultValue.
 *     - - If defaultValue is absent use the value provided by 'defaultValue' getter instead.
 *     - - If defaultValue still undefined , create empty object.
 *    <- - If defaultValue is empty and empty values are allowed, set current value to the empty object and return.
 *     - - iterate through defined child fields, performing this process on each.
 *    <- - return the new instance
 *
 *     ======
 *     - set {value} is called
 *     - -
 */

let beforeIgnitionListeners = {}
class Forge {

  constructor(defaultValue = null, restrictions = null) {
    this._defaultValue = defaultValue
    this._lit = false
    this._immutable = false
    this._errorsAsEvents = false
    this.fieldName = null
    this.parentFieldName = null
    this.restrictions = Object.assign({}, BaseRestrictions, restrictions)
  }

  static onBeforeIgnition(targetType, listenerFn) {
    let ary = beforeIgnitionListeners[targetType] || []
    ary.push({fn: listenerFn})
    beforeIgnitionListeners[targetType] = ary
  }

  /**
   * @returns {*}
   */
  newInstance(defaultOverride = null) {
    return defaultOverride === null ? this.defaultValue : defaultOverride
  }

  /**
   * @param {Validator} validation
   * @param {Validator[]} preconditions
   * @returns {Forge}
   */
  applyValidation(validation, ...preconditions) {
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
  applyCheck(check) {
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

  validate(value) {
    return this._check.validate(value)
  }

  forgeSetter(privateFieldName) {
    let fieldForge = this
    return function (value) {
      let r = fieldForge.validate(value)
      if (r == null) {
        this[privateFieldName] = value
      } else {
        throw new ValidateFailedError(r.message, r)
      }
    }
  }

  forgeGetter(privateFieldName) {
    return function () {
      return this[privateFieldName]
    }
  }


  /* Fluent configuration calls */

  /**
   * Initialize Forged instances/fields-values to the provided value.
   * Using this method is equivalent to calling the primary Forge method with a default value.
   * Use of this method over providing a default to the primary primary Forge method is a matter of preference.
   * @param defaultValue
   * @returns {Forge}
   */
  initTo(defaultValue) {
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
  notNull(msg = "@validations.notNull") {
    this.restrictions.notNull = true
    return this.applyValidation(new ExistsValidator())
  }

  /*****  Forge directives.  ******/

  /**
   * Enable exception-based validation. Any validation failure will immediately throw an exception up to the
   * calling line.
   *
   * Enabled by default.
   * @returns {Forge}
   * @todo ggranum: Implement
   */
  throwOnFail(doThrow = true) {
    return this
  }

  /**
   *
   * @param event
   * @returns {Forge}
   * @todo ggranum: Implement
   */
  eventOnFail(event = null) {
    return this
  }


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
  enumerable(isEnumerable = true) {
    this._isEnumerable = isEnumerable
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
  version(version = 1, fieldName = "version") {
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
  gen(additionalGeneratorConfig = null) {
    this.ignite()
    if (!this.dataGen) {
      throw new ConfigurationError("DataGen package not loaded.")
    }
    if (additionalGeneratorConfig) {
      Object.assign(this.dataGen, additionalGeneratorConfig)
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

  fireEvent(listeners, event) {
    let fail = false
    let listenerAry = listeners[this.constructor] || []
    listenerAry.forEach((listener)=> {
      if (listener.fn(event) === false) {
        fail = true
      }
    })
    return fail !== false
  }
}
