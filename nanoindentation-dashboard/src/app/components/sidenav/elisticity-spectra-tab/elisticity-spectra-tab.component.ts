import {Component} from '@angular/core';
import {GraphService} from "../../../services/graph.service";

@Component({
  selector: 'app-elisticity-spectra-tab',
  templateUrl: './elisticity-spectra-tab.component.html',
  styleUrls: ['./elisticity-spectra-tab.component.scss']
})
export class ElisticitySpectraTabComponent {
  disabled: boolean = true;

  constructor(private graphService: GraphService) {
    this.graphService.selectedDatafile$.subscribe(() => {
      if (this.graphService.selectedDatafile.datasets[0]?.contactPoint) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    })
  }
}
