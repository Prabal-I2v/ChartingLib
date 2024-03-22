import { Component, Input } from '@angular/core';
import { I2vChartsComponent } from '../i2v-charts/i2v-charts.component';

@Component({
  selector: 'i2v-pie-chart',
  templateUrl: './i2v-pie-chart.component.html',
  styleUrl: './i2v-pie-chart.component.scss'
})
export class I2vPieChartComponent extends I2vChartsComponent {
  @Input() chartCategories: any;
  @Input() chartData: any;

  public labelContent(args: any): string {
    return `${args.dataItem.category} years old`;
  }

  constructor() {
    super();
  }

}
