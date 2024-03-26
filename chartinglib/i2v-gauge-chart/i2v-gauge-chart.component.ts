import { Component, Input } from '@angular/core';
import { I2vChartsComponent } from '../i2v-charts/i2v-charts.component';

@Component({
  selector: 'app-i2v-gauge-chart',
  templateUrl: './i2v-gauge-chart.component.html',
  styleUrl: './i2v-gauge-chart.component.scss'
})
export class I2vGaugeChartComponent extends I2vChartsComponent{
  @Input() chartCategories: any;
  @Input() chartData: any;
  @Input() gaugevalue:any;
  @Input() color:any[];

  public labelContent(args: any): string {
    return `${args.dataItem.category} years old`;
  }

  constructor() {
    super();
  }

}
