import { Component, Input } from '@angular/core';
import { I2vChartsComponent } from '../i2v-charts/i2v-charts.component';



@Component({
  selector: 'app-i2v-donut-chart',
  templateUrl: './i2v-donut-chart.component.html',
  styleUrl: './i2v-donut-chart.component.scss'
})
export class I2vDonutChartComponent extends I2vChartsComponent {
  @Input() chartCategories: any;
  @Input() chartData: any;
  @Input() position:any;
  @Input() seriesColors:any[];
  public labelContent(args: any): string {
    return `${args.dataItem.category} years old`;
  }

  constructor() {
    super();
  }
}
