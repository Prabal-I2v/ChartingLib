import { Component, Input } from '@angular/core';
import { I2vChartsComponent } from '../i2v-charts/i2v-charts.component';
import { Color } from '@progress/kendo-drawing';

@Component({
  selector: 'i2v-area-chart',
  templateUrl: './i2v-area-chart.component.html',
  styleUrl: './i2v-area-chart.component.scss'
})
export class I2vAreaChartComponent extends I2vChartsComponent {
  @Input() chartCategories: any;
  @Input() chartData: any;

  constructor() {
    super();
  }
  getDefaultLineColor(data: any): string {

    return data.color;
  }


}
