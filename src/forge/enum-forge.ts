import {Forge} from "./forge";
import {ObjectRestrictionDefaults} from "../validation/restriction/restriction";
import {Checks} from "../check/index";
import {EnumGen} from "../generate/enum-gen";
export class EnumForge extends Forge {



  constructor(defaultValue:any = null, msg = "@validations.enumeration.enumeration") {
    super(defaultValue)
    this.restrictions = Object.assign({}, this.restrictions, {values: []}, ObjectRestrictionDefaults)

    // this.applyValidation({
    //   name: 'enumeration',
    //   fn: (v) => v === null || EnumForge.isMember(this.restrictions.values, v),
    //   msg: msg, abortOnFail: true
    // })
    this._check = Checks.any()

  }

  ignite() {
    if (this.restrictions.notNull && this.defaultValue == null) {
      this.initTo(this.restrictions.values[0])
    }
    super.ignite()
  }


  static enumeration(defaultValue:any = null, msg = "@validations.enumeration.enumeration") {
    return new EnumForge(defaultValue, msg)
  }

  values(values:any) {
    this.restrictions.values = values
    this._check.isOneOf(this.restrictions.values)

    return this
  }

}


Forge.onBeforeIgnition(EnumForge, function (event:any) {
  let dataGen = new EnumGen(event.forge.restrictions)
  event.forge.dataGen = dataGen
  event.forge.gen = () => dataGen.gen()
})


