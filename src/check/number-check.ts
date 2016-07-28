import {Check} from "./check";
import {Validators, MinValidator, MaxValidator} from "../validation/index";


export class NumberCheck extends Check {

  static number():NumberCheck {
    let v = new NumberCheck()
    return v.isNumber()
  }

  static int():NumberCheck {
    let v = new NumberCheck()
    return v.isInt()
  }

  isNumber():NumberCheck {
    this.add(Validators.isNumber, Validators.exists)
    return this
  }

  isInt():NumberCheck {
    this.add(Validators.isInt, Validators.exists)
    return this
  }

  min(min:number, inclusive:boolean = true):NumberCheck {
    this.add(new MinValidator(min, inclusive), Validators.isNumber, Validators.exists)
    return this
  }

  max(max:number, inclusive:boolean = false):NumberCheck {
    this.add(new MaxValidator(max, inclusive), Validators.isNumber, Validators.exists)
    return this
  }

}





