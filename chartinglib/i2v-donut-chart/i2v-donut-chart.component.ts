import { Component, Input } from '@angular/core';
import { I2vChartsComponent } from '../i2v-charts/i2v-charts.component';
import { LegendItemVisualArgs, SeriesLabelsContentArgs } from '@progress/kendo-angular-charts';
import { ChartsOutputModel } from '../Models/ChartsOutputModel';
import { ChartSeries, ClientChartModel } from '../Models/ClientChartModel';



@Component({
  selector: 'i2v-donut-chart',
  templateUrl: './i2v-donut-chart.component.html',
  styleUrl: './i2v-donut-chart.component.scss'
})
export class I2vDonutChartComponent extends I2vChartsComponent {

  public labelContent(e: SeriesLabelsContentArgs): string {
    return e.category;
  }

  constructor() {
    super();
  }

  transformData(data: ChartsOutputModel) : ClientChartModel {

    var chartData = new ClientChartModel();
    chartData.series=[];
      data.data[0].data.forEach((x:any,i) => {
      chartData.series.push( new ChartSeries(data.labels[0].value[i], x));
    })
    // if (data.labels.length > 0) {
    //   chartData.chartCategories = data.labels[0].value;
    //   chartData.x_label = data.labels[0].key
    // }
    // else{
    //   chartData.chartCategories = data.data.map((x) => {
    //     return x.label
    //   })
    // }
    return chartData;
  }



}


