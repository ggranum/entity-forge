"use strict"

class EnumForge extends Forge{


  constructor(defaultValue = null, msg = "@validations.enumeration.enumeration") {
    super(defaultValue)
    this.restrictions = Object.assign({}, this.restrictions, {allowedValues: []}, ObjectRestrictions)

    this.applyValidation({
      name: 'enumeration',
      fn: (v) => v === null || EnumForge.isMember(this.restrictions.allowedValues, v),
      msg: msg, abortOnFail: true
    })
    this._check = Checks.any()

  }

  ignite(){
    if(this.restrictions.notNull && this.defaultValue == null){
      this.initTo(this.restrictions.allowedValues[0])
    }
    super.ignite()
  }


  static enumeration(defaultValue = null, msg = "@validations.enumeration.enumeration") {
    return new EnumForge(defaultValue, msg)
  }

  values(values) {
    this.restrictions.allowedValues = values
    this._check.isOneOf(this.restrictions.allowedValues)

    return this
  }

}


Forge.onBeforeIgnition(EnumForge, function (event) {
  let dataGen = new EnumGen(event.forge.restrictions)
  event.forge.dataGen = dataGen
  event.forge.gen = () => dataGen.gen()
})


