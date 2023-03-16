import {Component} from '@angular/core';
import {GraphService} from "../../../services/graph.service";
import {Process} from "../../../models/process.model";
import {ProcessorService} from "../../../services/processor.service";

@Component({
  selector: 'app-elisticity-spectra-tab',
  templateUrl: './elisticity-spectra-tab.component.html',
  styleUrls: ['./elisticity-spectra-tab.component.scss']
})
export class ElisticitySpectraTabComponent {
  disabled: boolean = true;

  calcElspectraProcess: Process;

  constructor(private graphService: GraphService,
              private processorService: ProcessorService) {
    this.graphService.selectedDatafile$.subscribe(() => {
      if (this.graphService.selectedDatafile.datasets[0]?.contactPoint) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    })

    this.calcElspectraProcess = this.processorService.availableProcesses.internal.find((process) => process.id == 'calc_elspectra');
  }
}
