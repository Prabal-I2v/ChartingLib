import { Component, Input } from '@angular/core';
import { I2vChartsComponent } from '../i2v-charts/i2v-charts.component';
import { ChartingDataService } from '../charting-data.service';

@Component({
  selector: 'i2v-line-chart',
  templateUrl: './i2v-line-chart.component.html',
  styleUrl: './i2v-line-chart.component.scss'
})
export class I2vLineChartComponent extends I2vChartsComponent {


  constructor(private chartingDataService : ChartingDataService) {
    super();
  }

  ngOnInit(): void {
    if (this.widgetRequestModel) {
      this.isModel = true;
      if(this.widgetRequestModel.allowRefresh){
        this.init(this.chartingDataService);
      }
    } else {
      this.isModel = false;
    }
  }
}
