import { Component, Input } from '@angular/core';
import { I2vChartsComponent } from '../i2v-charts/i2v-charts.component';

@Component({
  selector: 'i2v-stackedbar-chart',
  templateUrl: './i2v-stackedbar-chart.component.html',
  styleUrl: './i2v-stackedbar-chart.component.scss'
})
export class I2vStackedbarChartComponent extends I2vChartsComponent{
  @Input() chartCategories: any;
  @Input() chartData: any;

  constructor() {
    super();
  }

}
