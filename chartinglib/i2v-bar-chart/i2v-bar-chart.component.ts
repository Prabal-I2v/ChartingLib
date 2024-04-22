import { Component, Input } from '@angular/core';
import { I2vChartsComponent } from '../i2v-charts/i2v-charts.component';
import { ChartingDataService } from '../charting-data.service';

@Component({
  selector: 'i2v-bar-chart',
  templateUrl: './i2v-bar-chart.component.html',
  styleUrl: './i2v-bar-chart.component.scss'
})
export class I2vBarChartComponent extends I2vChartsComponent {
   

  constructor(private chartingDataService : ChartingDataService) {
    super();
  }

  ngOnInit(): void {
    if(this.widgetRequestModel.allowRefresh){
      this.init(this.chartingDataService);
    }
  }
}
