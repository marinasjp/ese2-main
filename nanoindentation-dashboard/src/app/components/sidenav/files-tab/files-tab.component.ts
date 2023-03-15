import {Component} from '@angular/core';
import {GraphService} from "../../../services/graph.service";



@Component({
  selector: 'app-files-tab',
  templateUrl: './files-tab.component.html',
  styleUrls: ['./files-tab.component.scss']
})
export class FilesTabComponent {
  uploadedFile: any = [];

  constructor(public graphService: GraphService) {
  }

  uploadHandler(event: any): void {
    const file = event.files && event.files[0];
    this.graphService.uploadDataTxt(file);
  }

  uploadrawHandler(event: any) {
    const file = event.files && event.files[0];
    this.graphService.uploadDataRaw(file);
  }
}
