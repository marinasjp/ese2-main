import { ErrorType, Error } from "../models/error.model";

export class ErrorHandler {
    private errors: Error[];
    errorID: -1;

    addError(err: any, errType: ErrorType){
        this.errors.push({id: this.errorID++, errType: errType, error: err});
        return {id: this.errorID++, errType: errType, error: err};
    }

    getError(id:number){
        return this.errors[id];
    }

    Fatal(error: any){
        
        console.log("Fatal error: "+ error+ " was caught, skipping process");
        return
    };
    Retry(error: any, attempt: number, max_attempt: number){
        console.log("Error: "+ error+ " occurred. Attempting retry: " + attempt+1 +"/"+max_attempt)
        return
    };
    RetryFailed(){
        console.log("Max attempts reached. Quitting method.")
    };

}