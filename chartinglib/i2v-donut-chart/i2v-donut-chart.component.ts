import { ChangeDetectorRef, Component, ElementRef, Input } from "@angular/core";
import { I2vChartsComponent } from "../i2v-charts/i2v-charts.component";
import {
  LegendItemVisualArgs,
  SeriesLabelsContentArgs,
} from "@progress/kendo-angular-charts";
import { ChartsOutputModel } from "../Models/ChartsOutputModel";
import { ChartSeries, ClientChartModel } from "../Models/ClientChartModel";
import { ChartingDataService } from "../charting-data.service";
import { Enum_Method_Aggregation } from "../Models/Widget";
import { DonutChartWidget } from "../Models/widgetRequestModel/DonutChartRequestModel";

@Component({
  selector: "i2v-donut-chart",
  templateUrl: "./i2v-donut-chart.component.html",
  styleUrl: "./i2v-donut-chart.component.scss",
})
export class I2vDonutChartComponent extends I2vChartsComponent {
  @Input() override widgetRequestModel: DonutChartWidget = null;
  resultHeading: string;
  resultLabel: string;
  resultData: string;
  totalData: number = 0;
  seriesDataIndexArray : boolean[] = [];
  public labelContent(e: SeriesLabelsContentArgs): string {
    return e.category;
  }

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
    this.dataExists = false;
    this.resultLabel = this.widgetRequestModel.donutConf.resultLabel;
    const chartData = new ClientChartModel();
    this.seriesDataIndexArray = [] 
    chartData.series = data.data.map((x) => {
      this.seriesDataIndexArray.push(true);
      return new ChartSeries({ value: Number(x.data[0]), name: x.label });
    });
    var conf = this.widgetRequestModel.donutConf;

    if (conf.seriesAggregation == Enum_Method_Aggregation.Greatest) {
      var maxValue = -Infinity;
      chartData.series.forEach((seriesData) => {
        var res = maxValue < seriesData.value
        maxValue = res ? seriesData.value : maxValue;
        if (conf.showSeriesLabelValue)
          this.resultHeading = res ? seriesData.name : "";
      })
      this.resultData = maxValue.toString();
    }
    else if (conf.seriesAggregation == Enum_Method_Aggregation.Lowest) {
      var minValue = Infinity;
      chartData.series.forEach((seriesData, index) => {
        var res = minValue > seriesData.value
        minValue = res ? seriesData.value : minValue;
        if (conf.showSeriesLabelValue)
          this.resultHeading = res ? seriesData.name : "";
      })
      this.resultData = minValue.toString();

    }
    else {
      var value = 0;
      chartData.series.forEach((seriesData) => {
        value += seriesData.value;
      })
    }

    chartData.chartCategories = data.data.map((x) => {
      return x.label;
    });

    if (chartData.series.length > 0) {
      this.dataExists = true;
    }

    return chartData;
  }

  onLegendItemClick(event) {
    const index = this.chartData.series.findIndex((x) => {
      return x.name == event.text;
    });

    if (index != -1) {
      
      var chartData =  JSON.parse(JSON.stringify(this.chartData));
      this.seriesDataIndexArray[index] = !this.seriesDataIndexArray[index]
      this.seriesDataIndexArray.forEach((x, index) => {
        if(!x) delete chartData.series[index];
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
      else if (conf.seriesAggregation == Enum_Method_Aggregation.Lowest) {
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
