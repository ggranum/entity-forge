import {EntityType} from "./entity-type";
import {DescendantValidator} from "./descendant-validator";
import {ValidateFailedError} from "./validate-failed-error";
import {BaseForge} from "./base-forge";
import {Forge, CompositeForgeIF, ForgePropertyDescriptorIF} from "./forge";
import {BaseRestrictions, BaseRestrictionsFluent} from "../validator";
import {ObjectGen} from "../generate";


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

export interface ObjectRestrictions extends BaseRestrictions {
  fields:any
}

export interface ObjectRestrictionsFluent extends BaseRestrictionsFluent {
  fields(value:any):this
}

export class ObjectForge extends BaseForge implements CompositeForgeIF, ObjectRestrictionsFluent {

  restrictions: ObjectRestrictions

  _entityType: typeof EntityType
  _fieldDefinitions: { [key: string]: Forge}

  constructor(fields: any = {}, fieldName?: string) {
    super()
    this._fieldDefinitions = fields || {}
    this.fieldName = fieldName || null
    super.validatedBy(new DescendantValidator(this))
  }

  ignite(noFreeze?:boolean):void {
    if (!this._lit) {
      let defaults = this.defaultValue ? this.defaultValue : {}
      let theInstanceType = this._createEntityConstructor()

      theInstanceType.prototype._defaults = {}
      Object.keys(this._fieldDefinitions).forEach((key)=> {
        let def = this._fieldDefinitions[key]
        def.fieldName = key
        def.parent = this
        def.setResolver(this._resolver)
        let prop:ForgePropertyDescriptorIF = def.forgeProperty()
        Object.defineProperty(theInstanceType.prototype, key, prop.descriptor)
        theInstanceType.prototype._defaults[key] = defaults[key] || prop.initialValue
      })
      if(noFreeze !== true){
        Object.freeze(theInstanceType)
      }
      this._entityType = theInstanceType
    }
    super.ignite()
  }


  _createEntityConstructor(): typeof EntityType {
    let theCtor = function (cfg: any) {
      this.init()
      Object.assign(this, cfg)
    }
    return EntityType.enhanceSubclass(theCtor, this, this.fieldName, this.parent)
  }

  /**
   * Provide a newable instance of the data type.
   * @returns {Function} A constructor that can be newed up.
   */
  asNewable(): any {
    this.ignite()
    return this._entityType
  }

  /**
   * Creates a new instance of the data type.
   * @returns {any}
   */
  newInstance(defaultOverride?: any, parent?:EntityType): any {
    return new (this.asNewable())(defaultOverride)
  }

  forgeSetter(privateFieldName: string) {
    let fieldForge = this
    return function (value: any) {
      if (value && !value._forge) {
        value = fieldForge.newInstance(value, this)
      }
      let r = fieldForge.validate(value)
      if (r == null) {
        this[privateFieldName] = value
      } else {
        throw new ValidateFailedError(r[privateFieldName].message, r)
      }
    }
  }

  gen(): any {
    this.ignite()
    let value = this._generatedBy.gen(this.restrictions)
    if (value) {
      Object.keys(this._fieldDefinitions).forEach((fieldName)=> {
        let childForge = this._fieldDefinitions[fieldName]
        value[fieldName] = childForge.gen()
      })
    }
    return value
  }

  /**********************   Fluent config methods.  **********************/

  /**
   * Create an ObjectForge. The Object forge contains child Forges as fields, including other Object forges.
   */
  static obj(fields: any = {}, defaultValue: any = null, fieldName: string = '') {
    return new ObjectForge(fields, fieldName).initTo(defaultValue)
  }

  fields(value: any): this {
    this.restrictions.fields = value
    return this
  }

}

ObjectForge.generatedByType(ObjectGen)

