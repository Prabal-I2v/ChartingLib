import { ChangeDetectorRef, Component, ElementRef, Input } from "@angular/core";
import { I2vChartsComponent } from "../i2v-charts/i2v-charts.component";
import { ChartingDataService } from "../charting-data.service";
import { ChartsOutputModel } from "../Models/ChartsOutputModel";
import { ChartSeries, ClientChartModel } from "../Models/ClientChartModel";
import { Enum_Method_Aggregation } from "../Models/Widget";
import { emotionIconColorMapping, eventIconMapping } from "../Models/vehicle-icon-mapping";
import { KPIConf, KpiWidget } from "../Models/widgetRequestModel/KpiWidgetRequestModel";

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
  @Input() override widgetRequestModel: KpiWidget = null;
  percentValue: number = 0;
  PropName: string = "";
  PropIcon: string = "";
  PropValue: number = 0;
  propImage : string;
  svgIcon: string = "";
  ResSvgIcon: string = "";
  ResSvgIconColor: string = "#5F6F94";
  //  RiseLevel: RiseLevel;
  @Input() disableTimeFilter: boolean = false;
  @Input() showChart: boolean = false;

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
  transformChartData(data: ChartsOutputModel): ClientChartModel {
    const chartData = new ClientChartModel();
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

    //if we don't have multivaluedColumn then we used clubbingAggregationType property and we get series as Lowest/greatest/total
    if (this.widgetRequestModel.clubbingAggregationType != null) {
      if (this.widgetRequestModel.clubbingAggregationType == Enum_Method_Aggregation.Greatest) {
        const greatestSeries = chartData.series.find((x) => {
          return x.name.toLowerCase() == "greatest";
        });

        const maxValuesSeriesLastValue = greatestSeries.data[greatestSeries.data.length - 1];
        const maxValuesSeriesIndex = chartData.series.findIndex((x) => {
          return x.data[x.data.length - 1] == maxValuesSeriesLastValue;
        });

        this.setData(chartData.series[maxValuesSeriesIndex], 0);
        this.PropName = chartData.series[maxValuesSeriesIndex].name;
      }
      else if (this.widgetRequestModel.clubbingAggregationType == Enum_Method_Aggregation.Lowest) {
        const lowestSeries = chartData.series.find((x) => {
          return x.name.toLowerCase() == "lowest";
        });

        const minValuesSeriesLastValue =
          lowestSeries.data[lowestSeries.data.length - 1];
        const minValuesSeriesIndex = chartData.series.findIndex((x) => {
          return x.data[x.data.length - 1] == minValuesSeriesLastValue;
        });

        this.setData(chartData.series[minValuesSeriesIndex], 0);
        this.PropName = chartData.series[minValuesSeriesIndex].name;
      }

      else if (this.widgetRequestModel.clubbingAggregationType == Enum_Method_Aggregation.Total) {
        const totalSeries = chartData.series.find((x) => {
          return x.name.toLowerCase() == "total";
        });
        this.setData(totalSeries, 0);
      }
    }
    else if (this.widgetRequestModel.kpiConf) {
      const resultIndexBasedOnCountValueColumnName = this.findValueAsPerAggregation(this.widgetRequestModel.kpiConf, chartData.series);
      var countValueSeriesIndex = chartData.series.findIndex(series => series.name == this.widgetRequestModel.kpiConf.CountValueColumnName)
      var displayValueSeriesIndex = chartData.series.findIndex(series => series.name == this.widgetRequestModel.kpiConf.DisplayValueColumnName)
            
      this.setData(chartData.series[countValueSeriesIndex], resultIndexBasedOnCountValueColumnName, this.widgetRequestModel.kpiConf.showChart);
      this.PropName = chartData.series[displayValueSeriesIndex].data[resultIndexBasedOnCountValueColumnName];
      if(this.widgetRequestModel.kpiConf.ImageColumnName)
      {
        var imageValueSeriesIndex = chartData.series.findIndex(series => series.name == this.widgetRequestModel.kpiConf.ImageColumnName)
        this.propImage = chartData.series[imageValueSeriesIndex].data[resultIndexBasedOnCountValueColumnName];
      }

    }
    else {
      this.setData(chartData.series[0]);
    }

    if (this.widgetRequestModel.findResultSvgIcon == true) {
      //svg icon as per result
      var uppercaseRes = chartData.series[0].name.toUpperCase();
      if(this.widgetRequestModel.kpiConf)
      {
        uppercaseRes =  this.PropName.toUpperCase();
        if(chartData.series[0].name.toUpperCase() == "EMOTION"){
          this.ResSvgIconColor = emotionIconColorMapping[uppercaseRes]
        }
          
      }
      
      this.ResSvgIcon = eventIconMapping[uppercaseRes];
       
    }
    return chartData;
  }

  setData(chartSeries: ChartSeries, index: number = 0, showSeries: boolean = false) {
    if(showSeries)
    {
      this.showChart = true;
    }
    if (chartSeries.data.length > 1) {
      this.PropValue = Number(chartSeries.data[index]);
      if (showSeries) {
        this.percentValue = (
          (Number(chartSeries.data[index]) - Number(chartSeries.data[index])) /
          Number(chartSeries.data[index])) * 100;
      }
    } else if (chartSeries.data.length == 1) {
      this.PropValue = Number(chartSeries.data[index]);
      if (showSeries) {
        this.percentValue = 100;
      }
    } else {
      this.PropValue = 0;
      if (showSeries) {
        this.percentValue = 0;
      }
    }
  }

  findValueAsPerAggregation(conf: KPIConf, arr: ChartSeries[]): number {
    if (arr.length === 0) {
      return 0;
    }
    if (!conf.seriesAggregation) {
      return 0;
    }
    else if (conf.seriesAggregation === Enum_Method_Aggregation.Greatest) {
      let maxLastValue = -Infinity;
      let maxIndex = -1;

      var series = arr.find(series => series.name == conf.CountValueColumnName)
      if (series) {
        series.data.forEach((x, index) => {
          if (Number(x) > Number(maxLastValue)) {
            maxLastValue = x;
            maxIndex = index;
          }
        })
      }

      return maxIndex;
    }
    else if (conf.seriesAggregation === Enum_Method_Aggregation.Lowest) {
      let minLastValue = Infinity;
      let minIndex = -1;

      var series = arr.find(series => series.name == conf.CountValueColumnName)
      if (series) {
        series.data.forEach((x, index) => {
          if (Number(x) < Number(minLastValue)) {
            minLastValue = x;
            minIndex = index;
          }
        })

        return minIndex;
      }
    }
    // Default return if no condition is met
    return 0; // Or any default value you prefer
  }

  showDetail() {
  //   const data: any = {};
  //   data.component = ShowDetectionPopupFrsComponent;
  //   data.data = {};
  //   const dialogData: CommonModalData = {
  //     event: data,
  //     width: '100%',
  //     heading: 'Person Detail',
  //     footerButtons: [],
  //     showPreviousButton: false,
  //     showNextButton: false,
  //     showBackButton: false,
  //   };

  //   const ref = this.dialog.open(CommonModalComponent, {
  //     panelClass: 'custom-dialog-container',
  //     data: dialogData,
  //   });
  //   ref.afterClosed().subscribe(() => { });
  }

}
