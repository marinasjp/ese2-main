import {Injectable} from '@angular/core';
import {Error, EErrorType} from "../models/error.model";

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  private errors: Error[];
  private errorID: -1;

  public addError(err: any, errType: EErrorType) {
    this.errors.push({id: this.errorID++, errType: errType, error: err});
    return {id: this.errorID++, errType: errType, error: err};
  }

  public getError(id: number) {
    return this.errors[id];
  }

  public setType(err: Error, errType: EErrorType) {
    err.errType = errType;
    return err;
  }

  public Fatal(error: any) {

    console.log("Fatal error: " + error + " was caught, skipping process");
    return
  };

  public Retry(error: any, attempt: number, max_attempt: number) {
    console.log("Error: " + error + " occurred. Attempting retry: " + attempt + 1 + "/" + max_attempt)
    return
  };

  public RetryFailed() {
    console.log("Max attempts reached. Quitting method.")
  };

  constructor() {
  }
}
