export interface Input {
  name: number[];
  selectedValue: any;
  type: EInputFieldType;
}

export enum EInputFieldType { //Types of processes
  BOOLEAN = 'boolean',
  NUMBER = 'number'
}
