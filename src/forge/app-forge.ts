import {ObjectGen} from "../generate";
import {ObjectForge} from "./object-forge";
import {AppResolver} from "./store/resolver";


/**
 *  Holder for an application. Provides a Root for child Object and Map fields
 *
 *
 *
 *
 *
 */
export class AppForge extends ObjectForge {

  constructor(fields: any = {}, fieldName?: string) {
    super(fields, fieldName)
    this._resolver = new AppResolver(this)
    Object.keys(fields).forEach((key) => {
      this._fieldDefinitions[key].setResolver(this._resolver)
    })
  }

  /**
   * Create an AppForge. The Object forge contains child Forges as fields, including other Object forges.
   * @param fields
   * @param defaultValue
   * @param fieldName
   * @returns {AppForge}
   */
  static app(fields: any = {}, fieldName: string = 'app', defaultValue?: any) {
    return new AppForge(fields, fieldName).initTo(defaultValue || {})
  }

  /**********************   Fluent config methods.  **********************/

  ignite() {
    super.ignite()
  }
}

AppForge.generatedByType(ObjectGen)

