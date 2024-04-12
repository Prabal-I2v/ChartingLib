import { Component, Input } from '@angular/core';
import { I2vChartsComponent } from '../i2v-charts/i2v-charts.component';

@Component({
  selector: 'i2v-area-chart',
  templateUrl: './i2v-area-chart.component.html',
  styleUrl: './i2v-area-chart.component.scss'
})
export class I2vAreaChartComponent extends I2vChartsComponent {

  constructor() {
    super();
  }
  public seriesDefaults: any = {
    type: "area",
    area: {
      line:{
       opacity:1,
       width:1.5
      },
      opacity:0.1// Customize area color
    }
  };

  getDefaultLineColor(data: any): string {

    return data.color;
  }
}
