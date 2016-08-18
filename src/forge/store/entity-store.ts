

export interface Action {
  key: string
  value: any
}


export interface EntityStore {
  dispatch(action:Action):any
  subscribe(listener:any):Function
  getState():any
}