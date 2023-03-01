export interface Process {
  id: string, // unique name to find place in filesystem
  name: string, // displayed name by the UI
  procType: EProcType // type of the process, needed for correct display in UI, find place in filesystem etc.
  inputs?: any;
}

export enum EProcType {
  FILTER = 'filter',
  CPOINT = 'cPoint',
  EMODELS = 'eModels',
  FMODELS = 'fModels',
  TEST = 'test'
}
