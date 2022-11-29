import {Component} from '@angular/core';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {

  useProminency: boolean = true;
  prominency: number = null;
  minFrequency: number = null;
  band: number = null;

  filters: { id: number, name: string, inputs?: string[] }[] = [
    {id: 1, name: "Median Filter", inputs: ["Window Length [nm]", "Polynomical Order (int)"]},
    {id: 2, name: "Sawitzky Golay", inputs: ["Window Length [nm]"]}
  ]
  selectedFilters: { id: number, name: string, inputs?: string[] }[] = [];

  constructor() {
  }

  ngOnInit() {

  }
}
