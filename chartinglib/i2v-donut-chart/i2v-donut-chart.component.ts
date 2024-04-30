import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { I2vChartsComponent } from '../i2v-charts/i2v-charts.component';
import { LegendItemVisualArgs, SeriesLabelsContentArgs } from '@progress/kendo-angular-charts';
import { ChartsOutputModel } from '../Models/ChartsOutputModel';
import { ChartSeries, ClientChartModel } from '../Models/ClientChartModel';
import { ChartingDataService } from '../charting-data.service';



@Component({
  selector: 'i2v-donut-chart',
  templateUrl: './i2v-donut-chart.component.html',
  styleUrl: './i2v-donut-chart.component.scss'
})
export class I2vDonutChartComponent extends I2vChartsComponent {

  public labelContent(e: SeriesLabelsContentArgs): string {
    return e.category;
  }

  constructor(private chartingDataService : ChartingDataService, private cd : ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    if (this.widgetRequestModel) {
      this.isModel = true;
      if(this.widgetRequestModel.allowRefresh){
        this.init(this.cd, this.chartingDataService);
      }
    } else {
      this.isModel = false;
    }
  }
  // transformData(data: ChartsOutputModel) : ClientChartModel {

  //   var chartData = new ClientChartModel();
  //   chartData.series[0].data=[];
  //     data.data[0].data.forEach((x:any,i) => {
  //     chartData.series[0].data.push( new ChartSeries({name:data.labels[0].value[i],data: x}));
  //   })
  //   // if (data.labels.length > 0) {
  //   //   chartData.chartCategories = data.labels[0].value;
  //   //   chartData.x_label = data.labels[0].key
  //   // }
  //   // else{
  //   //   chartData.chartCategories = data.data.map((x) => {
  //   //     return x.label
  //   //   })
  //   // }
  //   return chartData;
  // }

  transformData(data: ChartsOutputModel) : ClientChartModel {

    var chartData = new ClientChartModel();
    chartData.series = data.data.map(x=> {
      return new ChartSeries({value : Number(x.data[0]), name : x.label})
    })

    chartData.chartCategories = data.data.map((x) => {
      return x.label
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


