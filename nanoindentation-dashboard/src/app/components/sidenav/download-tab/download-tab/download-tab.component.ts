import { Component } from '@angular/core';
import { saveAs } from 'file-saver';
import  Papa  from 'papaparse';
import { GraphService } from 'src/app/services/graph.service';

@Component({
  selector: 'app-download-tab',
  templateUrl: './download-tab.component.html',
  styleUrls: ['./download-tab.component.scss']
})

export class DownloadTabComponent {
  constructor(public graphService: GraphService) {
    this.graphService.selectedDatafile$.subscribe((datafile) => {
      if (datafile.datasets.length) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    })
  }

  disabled: boolean = true;
  download(): any {
    const data = this.graphService.selectedDatafile.datasets;
    const stringifiedData = [];
    
    for (let i = 0; i < data.length; i++) {
      const stringifiedObject = JSON.stringify(data[i]);
      stringifiedData.push([stringifiedObject]);
    }
    
    console.log(stringifiedData); // Check the output in the console
    
    // You can then do what you need to do with the stringified data
    // For example, you can save it to a CSV file using PapaParse:
    
    const csv = Papa.unparse(stringifiedData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'data.csv');
  }

}
