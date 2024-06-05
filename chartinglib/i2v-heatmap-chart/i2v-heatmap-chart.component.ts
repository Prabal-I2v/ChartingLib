import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { I2vChartsComponent } from "../i2v-charts/i2v-charts.component";
import { ChartsOutputModel } from "../Models/ChartsOutputModel";
import { ChartSeries, ClientChartModel } from "../Models/ClientChartModel";
import { ChartingDataService } from "../charting-data.service";

@Component({
  selector: "i2v-heatmap-chart",
  templateUrl: "./i2v-heatmap-chart.component.html",
  styleUrl: "./i2v-heatmap-chart.component.scss",
})
export class I2vHeatmapChartComponent extends I2vChartsComponent {
  constructor(
    private chartingDataService: ChartingDataService,
    private cd: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.widgetRequestModel) {
      this.isModel = true;
      if (this.widgetRequestModel.allowRefresh) {
        this.init(this.cd, this.chartingDataService);
      }
    } else {
      this.isModel = false;
    }
  }
  // public yAxisLabelContent = (e: { value: string }): string => {
  //   return this.chartData.chartCategories[e.value] || "";
  // };

  transformData(data: ChartsOutputModel): ClientChartModel {
    var chartData = new ClientChartModel();
    chartData.series[0].data = [];
    data.data.forEach((x, i) => {
      // return new ChartSeries(x.label, x.data);
      x.data.forEach((y, j) => {
        chartData.series[0].data.push(
          new ChartSeries({
            name: x.label,
            value: parseInt(y),
            yaxis: data.labels[0].value[j],
          }),
          //   {
          //   name:x.label,
          //   data:x.data,
          //   yaxis: data.labels[i].value[j]
          // }
        );
      });
      console.log(chartData.series[0].data);
    });
    console.log(chartData.series[0].data);
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

  // export function makeDataObjects(rows: number, cols: number): DataObject[] {
  //   const mapdata: DataObject[] = [];
  //   for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
  //     Array.from(Array(cols)).map((_, colIndex) => {
  //       mapdata.push({
  //         xAxis: `X${rowIndex + 1}`,
  //         yAxis: `Y${colIndex + 1}`,
  //         value: cols + rowIndex * colIndex,
  //       });
  //     });
  //   }

  //   return mapdata;
  // }
}
