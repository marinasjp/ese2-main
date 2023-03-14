import {Component} from '@angular/core';
import {GraphService} from "../../../services/graph.service";

@Component({
  selector: 'app-force-ind-tab',
  templateUrl: './force-ind-tab.component.html',
  styleUrls: ['./force-ind-tab.component.scss']
})
export class ForceIndTabComponent {

  disabled: boolean = true;

  forceIndMin: any;
  forceIndMax: any;

  selectedIndShape: any;

  indShapes: { name: string } [] = [
    {name: "Sphere"},
    {name: "Cylinder"},
    {name: "Cone"},
    {name: "Pyramid"}
  ]

  constructor(private graphService: GraphService) {
    this.graphService.datasets$.subscribe(() => {
      if (this.graphService.datasets[0]?.contactPoint) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    })
  }
}
