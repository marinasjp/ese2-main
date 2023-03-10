import {Datapoint} from "./datapoint.model";

export interface Dataset {
  contactPoint: Datapoint;
  displacementForceData: Datapoint[];
  displacementForceFilteredData: Datapoint[];
  indentationForceData: Datapoint[];
}
