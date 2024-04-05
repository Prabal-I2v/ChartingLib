import { Component, Input } from '@angular/core';
import { I2vChartsComponent } from '../i2v-charts/i2v-charts.component';

@Component({
  selector: 'i2v-column-chart',
  templateUrl: './i2v-column-chart.component.html',
  styleUrl: './i2v-column-chart.component.scss'
})
export class I2vColumnChartComponent extends I2vChartsComponent {


  constructor() {
    super();
  }

}
