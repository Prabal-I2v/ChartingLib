import { ChangeDetectorRef, Component, ElementRef, Input } from "@angular/core";
import { I2vChartsComponent } from "../i2v-charts/i2v-charts.component";
import { ChartingDataService } from "../charting-data.service";
import { ChartsOutputModel } from "../Models/ChartsOutputModel";
import { ChartSeries, ClientChartModel } from "../Models/ClientChartModel";
import {
  emotionIconColorMapping,
  Enum_Month,
  eventIconMapping,
} from "../Models/vehicle-icon-mapping";
import { Enum_Method_Aggregation } from "../Models/enums/enums";
import { Kpi1DWidget } from "../Models/widgetRequestModel/KpiWidget1DModel";
import { Kpi2DWidget } from "../Models/widgetRequestModel/KpiWidget2DModel";

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
  chartData: ClientChartModel;
  @Input() override widgetRequestModel: Kpi1DWidget | Kpi2DWidget = null;
  percentValue: number = 0;
  svgIcon: string = "";
  ResSvgIcon: string = "";
  ResSvgIconColor: string = "#5F6F94";
  aggregatedData: number = 0;
  aggregatedDataLabel: string = "";
  aggregatedDataImage: string = '';
  isGreatest: boolean = false;
  isLowest: boolean = false;

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
  transformChartData(data: ChartsOutputModel) {
    this.dataExistsForShowableProperties = true;
    const chartData = new ClientChartModel();
    chartData.series = data.seriesData.map((x) => {
      return new ChartSeries({
        name: x.name,
        displayName: x.displayName,
        data: x.data,
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

    if (chartData.series.length > 0) {
      //if we don't have multivaluedColumn then we used clubbingAggregationType property and we get series as Lowest/greatest/total
      // if (this.widgetRequestModel.dataInputConfig.fieldsAggregationType != Enum_Method_Aggregation.None) {
      //   if (this.widgetRequestModel.dataInputConfig?.fieldsAggregationType == Enum_Method_Aggregation.Greatest) {
      //     const greatestSeries = chartData.series.find((x) => {
      //       return x.name.toLowerCase() == "greatest";
      //     });
      //     const maxValuesSeriesLastValue = greatestSeries.data[greatestSeries.data.length - 1];
      //     const maxValuesSeriesIndex = chartData.series.findIndex((x) => {
      //       return x.data[x.data.length - 1] == maxValuesSeriesLastValue;
      //     });
      //     this.setData(chartData.series[maxValuesSeriesIndex], 0);
      //     this.PropName = chartData.series[maxValuesSeriesIndex].name;
      //   }
      //   else if (this.widgetRequestModel.dataInputConfig?.fieldsAggregationType == Enum_Method_Aggregation.Least) {
      //     const lowestSeries = chartData.series.find((x) => {
      //       return x.name.toLowerCase() == "least";
      //     });
      //     const minValuesSeriesLastValue =
      //       lowestSeries.data[lowestSeries.data.length - 1];
      //     const minValuesSeriesIndex = chartData.series.findIndex((x) => {
      //       return x.data[x.data.length - 1] == minValuesSeriesLastValue;
      //     });
      //     this.setData(chartData.series[minValuesSeriesIndex], 0);
      //     this.PropName = chartData.series[minValuesSeriesIndex].name;
      //   }
      //   else if (this.widgetRequestModel.dataInputConfig?.fieldsAggregationType == Enum_Method_Aggregation.Total) {
      //     const totalSeries = chartData.series.find((x) => {
      //       return x.name.toLowerCase() == "total";
      //     });
      //     this.setData(totalSeries, 0);
      //   }
      // }
      // else if (this.widgetRequestModel.kpiConf) {
      //   const resultIndexBasedOnCountValueColumnName = this.findValueAsPerAggregation(this.widgetRequestModel.kpiConf, chartData.series);
      //   var countValueSeriesIndex = chartData.series.findIndex(series => series.name == this.widgetRequestModel.kpiConf.CountValueColumnName)
      //   var displayValueSeriesIndex = chartData.series.findIndex(series => series.name == this.widgetRequestModel.kpiConf.DisplayValueColumnName)
      //   this.setData(chartData.series[countValueSeriesIndex], resultIndexBasedOnCountValueColumnName, this.widgetRequestModel.kpiConf.showChart);
      //   this.PropName = chartData.series[displayValueSeriesIndex].data[resultIndexBasedOnCountValueColumnName];
      //   if (this.widgetRequestModel.kpiConf.ImageColumnName) {
      //     var imageValueSeriesIndex = chartData.series.findIndex(series => series.name == this.widgetRequestModel.kpiConf.ImageColumnName)
      //     this.propImage = chartData.series[imageValueSeriesIndex].data[resultIndexBasedOnCountValueColumnName];
      //   }
      // }
    }

    this.chartData = chartData;
    this.chartData.series = this.appendNameToAggregatedProperty(this.chartData);
    if (this.chartData.series.length == 0) {
      this.dataExistsForShowableProperties = false;
    }
    if (this.widgetRequestModel.kpiConf?.showAggregation) {
      const aggregationMethod =
        this.widgetRequestModel.kpiConf.dataAggregationMethod;

      // Collect all relevant values with labels in one step
      const valuesToAggregate: { value: number; label: string, image: string }[] = [];

      this.chartData.series.forEach((series) => {
        if (this.chartData.xAxisFields.length > 0) {
          // Case: xAxisFields are present
          this.chartData.xAxisFields.forEach((xAxisField, index) => {
            let value = Number(series.data[index]);
            let label = `${series.displayName} - ${xAxisField}`
            let image = ''
            if (this.widgetRequestModel.kpiConf?.countValueColumnName) {
              const series = this.findSeries(this.widgetRequestModel.kpiConf.countValueColumnName);
              if (series?.data?.[index] !== undefined) {
                value = Number(series.data[index]);
              }
            }

            if (this.widgetRequestModel.kpiConf?.displayValueColumnName) {
              const series = this.findSeries(this.widgetRequestModel.kpiConf.displayValueColumnName);
              if (series?.data?.[index] !== undefined) {
                label = series.data[index].toString();
              }
            }

            if (this.widgetRequestModel.kpiConf?.imageColumnName) {
              const series = this.findSeries(this.widgetRequestModel.kpiConf.imageColumnName);
              if (series?.data?.[index] !== undefined) {
                image = series.data[index].toString();
              }
            }

            if (!isNaN(value)) {
              valuesToAggregate.push({
                value: value,
                label: label, // Combines both
                image: image
              });
            }
          });
        } else {
          // Case: xAxisFields are absent
          const value = Number(series.data[0]);
          if (!isNaN(value)) {
            valuesToAggregate.push({
              value: value,
              label: `${series.displayName}`, // Only series name
              image: ''
            });
          }
        }
      });

      if (valuesToAggregate.length === 0) {
        // Handle empty safely
        this.aggregatedData = 0;
        this.aggregatedDataLabel = "";
        this.aggregatedDataImage = "";
        this.isGreatest = false;
        this.isLowest = false;
        return;
      }

      // Find Greatest & Lowest in a single pass
      let greatest = valuesToAggregate[0];
      let lowest = valuesToAggregate[0];
      let sum = 0;

      // Calculate Aggregation
      switch (aggregationMethod) {
        case Enum_Method_Aggregation.Greatest:
          valuesToAggregate.forEach((item) => {
            if (item.value > greatest.value) greatest = item;
          });
          this.aggregatedData = greatest.value;
          this.aggregatedDataLabel = greatest.label;
          this.aggregatedDataImage = greatest.image;
          this.isGreatest = true;
          break;

        case Enum_Method_Aggregation.Least:
          valuesToAggregate.forEach((item) => {
            if (item.value < lowest.value) lowest = item;
          });
          this.aggregatedData = lowest.value;
          this.aggregatedDataLabel = lowest.label;
          this.aggregatedDataImage = lowest.image;
          this.isLowest = true;          
          break;

        case Enum_Method_Aggregation.Total:
          valuesToAggregate.forEach((item) => {
            sum += item.value;
          });
          this.aggregatedData = sum;
          this.aggregatedDataLabel = "Total";
          break;
      }
    }
  }

  findSeries(columnName?: string): ChartSeries | undefined {
    if (!columnName || !this.chartData?.series?.length) return undefined;
    const colLower = columnName.toLowerCase();

    // 1. Direct match by name or displayName (case-insensitive)
    let series = this.chartData.series.find(s =>
      s.name?.toLowerCase() === colLower || s.displayName?.toLowerCase() === colLower
    );
    if (series) return series;

    // 2. Match via dataInputConfig.fieldNames (e.g. 'personId' -> 'PersonCount')
    if (this.widgetRequestModel?.dataInputConfig?.fieldNames?.length) {
      const field = this.widgetRequestModel.dataInputConfig.fieldNames.find(f =>
        f.name?.toLowerCase() === colLower || f.columnName?.toLowerCase() === colLower
      );
      if (field) {
        series = this.chartData.series.find(s =>
          s.name?.toLowerCase() === field.columnName?.toLowerCase() ||
          s.name?.toLowerCase() === field.name?.toLowerCase() ||
          s.displayName?.toLowerCase() === field.columnName?.toLowerCase()
        );
        if (series) return series;
      }
    }

    // 3. Fallback for 'count': find aggregated field or series containing 'count'
    if (colLower === 'count') {
      const aggField = this.widgetRequestModel?.dataInputConfig?.fieldNames?.find(f => f.applyAggregation);
      if (aggField) {
        series = this.chartData.series.find(s => s.name?.toLowerCase() === aggField.columnName?.toLowerCase());
        if (series) return series;
      }
      series = this.chartData.series.find(s => s.name?.toLowerCase().includes('count'));
      if (series) return series;
    }

    return undefined;
  }

  getSeriesDataByName(seriesName: string | undefined, index: number): any {
    if (!seriesName) return null;
    const series = this.findSeries(seriesName);
    return series?.data?.[index];
  }

  getFormattedLabel(displayName: string): string {
    return displayName
      .toLowerCase()

      // Remove the words "lowest", "least", "greatest"
      .replace(/\b(greatest|lowest|least)\b/g, '')

      // Remove parentheses but keep their content
      .replace(/[()]/g, '')

      // Clean up extra spaces and convert to uppercase
      .trim()
      .toUpperCase();
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
