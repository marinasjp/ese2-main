import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {UIChart} from "primeng/chart";

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit, OnChanges {
  @ViewChild("chart") chart: UIChart;

  @Input() data: any;
  @Input() options: any;

  ngOnInit() {
    if (this.chart)
      this.chart.reinit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.chart) {
      this.chart.reinit();
      this.reloadChart();
    }
  }

  reloadChart(): void {
    // this.data.datasets[0].data = this.selectedDatasets[0]?.data;
    // this.data.labels = this.selectedDatasets[0]?.labels;
  }

  test() {
    console.log(this.data);
  }
}
