let EntityType = function () { }
Object.assign(EntityType.prototype, {
  toJson() {
    return JSON.stringify(this)
  }
});


/**
 * Defines a validate function on the EntityType we are creating.
 * Refers to the validate function of its forge.
 */
EntityType.defineValidateFn = function(proto){

  Object.defineProperty(proto, 'validate', {
    configurable: false,
    enumerable: false,
    writable: false,
    value: function () {
      return this._forge.validate(this, this._forge.fieldName)
    }
  })
}
