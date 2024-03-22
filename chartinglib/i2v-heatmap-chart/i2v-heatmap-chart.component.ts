import { Component, Input } from '@angular/core';
import { I2vChartsComponent } from '../i2v-charts/i2v-charts.component';

@Component({
  selector: 'i2v-heatmap-chart',
  templateUrl: './i2v-heatmap-chart.component.html',
  styleUrl: './i2v-heatmap-chart.component.scss'
})
export class I2vHeatmapChartComponent extends I2vChartsComponent{
  @Input() chartCategories: any;
  @Input() chartData: any;

  constructor() {
    super();
  }

  public yAxisLabelContent = (e: { value: string }): string => {
    return this.chartCategories[e.value] || "";
  };

}
