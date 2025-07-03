import { ChangeDetectorRef, Component, ElementRef, Input } from "@angular/core";
import { I2vChartsComponent } from "../i2v-charts/i2v-charts.component";
import {
  LegendItemVisualArgs,
  SeriesLabelsContentArgs,
} from "@progress/kendo-angular-charts";
import { ChartsOutputModel } from "../Models/ChartsOutputModel";
import { ChartSeries, ClientChartModel } from "../Models/ClientChartModel";
import { ChartingDataService } from "../charting-data.service";
import { Enum_Method_Aggregation } from "../Models/enums/enums";
import { DonutChart2DWidget } from "../Models/widgetRequestModel/DonutChart2DModel";
import { DonutChart1DWidget } from "../Models/widgetRequestModel/DonutChart1DModel";
import { Enum_Month } from "../Models/vehicle-icon-mapping";

@Component({
  selector: "i2v-donut-chart",
  templateUrl: "./i2v-donut-chart.component.html",
  styleUrl: "./i2v-donut-chart.component.scss",
})
export class I2vDonutChartComponent extends I2vChartsComponent {
  @Input() override widgetRequestModel: DonutChart1DWidget | DonutChart2DWidget = null;
  resultHeading: string;
  resultLabel: string;
  resultData: string;
  totalData: number = 0;
  seriesDataIndexArray: boolean[] = [];
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
    this.resultLabel = this.widgetRequestModel.donutConf.resultLabel;
    const chartData = new ClientChartModel();
    this.seriesDataIndexArray = []
    chartData.series = data.seriesData.map((x) => {
      this.seriesDataIndexArray.push(true);
      return new ChartSeries({ data: x.data, displayName: x.displayName, name: x.name });
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
  }

  onLegendItemClick(event) {
    const index = this.chartData.series.findIndex((x) => {
      return x.name == event.text;
    });

    if (index != -1) {

      var chartData = JSON.parse(JSON.stringify(this.chartData));
      this.seriesDataIndexArray[index] = !this.seriesDataIndexArray[index]
      this.seriesDataIndexArray.forEach((x, index) => {
        if (!x) delete chartData.series[index];
      })

      var conf = this.widgetRequestModel.donutConf;

      if (conf.seriesAggregation == Enum_Method_Aggregation.Greatest) {
        var maxValue = -Infinity;
        chartData.series.forEach((seriesData) => {
          var res = maxValue <= seriesData.value
          maxValue = res ? seriesData.value : maxValue;
          if (conf.showSeriesLabelValue && res)
            this.resultHeading = seriesData.name;
        })
        this.resultData = maxValue.toString();
      }
      else if (conf.seriesAggregation == Enum_Method_Aggregation.Least) {
        var minValue = Infinity;
        chartData.series.forEach((seriesData) => {
          var res = minValue >= seriesData.value
          minValue = res ? seriesData.value : minValue;
          if (conf.showSeriesLabelValue && res)
            this.resultHeading = seriesData.name;
        })
        this.resultData = minValue.toString();

      }
      else {
        var value = 0;
        chartData.series.forEach((seriesData) => {
          value += seriesData.value;
        })
      }
    }
  }
}
