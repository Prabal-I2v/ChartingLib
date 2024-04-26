import { Component, Input } from '@angular/core';
import { I2vChartsComponent } from '../i2v-charts/i2v-charts.component';
import { ChartsOutputModel } from '../Models/ChartsOutputModel';
import { ClientChartModel, ChartSeries } from '../Models/ClientChartModel';
import { ChartingDataService } from '../charting-data.service';

@Component({
  selector: 'i2v-stackedcolumn-chart',
  templateUrl: './i2v-stackedcolumn-chart.component.html',
  styleUrl: './i2v-stackedcolumn-chart.component.scss'
})
export class I2vStackedcolumnChartComponent extends I2vChartsComponent {


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

  transformData(data: ChartsOutputModel) : ClientChartModel {

    var chartData = new ClientChartModel();
    chartData.series[0].data = data.data.map((x) => {
      return new ChartSeries({name:x.label, data:x.data.map(str => parseInt(str, 10))});
    })
    if (data.labels.length > 0) {
      chartData.chartCategories = data.labels[0].value;
      chartData.x_label = data.labels[0].key
    }
    else{
      chartData.chartCategories = data.data.map((x) => {
        return x.label
      })
    }
    return chartData;
  }
}
