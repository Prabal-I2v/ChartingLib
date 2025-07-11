import { ChangeDetectorRef, Component, ElementRef, Input } from "@angular/core";
import { I2vChartsComponent } from "../i2v-charts/i2v-charts.component";
import { SeriesLabelsContentArgs } from "@progress/kendo-angular-charts";
import { ChartsOutputModel } from "../Models/ChartsOutputModel";
import { ChartSeries, ClientChartModel } from "../Models/ClientChartModel";
import { ChartingDataService } from "../charting-data.service";
import { Enum_Month } from "../Models/vehicle-icon-mapping";
import { DonutChart1DWidget } from "../Models/widgetRequestModel/DonutChart1DModel";
import { DonutChart2DWidget } from "../Models/widgetRequestModel/DonutChart2DModel";
import { Enum_Method_Aggregation } from "../Models/enums/enums";

@Component({
  selector: "i2v-donut-chart",
  templateUrl: "./i2v-donut-chart.component.html",
  styleUrl: "./i2v-donut-chart.component.scss",
})
export class I2vDonutChartComponent extends I2vChartsComponent {
  @Input() override widgetRequestModel:
    | DonutChart1DWidget
    | DonutChart2DWidget = null;
  centerLabelHeading: string;
  centerLabel: string;
  centerLabelData: number;
  seriesDataEnabledIndexArray: boolean[] = [];
  public labelContent(e: SeriesLabelsContentArgs): string {
    return e.category;
  }

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

  transformChartData(data: ChartsOutputModel) {
    this.dataExists = false;
    this.centerLabel = this.widgetRequestModel.donutConf.centerLabel;
    const chartData = new ClientChartModel();
    this.seriesDataEnabledIndexArray = [];
    chartData.series = data.seriesData.map((x) => {
      this.seriesDataEnabledIndexArray.push(true);
      return new ChartSeries({
        data: x.data,
        displayName: x.displayName,
        name: x.name,
      });
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
    } else {
      chartData.xAxisFields = [];
    }

    if (data.labels.xAxisLabel) {
      chartData.xAxisLabel = data.labels.xAxisLabel;
    }

    if (data.labels.yAxisLabel) {
      chartData.yAxisLabel = data.labels.yAxisLabel;
    }

    this.chartData = chartData;
    this.chartData.series = this.appendNameToAggregatedProperty(this.chartData);
    if (this.widgetRequestModel.showableProperties.length == 0) {
      this.dataExistsForShowableProperties = false;
    }
    this.setLabelData();
  }

  setLabelData() {
    if (!this.widgetRequestModel.donutConf) return;

    this.centerLabelData = 0;

    const donutConf = this.widgetRequestModel.donutConf;
    const hasCenterLabel =
      donutConf.centerLabel !== null && donutConf.centerLabel.trim() !== "";

    if (hasCenterLabel) {
      this.centerLabelHeading = donutConf.centerLabel;

      if (this.chartData.xAxisFields.length > 0) {
        if (
          donutConf.centerLabelAggregation === Enum_Method_Aggregation.Total
        ) {
          this.calculateTotalValue();
        } else if (
          donutConf.centerLabelAggregation === Enum_Method_Aggregation.Least
        ) {
          this.calculateLeastValue();
        } else if (
          donutConf.centerLabelAggregation === Enum_Method_Aggregation.Greatest
        ) {
          this.calculateGreatestValue();
        }
      } else {
        if (
          donutConf.centerLabelAggregation === Enum_Method_Aggregation.Greatest
        ) {
          this.calculateGreatestValue(false);
        } else if (
          donutConf.centerLabelAggregation === Enum_Method_Aggregation.Least
        ) {
          this.calculateLeastValue(false);
        } else if (
          donutConf.centerLabelAggregation === Enum_Method_Aggregation.Total
        ) {
          this.calculateTotalValue(false);
        }
      }
    }
  }

  private calculateTotalValue(useXAxisFieldValue: boolean = true) {
    this.centerLabelData = 0;
    this.seriesDataEnabledIndexArray.forEach((isEnabled, index) => {
      if (isEnabled) {
        if (useXAxisFieldValue) {
          this.chartData.xAxisFields.forEach((xAxisField) => {
            const value = Number(
              this.chartData.series[index].data[
              this.chartData.xAxisFields.indexOf(xAxisField)
              ]
            );
            this.centerLabelData += value;
          });
        } else {
          const value = Number(this.chartData.series[index].data[0]);
          this.centerLabelData += value;
        }
      }
    });
  }

  private calculateLeastValue(useXAxisFieldValue: boolean = true) {
    let least = Infinity;
    this.seriesDataEnabledIndexArray.forEach((isEnabled, index) => {
      if (isEnabled) {
        if (useXAxisFieldValue) {
          this.chartData.xAxisFields.forEach((xAxisField) => {
            const value = Number(
              this.chartData.series[index].data[
              this.chartData.xAxisFields.indexOf(xAxisField)
              ]
            );
            if (value < least) least = value;
          });
        } else {
          const value = Number(this.chartData.series[index].data[0]);
          if (value < least) least = value;
        }
      }
    });
    this.centerLabelData = least === Infinity ? 0 : least;
  }

  private calculateGreatestValue(useXAxisFieldValue: boolean = true) {
    let greatest = -Infinity;
    this.seriesDataEnabledIndexArray.forEach((isEnabled, index) => {
      if (isEnabled) {
        if (useXAxisFieldValue) {
          this.chartData.xAxisFields.forEach((xAxisField) => {
            const value = Number(
              this.chartData.series[index].data[
              this.chartData.xAxisFields.indexOf(xAxisField)
              ]);
            if (value > greatest) greatest = value;
          });
        } else {
          const value = Number(this.chartData.series[index].data[0]);
          if (value > greatest) greatest = value;
        }
      }
    });
    this.centerLabelData = greatest === -Infinity ? 0 : greatest;
  }

  onLegendItemClick(event) {
    const index = this.chartData.series.findIndex((x) => {
      return x.name == event.text;
    });
  }
}
