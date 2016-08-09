import {Forge, BeforeIgnitionEvent} from "./forge";
import {EnumGen} from "generate/index";
import {BaseForge} from "./base-forge";



export class EnumForge extends BaseForge {

  constructor() {
    super()
  }

  static enumeration(defaultValue?:any) {
    return new EnumForge().initTo(defaultValue)
  }


  ignite() {
    if (this.restrictions.notNull && this.defaultValue === undefined ) {
      this.initTo(this.restrictions.isOneOf[0])
    }
    super.ignite()
  }

  values(values: any[]) {
    this.restrictions.isOneOf = values
    return this
  }
}


Forge.onBeforeIgnition(EnumForge, function (event: BeforeIgnitionEvent) {
  let dataGen = new EnumGen().applyRestrictions(event.restrictions)
  event.forge.dataGen = dataGen
  event.forge.gen = () => dataGen.gen()
})


