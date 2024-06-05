import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { I2vChartsComponent } from "../i2v-charts/i2v-charts.component";
import { ChartingDataService } from "../charting-data.service";
import { ChartsOutputModel } from "../Models/ChartsOutputModel";
import { ClientChartModel, ChartSeries } from "../Models/ClientChartModel";

@Component({
  selector: "i2v-stackedbar-chart",
  templateUrl: "./i2v-stackedbar-chart.component.html",
  styleUrl: "./i2v-stackedbar-chart.component.scss",
})
export class I2vStackedbarChartComponent extends I2vChartsComponent {
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

  transformData(data: ChartsOutputModel): ClientChartModel {
    const chartData = new ClientChartModel();

    chartData.series = data.data.map((x) => {
      return new ChartSeries({
        name: x.label,
        data: x.data.map((str) => parseInt(str, 10)),
      });
    });
    if (data.labels.length > 0) {
      chartData.chartCategories = data.labels[0].value;
      chartData.x_label = data.labels[0].key;
    } else {
      chartData.chartCategories = data.data.map((x) => {
        return x.label;
      });
    }
    return chartData;
  }
}
