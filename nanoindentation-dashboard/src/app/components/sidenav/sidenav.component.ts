import {Component} from '@angular/core';
import {GraphService} from "../../services/graph.service";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {

  constructor(public graphService: GraphService) {
  }
}
