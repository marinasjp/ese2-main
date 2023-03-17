import {Component} from '@angular/core';
import {GraphService} from "../../../services/graph.service";
import {Process} from "../../../models/process.model";
import {ProcessorService} from "../../../services/processor.service";

@Component({
  selector: 'app-force-ind-tab',
  templateUrl: './force-ind-tab.component.html',
  styleUrls: ['./force-ind-tab.component.scss']
})
export class ForceIndTabComponent {
  disabled: boolean = true;

  calcIndentationProcess: Process

  constructor(private graphService: GraphService,
              private processorService: ProcessorService) {
    this.graphService.selectedDatafile$.subscribe(() => {
      if (this.graphService.selectedDatafile.datasets[0]?.contactPoint) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    })

    this.calcIndentationProcess = this.processorService.availableProcesses.internal.find(p => p.id == 'calc_indentation');
  }
}
