import { ChangeDetectorRef, Component, ElementRef, Input } from "@angular/core";
import { I2vChartsComponent } from "../i2v-charts/i2v-charts.component";
import { ChartingDataService } from "../charting-data.service";
import { ChartsOutputModel } from "../Models/ChartsOutputModel";
import { ChartSeries, ClientChartModel } from "../Models/ClientChartModel";
import { month } from "../Models/vehicle-icon-mapping";

@Component({
  selector: "i2v-area-chart",
  templateUrl: "./i2v-area-chart.component.html",
  styleUrl: "./i2v-area-chart.component.scss",
})
export class I2vAreaChartComponent extends I2vChartsComponent {

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

  public seriesDefaults: any = {
    type: "area",
    area: {
      line: {
        opacity: 1,
        width: 1.5,
      },
      opacity: 0.1, // Customize area color
    },
  };

  getDefaultLineColor(data: any): string {
    return data.color;
  }

  // Chart transformation (your original logic)
  public transformChartData(data: ChartsOutputModel) {
    let isMonthData = false;
    if (data.labels.xAxisLabel?.toLowerCase() === "month") isMonthData = true;

    const chartData = new ClientChartModel();
    chartData.series = data.seriesData.map((x) => {
      return new ChartSeries({ name: x.label, data: x.data });
    });

    if (data.labels.xAxisFields.length > 0) {
      if (isMonthData) {
        const monthData: any[] = [];
        data.labels.xAxisFields.forEach((x) => {
          monthData.push(month[parseInt(x) - 1]);
        });
        chartData.xAxisFields = monthData;
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
  }
}
