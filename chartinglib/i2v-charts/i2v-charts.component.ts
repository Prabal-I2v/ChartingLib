import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { ChartSeries, ClientChartModel } from "../Models/ClientChartModel";
import { ChartsOutputModel } from "../Models/ChartsOutputModel";
import { Widget } from "../Models/WidgetRequestModel";
import { ChartingDataService } from "../charting-data.service";

@Component({
  selector: "i2v-charts",
  templateUrl: "./i2v-charts.component.html",
  styleUrl: "./i2v-charts.component.scss",
})
export abstract class I2vChartsComponent {
  // @Input() chartCategories : chartCategories;

  @Input() widgetRequestModel: Widget;
  @Input() isModel: boolean;
  @Input() isLoading: boolean;
  @Input() dataExists: boolean;
  @Output() daysFilterOutput: EventEmitter<string> = new EventEmitter<string>();
  @Output() customFilterOutput: EventEmitter< string | number | string[] | number[] > = new EventEmitter<string | number | string[] | number[]>();

  private _chartData: ClientChartModel;
  @Input()
  set chartData(data: ChartsOutputModel) {
    this._chartData = this.transformData(data);
  }
  get chartData(): ClientChartModel {
    return this._chartData;
  }

  private baseChartingDataService : ChartingDataService;

  constructor() {}

  ngOnInit() {

  }

  init(chartingDataService: ChartingDataService = null){
    if (chartingDataService != null && chartingDataService != undefined) {
      this.isLoading = true;
      this.baseChartingDataService = chartingDataService;
      setInterval(() => {
        this.getDataFromServer(this.widgetRequestModel);
      }, this.widgetRequestModel.refreshInterval * 1000);
    }
  }

  onCustomFilterValuesChange(event) {
    this.customFilterOutput.emit(event);
  }

  onTimeChange(event) {
    this.daysFilterOutput.emit(event);
  }

  getDataFromServer(widgetRequestModel: Widget) {
    if (widgetRequestModel != null) {
      this.baseChartingDataService.getChartingData(widgetRequestModel).subscribe((data: any) => {
        if (!data) {
          this.chartData = data;
          this.dataExists = true;
        } else {
          this.dataExists = false;
        }
      });
      this.isLoading = false;
    }
  }

  transformData(data: ChartsOutputModel): ClientChartModel {
    var chartData = new ClientChartModel();
    chartData.series = data.data.map((x) => {
      return new ChartSeries({name:x.label, data:x.data});
    })
    if (data.labels.length > 0) {
      chartData.chartCategories = data.labels[0].value;
      chartData.x_label = data.labels[0].key
    }
    else{
      chartData.chartCategories = data.data.map((x) => {
        return x.label
      })
    }
    return chartData;
  }



}
