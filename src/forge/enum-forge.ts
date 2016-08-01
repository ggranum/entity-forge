import {Forge, BeforeIgnitionEvent} from "./forge";
import {EnumGen} from "@entityforge/generate";
export class EnumForge extends Forge {

  constructor() {
    super()
  }

  static enumeration(defaultValue?:any) {
    return new EnumForge().initTo(defaultValue)
  }


  ignite() {
    if (this._check.restrictions.notNull && this.defaultValue === undefined ) {
      this.initTo(this._check.restrictions.isOneOf[0])
    }
    super.ignite()
  }

  values(values: any[]) {
    this._check.isOneOf(values)
    return this
  }
}


Forge.onBeforeIgnition(EnumForge, function (event: BeforeIgnitionEvent) {
  let dataGen = new EnumGen(event.restrictions)
  event.forge.dataGen = dataGen
  event.forge.gen = () => dataGen.gen()
})


