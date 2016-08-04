import {DataGen} from "./data-gen";
import {UIDRestrictions} from "../validator/restriction/restriction";
import {generatePushID} from "./firebase-generate-push-id";


export class UIDGen extends DataGen {

  restrictions:UIDRestrictions

  constructor() {
    super()
  }

  getDefaults():UIDRestrictions {
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




