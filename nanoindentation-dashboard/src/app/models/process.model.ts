export interface Process {
  id: string; // unique name to find place in filesystem
  name: string; // displayed name by the UI
  procType: EProcType; // type of the process, needed for correct display in UI, find place in filesystem etc.
  inputs?: any;
  custom?: boolean;
}

export enum EProcType { //Types of processes
  FILTER = 'filter',
  CPOINT = 'cPoint',
  EMODELS = 'eModels',
  FMODELS = 'fModels',
  TEST = 'test'
}