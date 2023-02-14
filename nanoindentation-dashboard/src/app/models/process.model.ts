export interface Process {

  procType: EProcType
}

export enum EProcType {
  FILTER = 'filter',
  CPOINT = 'cPoint',
  EMODELS = 'eModels',
  FMODELS = 'fModels'
}
