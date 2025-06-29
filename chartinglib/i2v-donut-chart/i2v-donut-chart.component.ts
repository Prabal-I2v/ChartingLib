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
      return new ChartSeries({ data: x.data, name: x.label });
    });
    var conf = this.widgetRequestModel.donutConf;

    if (conf.seriesAggregation == Enum_Method_Aggregation.Greatest) {
      var maxValue = -Infinity;
      chartData.series.forEach((seriesData) => {
        var res = maxValue < Number(seriesData.data[0])
        maxValue = res ? Number(seriesData.data[0]) : maxValue;
        if (conf.showSeriesLabelValue)
          this.resultHeading = res ? seriesData.name : "";
      })
      this.resultData = maxValue.toString();
    }
    else if (conf.seriesAggregation == Enum_Method_Aggregation.Least) {
      var minValue = Infinity;
      chartData.series.forEach((seriesData, index) => {
        var res = minValue > Number(seriesData.data[0])
        minValue = res ? Number(seriesData.data[0]) : minValue;
        if (conf.showSeriesLabelValue)
          this.resultHeading = res ? seriesData.name : "";
      })
      this.resultData = minValue.toString();

    }
    else {
      var value = 0;
      chartData.series.forEach((seriesData) => {
        value += Number(seriesData.data[0]);
      })
    }

    chartData.xAxisFields = data.seriesData.map((x) => {
      return x.label;
    });

    if (chartData.series.length > 0) {
      this.dataExists = true;
    }

    this.chartData = chartData;
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
