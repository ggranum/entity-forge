"use strict"


class ObjectForge extends Forge {

  /**
   *
   * @param fields
   * @param defaultValue
   * @param msg
   */
  constructor(fields = {}, defaultValue = null, msg = "@validations.object.object") {
    super(defaultValue, ObjectRestrictions)
    this.entityType = null
    this.fieldDefinitions = fields || {}
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
  newInstance(defaultOverride = null) {
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

  _initMemberFields(theInstanceType, defaults) {
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
  _defineProperty(fieldForge, entityInstance, fieldName, defaultOverride = null) {
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

  forgeSetter(privateFieldName){
    let fieldForge = this
    return function (value) {
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
  static obj(fields = {}, defaultValue = null, msg = "@validations.object.object", fieldName = '') {
    return new ObjectForge(fields, defaultValue, msg, fieldName)
  }
}



Forge.onBeforeIgnition(ObjectForge, function (event) {
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

