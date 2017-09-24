import {ConfigurationError} from "./configuration-error";
import {EntityType} from "./entity-type";
import {ValidateFailedError} from "./validate-failed-error";
import {EntityResolver} from "./store/resolver";
import {CommonRestrictions} from "../validator/common-validator";
import {ValidatorErrorsIF, ValidatorIF} from "../validator/validator";
import {DataGen} from "../generate/data-gen";
import {Restriction} from "../validator/base-validator";


export interface BeforeIgnitionEvent {
  key: string
  forge: Forge
  restrictions: CommonRestrictions
}


export interface ForgeCreationTimeIF {
  clone(): this

  validatedBy(validator: ValidatorIF): void

  getValidator(): ValidatorIF

  generatedBy(generator: DataGen): void

  getGenerator(): DataGen
}

export interface ForgeIgnitionTimeIF {
  forgeSetter(privateFieldName: string): Function

  forgeGetter(privateFieldName: string): Function

  ignite(): void
}

export interface ForgeEntityInstanceIF {
  validate(value: any): any

  gen(): EntityType

  newInstance(defaultOverride?: any, parent?: EntityType): EntityType
}

export interface ForgePropertyDescriptorIF {
  initialValue: any
  privateKey: string;
  descriptor: PropertyDescriptor
}


export interface CompositeForgeIF extends ForgeEntityInstanceIF {
  _entityType: typeof EntityType
  _fieldDefinitions: { [key: string]: Forge }
}


let beforeIgnitionListeners: { [key: string]: { fn: Function }[] } = {}

const thisHack = function (something: any): any {
  return something;
}

export class Forge {

  static DEFAULT_RESOLVER: EntityResolver
  static GENERATED_BY: Object
  _resolver: EntityResolver
  _lit: boolean = false
  _isEnumerable: boolean = true
  _generatedBy: DataGen
  fieldName: string | null= null
  parent: CompositeForgeIF
  restrictions: Restriction
  private _version: number | null = null
  private _versionFieldName: string = 'version'
  private _validator: ValidatorIF

  constructor() {
    this.restrictions = {}
    this._defaultValue = null
  }

  private _defaultValue: any = null

  get defaultValue() {
    return this._defaultValue
  }

  static generatedByType(type: Object) {
    this.GENERATED_BY = type
  }

  static onBeforeIgnition(targetType: any, listenerFn: Function) {
    let ary: { fn: Function }[] = beforeIgnitionListeners['' + targetType] || []
    ary.push({fn: listenerFn})
    beforeIgnitionListeners[targetType] = ary
  }

  getResolver() {
    return this._resolver || (<any>Forge.constructor)['DEFAULT_RESOLVER']
  }

  setResolver(resolver: EntityResolver): void {
    this._resolver = resolver
  }

  clone(): this {
    let instance = this
    let ctor: any = instance.constructor
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

  validatedBy(validator: ValidatorIF): void {
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

  //noinspection JSMethodCanBeStatic
  /**
   * Wrap values with forge magic.
   *
   * Forge implementations that produce non-primitive values should override this method.
   */
  wrap(value: any): any {
    return value
  }

  forgeSetter(privateFieldName: string) {
    let fieldForge = this
    /* @note ggranum: apparently typescript compiles the 'this' out of the method params? */
    return function (this: any, value: any): void {
      let r = fieldForge.validate(value)
      if (r == null) {
        this[privateFieldName] = fieldForge.wrap(value);
      } else {
        throw new ValidateFailedError("Validation Failed for " + privateFieldName + ': ' + r.toString(), r)
      }
    }
  }

  forgeGetter(privateFieldName: string) {
    return function (this: any): any {
      return this[privateFieldName];
    }
  }

  forgeProperty(): ForgePropertyDescriptorIF {
    this.ignite()
    let privateKey = '_' + this.fieldName

    return {
      initialValue: this,
      privateKey  : privateKey,
      descriptor  : {
        configurable: false,
        enumerable  : this._isEnumerable,
        set         : this.forgeSetter(privateKey),
        get         : this.forgeGetter(privateKey)
      }
    }

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
        if ((<any>this.constructor)['GENERATED_BY']) {
          this._generatedBy = (<any>this.constructor)['GENERATED_BY'].instance()
        } else {
          throw new ConfigurationError("No generator for type: " + this)
        }
      }
      let event: BeforeIgnitionEvent = {key: 'beforeIgnition', forge: this, restrictions: this.restrictions}
      this.fireEvent(beforeIgnitionListeners, event)
      this._lit = true
      Object.freeze(this)
    }
  }

  fireEvent(listeners: any, event: any) {
    let fail = false
    let listenerAry: any = listeners['' + this.constructor] || []
    listenerAry.forEach((listener: any) => {
      if (listener.fn(event) === false) {
        fail = true
      }
    })
    return fail !== false
  }

  validate(value: any): ValidatorErrorsIF | null {
    let validator = this.getValidator();
    let R = Object.assign({}, validator.restrictions, this.restrictions)
    return validator.validate(value, R)
  }


  /**
   * Generate a new valid instance of this type.
   *
   * Note that this class's version of the #gen method produces primitives; by definition these cannot be
   * validated unless the are assigned to a field on some parent object.
   *
   *
   */
  gen() {
    this.ignite()
    return this._generatedBy.gen(this.restrictions)
  }

  newInstance(defaultOverride?: any, parent?: EntityType) {
    return defaultOverride === undefined ? this.defaultValue : defaultOverride
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


}
