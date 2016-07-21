"use strict"

class ValidateFailedError extends Error {

  constructor(msg, cause){
    super(msg)
    this.cause = cause
  }
}