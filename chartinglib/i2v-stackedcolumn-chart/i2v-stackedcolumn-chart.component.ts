import { Component, Input } from '@angular/core';
import { I2vChartsComponent } from '../i2v-charts/i2v-charts.component';

@Component({
  selector: 'i2v-stackedcolumn-chart',
  templateUrl: './i2v-stackedcolumn-chart.component.html',
  styleUrl: './i2v-stackedcolumn-chart.component.scss'
})
export class I2vStackedcolumnChartComponent extends I2vChartsComponent {


  constructor() {
    super();
  }
}
