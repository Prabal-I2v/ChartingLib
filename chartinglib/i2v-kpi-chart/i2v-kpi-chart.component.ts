import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { I2vChartsComponent } from "../i2v-charts/i2v-charts.component";
import { ChartingDataService } from "../charting-data.service";
import { ChartsOutputModel } from "../Models/ChartsOutputModel";
import { ChartSeries, ClientChartModel } from "../Models/ClientChartModel";
import { Enum_Method_Aggregation } from "../Models/WidgetRequestModel";
import { eventIconMapping } from "../Models/vehicle-icon-mapping";

// export enum RiseLevel {
//   Increase,
//   Decrease,
//   Neutral,
// }
@Component({
  selector: "i2v-kpi-chart",
  templateUrl: "./i2v-kpi-chart.component.html",
  styleUrl: "./i2v-kpi-chart.component.scss",
})
export class I2vKpiChartComponent extends I2vChartsComponent {
  percentValue: number = 0;
  PropName: string = "";
  PropIcon: string = "";
  PropValue: number = 0;
  svgIcon: string = "";
  ResSvgIcon: string = "";
  //  RiseLevel: RiseLevel;
  @Input() disableTimeFilter: boolean = false;
  @Input() showChart: boolean = false;

  constructor(
    private chartingDataService: ChartingDataService,
    private cd: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.widgetRequestModel) {
      this.svgIcon = this.widgetRequestModel.svgIcon;
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
      return new ChartSeries({ name: x.label, data: x.data });
    });
    if (data.labels.length > 0) {
      chartData.chartCategories = data.labels[0].value;
      chartData.x_label = data.labels[0].key;
    } else {
      chartData.chartCategories = data.data.map((x) => {
        return x.label;
      });
    }

    //if our data is created from a single column, we use IsMultivaluedcolumn = true because we cannot get series with greatest name
    if (
      this.widgetRequestModel.isMultiValuedColumn &&
      this.widgetRequestModel.isMultiValuedColumn == true
    ) {
      var maxValuesSeriesIndex = this.findMaxLastValue(chartData.series);
      this.setData(chartData, maxValuesSeriesIndex);
      this.PropName = chartData.series[maxValuesSeriesIndex].name;
    }

    //if we dont have multivaluedColumn then we used ClubbingFieldName property and we get series as Lowest/greatest/total
    else if (
      this.widgetRequestModel.ClubbingFieldName != null &&
      this.widgetRequestModel.ClubbingFieldName ==
        Enum_Method_Aggregation.Greatest
    ) {
      var greatestSeries = chartData.series.find((x) => {
        return x.name == "greatest";
      });

      var maxValuesSeriesLastValue =
        greatestSeries.data[greatestSeries.data.length - 1];
      var maxValuesSeriesIndex = chartData.series.findIndex((x) => {
        return x.data[x.data.length - 1] == maxValuesSeriesLastValue;
      });

      this.setData(chartData, maxValuesSeriesIndex);
      this.PropName = chartData.series[maxValuesSeriesIndex].name;
    } else if (
      this.widgetRequestModel.ClubbingFieldName != null &&
      this.widgetRequestModel.ClubbingFieldName ==
        Enum_Method_Aggregation.Lowest
    ) {
      var greatestSeries = chartData.series.find((x) => {
        return x.name == "lowest";
      });

      var maxValuesSeriesLastValue =
        greatestSeries.data[greatestSeries.data.length - 1];
      var maxValuesSeriesIndex = chartData.series.findIndex((x) => {
        return x.data[x.data.length - 1] == maxValuesSeriesLastValue;
      });

      this.setData(chartData);
      this.PropName = chartData.series[maxValuesSeriesIndex].name;
      this.PropIcon = "";
    } else {
      this.setData(chartData);
    }
    if (this.widgetRequestModel.FindResultSvgIcon == true) {
      //svg icon as per result
      var uppercaseRes = chartData.series[0].name.toUpperCase();
      this.ResSvgIcon = eventIconMapping[uppercaseRes];
    }
    return chartData;
  }

  setData(chartData: ClientChartModel, index: number = 0) {
    if (chartData.series[index].data.length > 1) {
      this.PropValue = Number(
        chartData.series[index].data[chartData.series[index].data.length - 1],
      );
      this.percentValue =
        ((Number(
          chartData.series[index].data[chartData.series[index].data.length - 1],
        ) -
          Number(
            chartData.series[index].data[
              chartData.series[index].data.length - 2
            ],
          )) /
          Number(
            chartData.series[index].data[
              chartData.series[index].data.length - 1
            ],
          )) *
        100;
    } else if (chartData.series[index].data.length > 0) {
      this.PropValue = Number(
        chartData.series[index].data[chartData.series[index].data.length - 1],
      );
      this.percentValue = 100;
    } else {
      this.PropValue = 0;
      this.percentValue = 0;
    }
  }

  findMaxLastValue(arr: ChartSeries[]): number {
    let maxLastValue = -Infinity;
    let maxIndex = -1;

    arr.forEach((subArray, index) => {
      const lastValue = Number(subArray.data[subArray.data.length - 1]);
      if (lastValue > maxLastValue) {
        maxLastValue = lastValue;
        maxIndex = index;
      }
    });

    return maxIndex;
  }
}
