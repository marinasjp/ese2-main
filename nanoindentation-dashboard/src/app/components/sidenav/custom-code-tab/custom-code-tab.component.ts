import { Component, ViewChild } from '@angular/core';
import {ProcessorService} from "../../../services/processor.service";
import { Process, EProcType } from 'src/app/models/process.model';
import { ProcessType } from 'src/app/models/processType.model';

@Component({
  selector: 'app-custom-code-tab',
  templateUrl: './custom-code-tab.component.html',
  styleUrls: ['./custom-code-tab.component.scss']
})

export class CustomCodeTabComponent {
  @ViewChild('fileUpload') fileUpload: any;

  selectedProcess: ProcessType;
  processOptions: ProcessType[];

  constructor(private processorService: ProcessorService) {
    this.processOptions = [
      {name: "Filter", procType: EProcType.FILTER},
      {name: "CPoint", procType: EProcType.CPOINT},
      {name: "FModel", procType: EProcType.FMODELS},
      {name: "EModel", procType: EProcType.EMODELS}
    ]
    }
  // process: Process
  displayBasic: boolean;
  showBasicDialog() {
    this.displayBasic = true;
  }

  // uploadFilterHandler(event: any): void {
  //   this.uploadCode(event, EProcType.FILTER)
  // }
  // uploadCPointHandler(event: any): void {
  //   this.uploadCode(event, EProcType.CPOINT)
  // }
  // uploadFModelHandler(event: any): void {
  //   this.uploadCode(event, EProcType.FMODELS)
  // }
  // uploadEModelHandler(event: any): void {
  //   this.uploadCode(event, EProcType.EMODELS)
  // }

  uploadCodeHandler(event: any): void {
    var process = {} as Process;

    // Set Parameters
    process.id=event.files.name;
    process.name=event.files.name;
    process.custom=true;
    process.procType=this.selectedProcess.procType;

    this.processorService.addProcess(process);
    this.fileUpload.clear()
  }
}
