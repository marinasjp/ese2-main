import {Component, ViewChild} from '@angular/core';
import {GraphService} from '../../services/graph.service';
import {UIChart} from "primeng/chart";

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss']
})
export class GraphsComponent {
  @ViewChild("displacementForceFilteredChart") displacementForceFilteredChart: UIChart;
  @ViewChild("chart2") chart2: UIChart;
  graphOptions;
  slideTemplate;

  dataTemplate = {
    labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    datasets: []
  };

  displacementForceFilteredData: any;

  // datasets: { id: number, name: string, data: any, labels: any }[] = []
  // selectedDatasets: { id: number, name: string, data: any, labels: any }[] = []

  constructor(public graphService: GraphService) {
  }

  decimation = {
    enabled: true,
    algorithm: 'min-max',
  };

  ngOnInit() {
    this.setGraphOptions();

    this.graphService.datasets$.subscribe(() => {
      this.reloadMultipleLineGraphs();
    })

    // this.graphService.sliderValue$.subscribe(() => {
    //   this.reloadSingleLineGraphs();
    // })
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
          min: this.graphService.start,
          max: this.graphService.end
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

  setDisplacementForceFiltered(): void {
    this.displacementForceFilteredData = this.dataTemplate;
    this.displacementForceFilteredData.dataTemplate = [];
    for (let dataset of this.graphService.datasets) {
      this.displacementForceFilteredData.datasets.push(this.getNewData());
      this.displacementForceFilteredData.datasets[this.dataTemplate.datasets.length - 1].data = dataset.displacementForceFilteredData;
    }
    if (this.displacementForceFilteredChart) {
      this.displacementForceFilteredChart.reinit();
    }
  }

  reloadMultipleLineGraphs(): void {
    this.setDisplacementForceFiltered();
  }

  reloadSingleLineGraphs(): void {
    if (!this.dataTemplate?.datasets || !this.dataTemplate.datasets[this.graphService.sliderValue]) {
      return;
    }
    this.slideTemplate.datasets = [this.dataTemplate.datasets[this.graphService.sliderValue]];
    if (this.chart2) {
      this.chart2.reinit();
    }
  }

  test() {
    console.log(this.dataTemplate.datasets[0].data);
  }
}
