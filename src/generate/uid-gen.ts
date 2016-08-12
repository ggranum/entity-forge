import {DataGen} from "./data-gen";
import {generatePushID} from "./firebase-generate-push-id";
import {NotNullRestriction} from "../validator/base-validator";


export class UIDGen extends DataGen {

  restrictions: NotNullRestriction

  constructor() {
    super()
  }

  getDefaults(): NotNullRestriction {
    return {
      notNull: true
    }
  }

  doGen(R?: NotNullRestriction): any {
    return generatePushID()
  }
}

export let uidGen = new UIDGen();