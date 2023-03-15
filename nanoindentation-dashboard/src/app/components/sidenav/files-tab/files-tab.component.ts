import {Component} from '@angular/core';
import {GraphService} from "../../../services/graph.service";
import {Datafile} from "../../../models/datafile.model";
import {ProcessorService} from "../../../services/processor.service";
import {EProcType} from "../../../models/process.model";

@Component({
  selector: 'app-files-tab',
  templateUrl: './files-tab.component.html',
  styleUrls: ['./files-tab.component.scss']
})
export class FilesTabComponent {
  uploadedFile: any = [];
  tabOpen: boolean = false;

  selectedDatafile: Datafile;

  constructor(public graphService: GraphService,
              private processorService: ProcessorService) {
    if (this.graphService.selectedDatafile.datasets.length == 0) {
      this.tabOpen = true;
    }
  }

  uploadHandler(event: any): void {
    const file = event.files && event.files[0];
    this.graphService.uploadDataTxt(file);
  }

  onSelectDatafile() {
    if (this.graphService.selectedDatafile.name != this.selectedDatafile.name) {
      this.graphService.selectedDatafile = this.selectedDatafile;
      this.graphService.selectedDatafile.datasets.forEach((dataset, index) => {
        this.graphService.selectedDatafile.datasets[index].displacementForceFilteredData = this.graphService.selectedDatafile.datasets[index].displacementForceData;
      })
      this.processorService.runFrom(EProcType.FILTER);
    }
  }

  // parseData() {
  //   console.log("PARSE DATA")
  //   let reader = new FileReader();
  //   reader.onload = (e) => {
  //     console.log("HERE");
  //     // Entire file
  //     const text: string = reader.result as string;
  //     // $output.innerText = text


  //     // By lines
  //     let lines = text.split('\n');
  //     let reached = false;
  //     let customerData = {
  //       "Name": [],
  //       "Time": [],
  //       "Load": [],
  //       "Indentation": [],
  //       "Cantilever": [],
  //       "Piezo": []
  //     };
  //     customerData["Name"].push(this.uploadedFile[0].name)

  //     let values;
  //     for (let line = 0; line < lines.length; line++) {
  //       if (reached) {
  //         values = lines[line].split("\t");
  //         customerData["Time"].push(values[0]);
  //         customerData["Load"].push(values[1]);
  //         customerData["Indentation"].push(values[2]);
  //         customerData["Cantilever"].push(values[3]);
  //         customerData["Piezo"].push(values[4]);
  //       }

  //       let words = lines[line].split('');
  //       for (let word = 0; word < words.length; word++) {

  //         if (words.slice(-10).join("").trim() === "Auxiliary") {
  //           reached = true;
  //         }
  //       }
  //     }
  //   }

  //   reader.readAsText(this.uploadedFile[0]);
  // }

  uploadrawHandler(event: any) {
    const file = event.files && event.files[0];
    this.graphService.uploadDataRaw(file);
  }
}
