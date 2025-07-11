import { ChangeDetectorRef, Component, ElementRef, Input } from "@angular/core";
import { I2vChartsComponent } from "../i2v-charts/i2v-charts.component";
import { ChartsOutputModel } from "../Models/ChartsOutputModel";
import { ClientChartModel, ChartSeries } from "../Models/ClientChartModel";
import { ChartingDataService } from "../charting-data.service";
import { month } from "../Models/vehicle-icon-mapping";
import { Enum_TimePeriod } from "../Models/Widget";

@Component({
  selector: "i2v-stackedcolumn-chart",
  templateUrl: "./i2v-stackedcolumn-chart.component.html",
  styleUrl: "./i2v-stackedcolumn-chart.component.scss",
})
export class I2vStackedcolumnChartComponent extends I2vChartsComponent {
  constructor(
    chartingDataService: ChartingDataService,
    cd: ChangeDetectorRef,
    elementRef: ElementRef
  ) {
    super(cd, chartingDataService,elementRef);
  }

  ngOnInit(): void {
   super.ngOnInit();
  }

  transformChartData(data: ChartsOutputModel): ClientChartModel {
    let isMonthData = false;
    if (data.labels[0].key.toLocaleLowerCase() == Enum_TimePeriod.month) isMonthData = true;
    const chartData = new ClientChartModel();

    chartData.series = data.data.map((x) => {
      return new ChartSeries({
        name: x.label,
        data: x.data.map((str) => parseInt(str, 10)),
      });
    });
    if (data.labels.length > 0) {
      if (isMonthData) {
        const monthData: any[] = [];
        data.labels[0].value.forEach((x) => {
          monthData.push(month[parseInt(x) - 1]);
        });

        chartData.chartCategories = monthData;
      } else {
        chartData.chartCategories = data.labels[0].value;
      }
      chartData.x_label = data.labels[0].key;
    } else {
      chartData.chartCategories = data.data.map((x) => {
        return x.label;
      });
    }
    return chartData;
  }
}
