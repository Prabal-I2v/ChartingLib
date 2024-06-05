import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { I2vChartsComponent } from "../i2v-charts/i2v-charts.component";
import { ChartingDataService } from "../charting-data.service";
import {
  Enum_Entity,
  Enum_Method,
  Enum_WidgetType,
  RulePropertyType,
  Widget,
} from "../Models/WidgetRequestModel";
import { ChartsOutputModel } from "../Models/ChartsOutputModel";
import { ClientChartModel, ChartSeries } from "../Models/ClientChartModel";

@Component({
  selector: "i2v-pie-chart",
  templateUrl: "./i2v-pie-chart.component.html",
  styleUrl: "./i2v-pie-chart.component.scss",
})
export class I2vPieChartComponent extends I2vChartsComponent {
  public labelContent(args: any): string {
    return `${args.dataItem.name}`;
  }

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
    var chartData = new ClientChartModel();
    chartData.series = data.data.map((x) => {
      return new ChartSeries({ value: Number(x.data[0]), name: x.label });
    });

    chartData.chartCategories = data.data.map((x) => {
      return x.label;
    });
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
