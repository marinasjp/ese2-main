import {Component, ViewChild} from '@angular/core';
import {GraphService} from '../../services/graph.service';
import {UIChart} from "primeng/chart";
import {Subscription} from "rxjs";
import { saveAs } from 'file-saver';
import { Papa } from 'papaparse';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss']
})
export class GraphsComponent {
  @ViewChild("displacementForceFilteredChartMultiple") displacementForceFilteredChartMultiple: UIChart;
  @ViewChild("displacementForceFilteredChartSingle") displacementForceFilteredChartSingle: UIChart;

  @ViewChild("indentationForceChartMultiple") indentationForceChartMultiple: UIChart;
  @ViewChild("indentationForceChartSingle") indentationForceChartSingle: UIChart;

  @ViewChild("elSpectraChartMultiple") elSpectraChartMultiple: UIChart;
  @ViewChild("elSpectraChartSingle") elSpectraChartSingle: UIChart;

  graphOptions;

  displacementForceFilteredDataMultiple: any;
  displacementForceFilteredDataSingle: any;
  indentationForceDataMultiple: any;
  indentationForceDataSingle: any;
  elSpectraDataMultiple: any;
  elSpectraDataSingle: any;


  // datasets: { id: number, name: string, data: any, labels: any }[] = []
  // selectedDatasets: { id: number, name: string, data: any, labels: any }[] = []

  datasetsSubscription: Subscription;
  sliderValueSubscription: Subscription;

  constructor(public graphService: GraphService) {
  }

  decimation = {
    enabled: true,
    algorithm: 'min-max',
  };

  ngOnInit() {
    this.setGraphOptions();

    this.datasetsSubscription = this.graphService.selectedDatafile$.subscribe(() => {
      this.reloadMultipleLineGraphs();
    })

    this.sliderValueSubscription = this.graphService.sliderValue$.subscribe(() => {
      this.reloadSingleLineGraphs();
    })
  }


  ngOnDestroy() {
    this.datasetsSubscription.unsubscribe();
    this.sliderValueSubscription.unsubscribe();
  }

  setGraphOptions(): void {
    this.graphOptions = {
      indexAxis: "x",
      // Turn off animations and data parsing for performance
      animation: false,
      parsing: false,

      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      },
      elements: {
        point: {
          radius: 0
        }
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.yLabel;
          }
        }
      },
      plugins: {
        decimation: this.decimation,
        legend: {display: false},
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: "#ebedef"
          },
          grid: {
            color: "rgba(255,255,255,0.2)"
          },
          type: 'linear',
        },
        y: {
          stacked: true,
          ticks: {
            color: "#ebedef"
          },
          grid: {
            color: "rgba(255,255,255,0.2)"
          }
        }
      }
    };
  }

  getNewData(): any {
    return {
      data: [],
      fill: false,
      borderColor: '#' + (0x1000000 + Math.random() * 0x00ff00).toString(16).substr(1, 6),
      tension: .4
    }
  }

  setDisplacementForceFilteredMultiple(): void {
    this.displacementForceFilteredDataMultiple = {
      labels: [],
      datasets: []
    };

    for (let dataset of this.graphService.selectedDatafile.datasets) {
      this.displacementForceFilteredDataMultiple.datasets.push(this.getNewData());
      this.displacementForceFilteredDataMultiple.datasets[this.displacementForceFilteredDataMultiple.datasets.length - 1].data = dataset.displacementForceFilteredData;
    }
    if (this.displacementForceFilteredChartMultiple) {
      this.displacementForceFilteredChartMultiple.reinit();
    }
  }

  setDisplacementForceFilteredSingle(): void {
    if (!this.displacementForceFilteredDataMultiple?.datasets || !this.displacementForceFilteredDataMultiple.datasets[this.graphService.sliderValue]) {
      return;
    }
    this.displacementForceFilteredDataSingle = {
      labels: [],
      datasets: []
    };

    this.displacementForceFilteredDataSingle.datasets = [this.displacementForceFilteredDataMultiple.datasets[this.graphService.sliderValue]];
    if (this.displacementForceFilteredChartSingle) {
      this.displacementForceFilteredChartSingle.reinit();
    }
  }

  setIndentationForceMultiple(): void {
    this.indentationForceDataMultiple = {
      labels: [],
      datasets: []
    };
    for (let dataset of this.graphService.selectedDatafile.datasets) {
      this.indentationForceDataMultiple.datasets.push(this.getNewData());
      this.indentationForceDataMultiple.datasets[this.indentationForceDataMultiple.datasets.length - 1].data = dataset.indentationForceData;
    }
    if (this.indentationForceChartMultiple) {
      this.indentationForceChartMultiple.reinit();
    }
  }

  setIndentationForceSingle(): void {
    if (!this.indentationForceDataMultiple?.datasets || !this.indentationForceDataMultiple.datasets[this.graphService.sliderValue]) {
      return;
    }
    this.indentationForceDataSingle = {
      labels: [],
      datasets: []
    };

    this.indentationForceDataSingle.datasets = [this.indentationForceDataMultiple.datasets[this.graphService.sliderValue]];
    if (this.indentationForceChartSingle) {
      this.indentationForceChartSingle.reinit();
    }
  }

  setElSpectraMultiple(): void {
    this.elSpectraDataMultiple = {
      labels: [],
      datasets: []
    };
    for (let dataset of this.graphService.selectedDatafile.datasets) {
      // console.log(dataset.elspectraData);
      this.elSpectraDataMultiple.datasets.push(this.getNewData());
      this.elSpectraDataMultiple.datasets[this.elSpectraDataMultiple.datasets.length - 1].data = dataset.elspectraData;
    }
    if (this.elSpectraChartMultiple) {
      this.elSpectraChartMultiple.reinit();
    }
    console.log(this.elSpectraDataMultiple);
  }

  setElSpectraSingle(): void {
    if (!this.elSpectraDataMultiple?.datasets || !this.elSpectraDataMultiple.datasets[this.graphService.sliderValue]) {
      return;
    }
    this.elSpectraDataSingle = {
      labels: [],
      datasets: []
    };

    this.elSpectraDataSingle.datasets = [this.elSpectraDataMultiple.datasets[this.graphService.sliderValue]];

    if (this.elSpectraChartSingle) {
      this.elSpectraChartSingle.reinit();
    }
  }

  reloadMultipleLineGraphs(): void {
    this.setDisplacementForceFilteredMultiple();
    this.setIndentationForceMultiple();
    this.setElSpectraMultiple();

    this.reloadSingleLineGraphs();
  }

  reloadSingleLineGraphs(): void {
    this.setDisplacementForceFilteredSingle();
    this.setIndentationForceSingle();
    this.setElSpectraSingle();
  }
}
