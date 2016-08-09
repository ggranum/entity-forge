import {DataGen} from "./data-gen";
import {generatePushID} from "./firebase-generate-push-id";
import {NotNullRestriction} from "../validator/base-validator";


export class UIDGen extends DataGen {

  restrictions:NotNullRestriction

  constructor() {
    super()
  }

  getDefaults():NotNullRestriction {
    return {
      notNull: true
    }
  }

  gen():any {
    let data = super.gen()
    if (data !== null) {
      data = generatePushID()
    }
    return data
  }
}

export let uidGen = new UIDGen();




