import { Component, ViewChild } from '@angular/core';
import {ProcessorService} from "../../../services/processor.service";
import { Process, EProcType } from 'src/app/models/process.model';

@Component({
  selector: 'app-custom-code-tab',
  templateUrl: './custom-code-tab.component.html',
  styleUrls: ['./custom-code-tab.component.scss']
})

export class CustomCodeTabComponent {
  @ViewChild('fileUpload') fileUpload: any;

  constructor(private processorService: ProcessorService) {
    }
  // process: Process
  displayBasic: boolean;
  showBasicDialog() {
    this.displayBasic = true;
  }

  uploadFilterHandler(event: any): void {
    this.uploadCode(event, EProcType.FILTER)
  }
  uploadCPointHandler(event: any): void {
    this.uploadCode(event, EProcType.CPOINT)
  }
  uploadFModelHandler(event: any): void {
    this.uploadCode(event, EProcType.FMODELS)
  }
  uploadEModelHandler(event: any): void {
    this.uploadCode(event, EProcType.EMODELS)
  }

  uploadCode(event: any, proc: EProcType): void {
    var process = {} as Process;

    // Set Parameters
    process.id=event.files.name;
    process.name=event.files.name;
    process.custom=true;
    process.inUse=false;
    process.procType=proc;

    this.processorService.addProcess(process);
    this.fileUpload.clear()
  }
}
