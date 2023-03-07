export interface Error {
  id: number, // unique id to classify
  errType: EErrorType, // type of the error, needed for correct display in UI, find place in filesystem etc.
  error: any //error specified by TS
}

export enum EErrorType { //Types of processes
  FATAL = 'fatal',
  RETRY = 'retry',
  TEST = 'test'
}
