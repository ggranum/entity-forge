export class ValidateFailedError extends Error {

  constructor(message:string, public cause:any){
    super(message)
    this.cause = cause
  }
}