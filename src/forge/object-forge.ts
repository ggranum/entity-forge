import {Forge} from "./forge";
import {ObjectRestrictionDefaults} from "../validator/restriction/restriction";
import {DescendantValidator} from "./descendant-validator";
import {Validators} from "../validator/index";
import {EntityType} from "./entity-type";
import {ValidateFailedError} from "./validate-failed-error";
import {ObjectGen} from "../generate/object-gen";


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
 *    fooInstance.validate(null) //  returns error descriptor ({ notNull: { msg: "name is null" }}).
 *    fooInstance.validate('Honey Badger') // no error, returns null.
 *    fooInstance.name = 'Honey Badger' // no error
 *  ------
 *
 *  State 2 flow:
 *     - newInstance is called
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
export class ObjectForge extends Forge {
  private entityType:any = null
  private fieldDefinitions:any

  constructor(fields:any = {}, defaultValue:any = null, msg = "@validations.object.object", fieldName:string = null) {
    super(defaultValue, ObjectRestrictionDefaults)
    this.fieldDefinitions = fields || {}
    this.fieldName = fieldName
    this.applyValidation(new DescendantValidator(this), Validators.exists)
  }

  ignite() {
    if (!this.entityType) {
      this.entityType = this.createTypeDefinition()
    }
    super.ignite()
  }

  /**
   * Provide a newable instance of the data type.
   * @returns {Function} A constructor that can be newed up.
   */
  asNewable() {
    return this._getEntityType()
  }
  /**
   * Creates a new instance of the data type.
   * @returns {any}
   */
  newInstance(defaultOverride:any = null) {
    return new (this.asNewable())(defaultOverride)
  }

  _getEntityType() {
    this.ignite()
    return this.entityType
  }

  createTypeDefinition() {
    let theCtor = function(cfg = {}) {
      Object.assign(this, cfg)
    }
    // @todo ggranum: revisit - not just this, but all uses of Object.assign on prototypes.
    Object.assign(theCtor.prototype, EntityType.prototype, {
      _forge: this
    })
    EntityType.defineValidateFn(theCtor.prototype)
    this._initMemberFields(theCtor, this.defaultValue)
    return theCtor
  }

  _initMemberFields(theInstanceType:any, defaults:any) {
    let fieldDefs = this.fieldDefinitions
    Object.keys(fieldDefs).forEach((key)=> {
      let fieldForge = fieldDefs[key]
      this._defineProperty(fieldForge, theInstanceType, key, defaults ? defaults[key] : null)
    })
    // when we define all the child properties we can lock the object. This prevents arbitrary new
    // properties from being added.
    Object.freeze(theInstanceType)
  }

  /**
   * Use Object.defineProperty to create a new setter and getter for 'fieldName' on the provided
   * entity instance.
   * @param fieldForge
   * @param entityInstance Any object which should get a setter and getter for this field definition.
   * @param fieldName
   * @param defaultOverride
   * @returns {*}
   */
  _defineProperty(fieldForge:any, entityInstance:any, fieldName:string, defaultOverride:any = null) {
    fieldForge.fieldName = fieldName
    if(fieldForge.defaultValue === null){
      fieldForge.initTo(defaultOverride)
    }
    fieldForge.ignite()
    let fieldInstance = fieldForge.newInstance(defaultOverride)
    let privateFieldName = '_' + fieldName
    entityInstance.prototype[privateFieldName] = fieldInstance

    try {
      Object.defineProperty(entityInstance.prototype, fieldName, {
        configurable: false,
        enumerable: fieldForge._isEnumerable !== false,
        set: fieldForge.forgeSetter(privateFieldName),
        get: fieldForge.forgeGetter(privateFieldName)
      })
    } catch(e){
      debugger
      throw e
    }
  }

  forgeSetter(privateFieldName:string){
    let fieldForge = this
    return function (value:any) {
      if(value && !value._forge){
        value = fieldForge.newInstance(value)
      }
      let r = fieldForge.validate(value)
      if (r == null) {
        this[privateFieldName] = value
      } else {
        throw new ValidateFailedError(r.message, r)
      }
    }
  }

  /**********************   Fluent config methods.  **********************/

  /**
   * Create an ObjectForge. The Object forge contains child Forges as fields, including other Object forges.
   * @param fields
   * @param defaultValue
   * @param msg
   * @param fieldName
   * @returns {ObjectForge}
   */
  static obj(fields:any = {}, defaultValue:any = null, msg = "@validations.object.object", fieldName:string = '') {
    return new ObjectForge(fields, defaultValue, msg, fieldName)
  }
}



Forge.onBeforeIgnition(ObjectForge, function (event:any) {
  let forge = event.forge
  let childFields = {}
  Object.keys(forge.fieldDefinitions).forEach((fieldName)=>{
    let fieldDef = forge.fieldDefinitions[fieldName]
    childFields[fieldName] = fieldDef.dataGen
  })
  let dataGen = new ObjectGen(forge.restrictions).base(()=> forge.newInstance()).childFields(childFields)
  forge.dataGen = dataGen
  forge.gen = () => dataGen.gen()
})

