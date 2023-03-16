import { Component } from '@angular/core';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { Datapoint } from 'src/app/models/datapoint.model';
import { GraphService } from 'src/app/services/graph.service';
import { ProcessorService } from 'src/app/services/processor.service';
import { GraphNumber } from 'src/app/models/graphNumber.model';
import { GraphSingle } from 'src/app/models/graphSingle.model';

@Component({
  selector: 'app-download-tab',
  templateUrl: './download-tab.component.html',
  styleUrls: ['./download-tab.component.scss']
})

export class DownloadTabComponent {
  graphOptions: GraphNumber[];
  selectedGraph: GraphNumber;
  graphSingle: GraphSingle[];
  selectedSingle: GraphSingle;

  constructor(public graphService: GraphService, public processorService: ProcessorService) {
    this.graphService.selectedDatafile$.subscribe((datafile) => {
      if (datafile.datasets.length) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    })
    this.graphOptions = [
      {name: "Force Displacement", no: 1},
      {name: "Force Indentation", no: 2},
      {name: "Elasticity Spectra", no: 3}
    ]
    this.graphSingle = [
      {name: "Multiple Curves", single: false},
      {name: "Single Curve", single: true},
    ]
  }

  disabled: boolean = true;
  download(): any {
     
    let Filename;
    console.log(this.graphService.sliderValue)

    let data: Datapoint[][] = [];
    if (this.selectedGraph.no==1 && this.selectedSingle.single==false){    //Force-Displacement 
    Filename = "Force-Displacement.csv";
    this.graphService.selectedDatafile.datasets.forEach((dataset => {
      data.push(dataset.displacementForceData)
    }))
  } else if (this.selectedGraph.no==1 && this.selectedSingle.single==true){ //Force-Displacement (single)
      Filename = "Force-Displacement (Single).csv"
      data.push(this.graphService.selectedDatafile.datasets[this.graphService.sliderValue].displacementForceData)
      
  }else if (this.selectedGraph.no==2 && this.selectedSingle.single==false){ //Force-Indentation 
    Filename = "Force-Indentation.csv"
    this.graphService.selectedDatafile.datasets.forEach((dataset => {
      data.push(dataset.indentationForceData)
    }))
  }else if (this.selectedGraph.no==2 && this.selectedSingle.single==true){ //Force-Indentation (single)
    Filename = "Force-Indentation (Single).csv"
    data.push(this.graphService.selectedDatafile.datasets[this.graphService.sliderValue].indentationForceData)
      
  }else if (this.selectedGraph.no==3 && this.selectedSingle.single==false){ // Elasticity-Spectra
    Filename = "Elasticity-Spectra.csv"
    this.graphService.selectedDatafile.datasets.forEach((dataset => {
      data.push(dataset.elspectraData)
    }))
  }else { // Elasticity-Spectra (single)
    Filename = "Elasticity-Spectra (Single).csv"
    data.push(this.graphService.selectedDatafile.datasets[this.graphService.sliderValue].elspectraData)
      
  }
  


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

    //console.log(csvString); // Check the output in the console

    const csv = csvString;

    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, Filename);
  }

}
