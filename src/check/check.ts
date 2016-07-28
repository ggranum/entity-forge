import {Validators, IsOneOfValidator} from "../validator/index";
import {Constraint} from "./constraint";
import {Validator} from "../validator/validator";


export class Check {
  constraints: any[];

  constructor() {
    this.constraints = []
  }

  static any():Check {
    return new Check()
  }

  add(primaryValidation:Validator, ...preconditions:Validator[]) {
    this.constraints.push(new Constraint(primaryValidation, ...preconditions))
  }

  /**
   *
   * @param {Constraint[]} restrictions
   */
  addConstraints(restrictions:Constraint[]) {
    this.constraints.push(...restrictions)
  }

  check(value:any) {
    return this.validate(value) === null
  }

  validate(value:any):any {
    let results:any = null
    let failed = false
    this.constraints.forEach((test) => {
      let r = test.validate(value)
      if (r != null) {
        failed = true
        results = Object.assign(results || {}, r)
      }
    })
    return results
  }


  exists():Check {
    this.add(Validators.exists)
    return this
  }

  isObject():Check {
    this.add(Validators.isObject, Validators.exists)
    return this
  }


  isFunction():Check {
    this.add(Validators.isFunction, Validators.exists)
    return this
  }

  isOneOf(values:any[] = []):Check {
    this.add(new IsOneOfValidator(values), Validators.exists)
    return this
  }
}
