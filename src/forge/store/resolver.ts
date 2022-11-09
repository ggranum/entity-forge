import {AppForge} from "../app-forge";
import {Forge} from "../forge";

export interface EntityResolver {
  resolve(path: string): any
  createAndStore(path: string, forge: Forge): string
}


export class AppResolver implements EntityResolver {

  constructor(private _app: AppForge) {

  }

  resolve(path: string): any {
    let location = this._getStoreLocation(path)
    debugger
    return location

  }

  createAndStore(path: string, field: Forge): string {
    let value = field.newInstance()
    let key = value['uid']
    let z = this._app
    let a = this._getStoreLocation(path)
    debugger
    a[key] = value
    return key
  }

  _getStoreLocation(path: string) {
    let parts = this._pathParts(path)
    let locationValue:any = this._app
    for (let i = 0; i < parts.length; i++) {
      if(locationValue['_fieldDefinitions']){
        locationValue = locationValue['_fieldDefinitions'][parts[i]]
      } else{
        locationValue = locationValue[parts[i]]
      }
    }
    return locationValue
  }

  //noinspection JSMethodCanBeStatic
  _pathParts(str: string): string[] {
    let tokens:string[] = str.split("/")
    return tokens.filter((token)=>{
      return token != ""
    })
  }
}