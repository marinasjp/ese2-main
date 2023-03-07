export class ErrorHandler {

    Fatal(error: any){
        console.log("Fatal error: "+ error+ " was caught, skipping process");
        return
    };
    Retry(error: any, attempt: number, max_attempt: number){
        console.log("Error: "+ error+ " occurred. Attempting retry: " + attempt+1 +"/"+max_attempt)
        return
    };

}