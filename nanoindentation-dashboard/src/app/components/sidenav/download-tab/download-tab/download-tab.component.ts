import { Component } from '@angular/core';
import { saveAs } from 'file-saver';
//import Papa from 'papaparse';
import { Datapoint } from 'src/app/models/datapoint.model';
import { GraphService } from 'src/app/services/graph.service';
import { ProcessorService } from 'src/app/services/processor.service';

@Component({
  selector: 'app-download-tab',
  templateUrl: './download-tab.component.html',
  styleUrls: ['./download-tab.component.scss']
})

export class DownloadTabComponent {
  constructor(public graphService: GraphService, public processorService: ProcessorService) {
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
    let data: Datapoint[][] = [];
    this.graphService.selectedDatafile.datasets.forEach((dataset => {
      data.push(dataset.displacementForceData)
    }))
    console.log(data)


    let xArray: number[] = [];
  let yArray: number[] = [];

  for (let i = 0; i < data.length; i++) {
    const ConvertedData = this.processorService.convertDatapointsArrayToXAndYArray(data[i]);
    console.log(ConvertedData)
    xArray.push(...ConvertedData.x);
    yArray.push(...ConvertedData.y);
  }

  let csvString: string = 'x,y\n';

  for (let i = 0; i < xArray.length; i++) {
    csvString += `${xArray[i]},${yArray[i]}\n`;
  }

  console.log(csvString); // Check the output in the console

  const csv = csvString;


    //const ConvertedData = this.processorService.convertDatapointsArrayToXAndYArray(data[0]);
    //console.log(ConvertedData)
    // let stringifiedData: string;
    // let xString: string = '';
    // let yString: string = '';
    // console.log(data.length)
    // for (let i = 0; i < data.length; i++) {
    //   const ConvertedData = this.processorService.convertDatapointsArrayToXAndYArray(data[i]);
    //   console.log(ConvertedData)
    //   xString += ', ' + ConvertedData.x;
    //   yString += ', ' + ConvertedData.y;
    // }

    // stringifiedData = '{x: [' + xString + '], y: [' + yString + ']} \r\n';

    // console.log(stringifiedData); // Check the output in the console

    // const csv = stringifiedData;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'data.csv');
  }

}
