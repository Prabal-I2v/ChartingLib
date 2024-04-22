import { Component, Input } from "@angular/core";
import { I2vChartsComponent } from "../i2v-charts/i2v-charts.component";
import { ChartingDataService } from "../charting-data.service";
import { ChartsOutputModel } from "../Models/ChartsOutputModel";
import { ChartSeries, ClientChartModel } from "../Models/ClientChartModel";

// export enum RiseLevel {
//   Increase,
//   Decrease,
//   Neutral,
// }
@Component({
  selector: "i2v-kpi-chart",
  templateUrl: "./i2v-kpi-chart.component.html",
  styleUrl: "./i2v-kpi-chart.component.scss",
})
export class I2vKpiChartComponent extends I2vChartsComponent {
  percentValue: number = 0;
//  RiseLevel: RiseLevel;
  @Input() disableTimeFilter: boolean = false;

  constructor(private chartingDataService: ChartingDataService) {
    super();
  }

  ngOnInit(): void {
    if (this.widgetRequestModel.allowRefresh) {
      this.init(this.chartingDataService);
    }
  }

  transformData(data: ChartsOutputModel): ClientChartModel {
    var chartData = new ClientChartModel();
    chartData.series = data.data.map((x) => {
      return new ChartSeries({ name: x.label, data: x.data });
    });
    if (data.labels.length > 0) {
      chartData.chartCategories = data.labels[0].value;
      chartData.x_label = data.labels[0].key;
    } else {
      chartData.chartCategories = data.data.map((x) => {
        return x.label;
      });
    }
    if (chartData.series[0].data.length > 1) {
      this.percentValue = 
        ((Number(chartData.series[0].data[chartData.series[0].data.length - 1]) - Number(chartData.series[0].data[chartData.series[0].data.length - 2])) /
          Number( chartData.series[0].data[chartData.series[0].data.length - 1])) * 100;
        } 
    else if (chartData.series[0].data.length > 0) {
      this.percentValue = 100
    } 
    else {
      this.percentValue = 0;
    }

    // if (this.percentValue > 0) {
    //   this.RiseLevel = RiseLevel.Increase;
    // } else if (this.percentValue < 0) {
    //   this.RiseLevel = RiseLevel.Decrease;
    // } else {
    //   this.RiseLevel = RiseLevel.Neutral;
    // }
    return chartData;
  }
}
