import {Component, ViewChild} from '@angular/core';
import {GraphService} from '../services/graph.service';
import {UIChart} from "primeng/chart";

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss']
})
export class GraphsComponent {
  @ViewChild("chart") chart: UIChart;
  basicOptions;
  basicData;
  data;

  datasets: { id: number, name: string, data: any, labels: any }[] = []
  selectedDatasets: { id: number, name: string, data: any, labels: any }[] = []

  constructor(private graphService: GraphService) {
    this.graphService.graphData$.subscribe((data) => {
      if (data?.Indentation) {
        this.datasets.push({id: 1, name: data.Name, data: data.Indentation, labels: data.Time})
        this.reloadChart();
      }
    })
  }

  ngOnInit() {
    this.applyDarkTheme();
    this.basicData = {
      labels: [],
      datasets: [
        {
          label: 'First Dataset',
          data: this.data,
          fill: false,
          borderColor: '#02ff0e',
          tension: .4
        },
      ]
    };
  }

  reloadChart(): void {
    this.basicData.datasets[0].data = this.selectedDatasets[0]?.data;
    this.basicData.labels = this.selectedDatasets[0]?.labels;
    this.chart.reinit();
  }

  applyDarkTheme() {
    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#ebedef'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#ebedef'
          },
          grid: {
            color: 'rgba(255,255,255,0.2)'
          }
        },
        y: {
          ticks: {
            color: '#ebedef'
          },
          grid: {
            color: 'rgba(255,255,255,0.2)'
          }
        }
      }
    };
  }
}
