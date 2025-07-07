import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
} from "@angular/core";
import { I2vChartsComponent } from "../i2v-charts/i2v-charts.component";
import { ChartingDataService } from "../charting-data.service";
import { ChartsOutputModel } from "../Models/ChartsOutputModel";
import { ChartSeries, ClientChartModel } from "../Models/ClientChartModel";
import { Enum_Month } from "../Models/vehicle-icon-mapping";

@Component({
  selector: "i2v-column-chart",
  templateUrl: "./i2v-column-chart.component.html",
  styleUrl: "./i2v-column-chart.component.scss",
})
export class I2vColumnChartComponent extends I2vChartsComponent {

  chartData: ClientChartModel;

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

  // Chart transformation (your original logic)
  public transformChartData(data: ChartsOutputModel) {
    const chartData = new ClientChartModel();
    chartData.series = data.seriesData.map((x) => {
      return new ChartSeries({ name: x.name, displayName: x.displayName, data: x.data });
    });

    let isMonthData = false;
    if (data.labels.xAxisLabel?.toLowerCase() === "month") isMonthData = true;

    if (data.labels.useXAxisFieldValue && data.labels.xAxisFields.length > 0) {
      if (isMonthData) {
        const monthData: any[] = [];
        data.labels.xAxisFields.forEach((x) => {
          monthData.push(Enum_Month[parseInt(x) - 1]);
        });
        chartData.xAxisFields = monthData;
      } else {
        chartData.xAxisFields = data.labels.xAxisFields;
      }
    }
    else {
      chartData.xAxisFields = [];
    }

    if (data.labels.xAxisLabel) {
      chartData.xAxisLabel = data.labels.xAxisLabel;
    }

    if (data.labels.yAxisLabel) {
      chartData.yAxisLabel = data.labels.yAxisLabel;
    }
    this.chartData = chartData;
    this.chartData.series = this.filterShowableSeries(this.chartData)
     if(this.chartData.series.length == 0)
    {
      this.dataExistsForShowableProperties = false;
    }
  }
}
