export interface Process {

  procType: EProcType
}

export enum EProcType { //Types of processes
  FILTER = 'filter',
  CPOINT = 'cPoint',
  EMODELS = 'eModels',
  FMODELS = 'fModels',
  TEST = 'test'
}
