import {Component} from '@angular/core';
import {ProcessorService} from "../../../services/processor.service";
import {GraphService} from "../../../services/graph.service";

@Component({
  selector: 'app-filters-tab',
  templateUrl: './filters-tab.component.html',
  styleUrls: ['./filters-tab.component.scss']
})
export class FiltersTabComponent {
  disabled: boolean = true;

  useProminency: boolean = true;
  prominency: number = null;
  minFrequency: number = null;
  band: number = null;

  constructor(public processorService: ProcessorService,
              private graphService: GraphService) {
    this.graphService.selectedDatafile$.subscribe((datafile) => {
      if (datafile.datasets.length) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    })
  }
}
