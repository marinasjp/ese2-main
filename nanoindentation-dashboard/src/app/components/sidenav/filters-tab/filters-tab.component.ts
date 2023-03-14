import { Component } from '@angular/core';
import {ProcessorService} from "../../../services/processor.service";

@Component({
  selector: 'app-filters-tab',
  templateUrl: './filters-tab.component.html',
  styleUrls: ['./filters-tab.component.scss']
})
export class FiltersTabComponent {
  useProminency: boolean = true;
  prominency: number = null;
  minFrequency: number = null;
  band: number = null;

  constructor(public processorService: ProcessorService) {
  }
}
