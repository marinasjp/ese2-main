import {Component, ViewChild} from '@angular/core';
import {GraphService} from '../../services/graph.service';
import {UIChart} from "primeng/chart";

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss']
})
export class GraphsComponent {
  @ViewChild("chart1") chart1: UIChart;
  @ViewChild("chart2") chart2: UIChart;
  graphOptions;
  dataTemplate;
  slideTemplate;

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
    this.setDataTemplate();
    if (this.chart1)
      this.chart1.reinit();
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


  setDataTemplate(): void {
    this.dataTemplate = {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16],
      datasets: [
      ]
    };
    this.slideTemplate = {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16],
      datasets: [
      ]
    };
  }

  test() {
    for (let inputData of this.graphService.inputData) {
      this.dataTemplate.datasets.push(this.getNewData());
      this.dataTemplate.datasets[this.dataTemplate.datasets.length - 1].data = inputData;
    }
    //Slider Graph
    this.slideTemplate.datasets.push(this.getNewData());
    this.slideTemplate.datasets[this.slideTemplate.datasets.length - 1].data = this.graphService.inputData[this.graphService.sliderVal];
    
    console.log(this.graphService.sliderVal);
    this.chart1.reinit();
    this.chart2.reinit();
  }
}
