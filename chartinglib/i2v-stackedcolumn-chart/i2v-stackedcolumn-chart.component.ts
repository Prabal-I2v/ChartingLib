import { ChangeDetectorRef, Component, ElementRef, Input } from "@angular/core";
import { I2vChartsComponent } from "../i2v-charts/i2v-charts.component";
import { ChartsOutputModel } from "../Models/ChartsOutputModel";
import { ClientChartModel, ChartSeries } from "../Models/ClientChartModel";
import { ChartingDataService } from "../charting-data.service";
import { Enum_Month } from "../Models/vehicle-icon-mapping";
import { Enum_TimePeriod } from "../Models/enums/enums";
@Component({
  selector: "i2v-stackedcolumn-chart",
  templateUrl: "./i2v-stackedcolumn-chart.component.html",
  styleUrl: "./i2v-stackedcolumn-chart.component.scss",
})
export class I2vStackedcolumnChartComponent extends I2vChartsComponent {

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
    let isMonthData = false;
    if (data.labels.xAxisLabel?.toLowerCase() === "month") isMonthData = true;

    const chartData = new ClientChartModel();
    chartData.series = data.seriesData.map((x) => {
      return new ChartSeries({ name: x.name, displayName: x.displayName, data: x.data});
    });

    if (data.labels.xAxisFields.length > 0) {
      if (isMonthData) {
        const monthData: any[] = [];
        data.seriesData[0].data.forEach((x) => {
          monthData.push(Enum_Month[parseInt(x) - 1]);
        });

        chartData.xAxisFields = data.labels.xAxisFields;
      } else {
        chartData.xAxisFields = data.labels.xAxisFields;
      }
    }

    if (data.labels.xAxisLabel) {
      chartData.xAxisLabel = data.labels.xAxisLabel;
    }

    if (data.labels.yAxisLabel) {
      chartData.yAxisLabel = data.labels.yAxisLabel;
    }
    this.chartData = chartData;
    this.chartData.series = this.appendNameToAggregatedProperty(this.chartData)
    if (this.widgetRequestModel.showableProperties.length == 0) {
      this.dataExistsForShowableProperties = false;
    }
  }
}
