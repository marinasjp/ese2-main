import { Component } from '@angular/core';

@Component({
  selector: 'app-force-ind-tab',
  templateUrl: './force-ind-tab.component.html',
  styleUrls: ['./force-ind-tab.component.scss']
})
export class ForceIndTabComponent {
  forceIndMin: any;
  forceIndMax: any;

  selectedIndShape: any;

  indShapes: { name: string } [] = [
    {name: "Sphere"},
    {name: "Cylinder"},
    {name: "Cone"},
    {name: "Pyramid"}
  ]
}
