import { Component, Input } from '@angular/core';
import { I2vChartsComponent } from '../i2v-charts/i2v-charts.component';
import { LineStyle } from "@progress/kendo-angular-charts";

@Component({
  selector: 'i2v-line-chart',
  templateUrl: './i2v-line-chart.component.html',
  styleUrl: './i2v-line-chart.component.scss'
})
export class I2vLineChartComponent extends I2vChartsComponent {
  @Input() chartCategories: any;
  @Input() chartData: any;
  public style: LineStyle = "normal";

  constructor() {
    super();
  }
}
