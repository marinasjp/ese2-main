import {Component} from '@angular/core';
import {GraphService} from "../../services/graph.service";

@Component({
  selector: 'app-bottomnav',
  templateUrl: './bottomnav.component.html',
  styleUrls: ['./bottomnav.component.scss']
})
export class BottomnavComponent {

  constructor(public graphService: GraphService) {
  }
}
