import { ChangeDetectorRef, Component, ElementRef, Input } from "@angular/core";
import { I2vChartsComponent } from "../i2v-charts/i2v-charts.component";
import { ChartsOutputModel } from "../Models/ChartsOutputModel";
import { ChartingDataService } from "../charting-data.service";
import { HeatMapClientChartData as HeatMapClientChartData } from "./HeatMapClientChartData";

@Component({
  selector: "i2v-heatmap-chart",
  templateUrl: "./i2v-heatmap-chart.component.html",
  styleUrl: "./i2v-heatmap-chart.component.scss",
})
export class I2vHeatmapChartComponent extends I2vChartsComponent {

  chartData: HeatMapClientChartData;

  constructor(
    chartingDataService: ChartingDataService,
    cd: ChangeDetectorRef,
    elementRef: ElementRef
  ) {
    super(cd, chartingDataService, elementRef);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  transformChartData(data: ChartsOutputModel) {
    const chartData = new HeatMapClientChartData();
    chartData.xAxisLabel = data.labels.xAxisLabel;
    chartData.yAxisLabel = data.labels.yAxisLabel;
    data.labels.xAxisFields.forEach((xLabel, index) => {
      if (data.labels.useXAxisFieldValue == false) {
        data.labels.yAxisFields.forEach((yLabel) => {
          var cellData = data.seriesData.find((x) => x.name === xLabel).data[0];
          var value = parseFloat(cellData) ?? 0;
          chartData.data.push({
            xAxis: yLabel,
            yAxis: xLabel,
            value: isNaN(value) ? 0 : value,
          });
        });
      }
      else {
        data.labels.yAxisFields.forEach((yLabel) => {
          var cellData = data.seriesData.find((x) => x.name === yLabel).data[index];
          var value = parseFloat(cellData) ?? 0;
          chartData.data.push({
            xAxis: yLabel,
            yAxis: xLabel,
            value: isNaN(value) ? 0 : value,
          });
        });
      }
    });

    this.chartData = chartData;


  }
}
