import { Component } from '@angular/core';
import {ProcessorService} from "../../../services/processor.service";
import {Process} from "../../../models/process.model";

@Component({
  selector: 'app-contact-point-tab',
  templateUrl: './contact-point-tab.component.html',
  styleUrls: ['./contact-point-tab.component.scss']
})
export class ContactPointTabComponent {

  availableCPointProcesses: Process[];

  constructor(public processorService: ProcessorService) {
  }

  ngOnInit() {
    this.availableCPointProcesses = this.processorService.availableProcesses.cPoints;
  }

  test(): void {
    this.processorService.selectedCPointProcess = this.availableCPointProcesses[0];
    console.log(this.processorService.selectedCPointProcess);
  }
}
