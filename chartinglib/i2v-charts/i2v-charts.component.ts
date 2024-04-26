import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { ChartSeries, ClientChartModel } from "../Models/ClientChartModel";
import { ChartsOutputModel } from "../Models/ChartsOutputModel";
import { ICustomFilter, RulePropertyType, RuleSet, Widget, ICustomFilterOutputEmittorModel, ITimeRange } from "../Models/WidgetRequestModel";
import { ChartingDataService } from "../charting-data.service";
import { equal } from "assert";
import { ruleSet } from "src/app/Models/ruleSet.model";


export enum CustomFilterEnum {
  "Video Sources" = "videoSourceId"
}

@Component({
  selector: "i2v-charts",
  templateUrl: "./i2v-charts.component.html",
  styleUrl: "./i2v-charts.component.scss",
})
export abstract class I2vChartsComponent {
  // @Input() chartCategories : chartCategories;
  @Input() customFilter: ICustomFilter;
  @Input() widgetRequestModel: Widget;
  @Output() daysFilterOutput: EventEmitter<ITimeRange> = new EventEmitter<ITimeRange>();
  @Output() customFilterOutput: EventEmitter<ICustomFilterOutputEmittorModel> = new EventEmitter<ICustomFilterOutputEmittorModel>();

  private _chartData: ClientChartModel;
  @Input()
  set chartData(data: ChartsOutputModel) {
    this._chartData = this.transformData(data);
  }
  get chartData(): ClientChartModel {
    return this._chartData;
  }

  private baseChartingDataService: ChartingDataService;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {

  }

  init(chartingDataService: ChartingDataService = null) {
    if (chartingDataService != null && chartingDataService != undefined) {
      this.baseChartingDataService = chartingDataService;
      setInterval(() => {
        this.getDataFromServer(this.widgetRequestModel);
      }, this.widgetRequestModel.refreshInterval * 1000);
    }
  }

  onCustomFilterValuesChange(event: ICustomFilterOutputEmittorModel) {
    console.log(event)
    switch (event.key) {
      case "Video Sources":
        if (this.widgetRequestModel.propertyFilters == null) {
          this.widgetRequestModel.propertyFilters = new RuleSet();
        }

        if (this.widgetRequestModel.propertyFilters.ruleSet == null) {
          this.widgetRequestModel.propertyFilters.ruleSet = []
        }
        else {
          this.widgetRequestModel.propertyFilters.condition = "and";
        }

        var index = this.isRuleSetAlreadyPresent(this.widgetRequestModel.propertyFilters, "VideoSourceId");
        if (index != -1) {
          if (event.value && event.value.length > 1) {
            this.setAlreadyPresentRuleSetValue(this.widgetRequestModel.propertyFilters, "VideoSourceId", event.value, index);
          }
          else {
            this.removeEmptyRuleSet(this.widgetRequestModel.propertyFilters, "VideoSourceId", index);
          }
        }
        else {
          this.widgetRequestModel.propertyFilters.ruleSet.push(this.createRule(event, "VideoSourceId"))
        }
        break;
    }
    this.getDataFromServer(this.widgetRequestModel);
    this.customFilterOutput.emit(event);
  }

  onTimeChange(event : ITimeRange) {
    console.log(event);
    this.widgetRequestModel.startTime = event.startTime;
    this.widgetRequestModel.endTime = event.endTime;
    this.getDataFromServer(this.widgetRequestModel);
    this.daysFilterOutput.emit(event);
  }

  getDataFromServer(widgetRequestModel: Widget) {
    if (widgetRequestModel != null) {
      this.baseChartingDataService
        .getChartingData(widgetRequestModel)
        .subscribe((data: any) => {
          this.chartData = data;
        });
    }
  }

  transformData(data: ChartsOutputModel): ClientChartModel {
    var chartData = new ClientChartModel();
    chartData.series = data.data.map((x) => {
      return new ChartSeries({ name: x.label, data: x.data });
    })
    if (data.labels.length > 0) {
      chartData.chartCategories = data.labels[0].value;
      chartData.x_label = data.labels[0].key
    }
    else {
      chartData.chartCategories = data.data.map((x) => {
        return x.label
      })
    }
    return chartData;
  }

  createRule(data: ICustomFilterOutputEmittorModel, fieldName: string): RuleSet {
    var ruleSet = new RuleSet();
    ruleSet.condition = "and"
    ruleSet.ruleSet = []
    ruleSet.rules = []
    ruleSet.rules.push({
      field: fieldName,
      operator: "Contains",
      value: data.value.join(','),
      type: RulePropertyType.StringArray
    })
    return ruleSet;
  }

  isRuleSetAlreadyPresent(propertyFilters: RuleSet, key: string): number {
    const index = propertyFilters.ruleSet.findIndex(ruleSet => {
      return ruleSet.rules.some(rule => rule.field === key);
    });

    return index;
  }

  setAlreadyPresentRuleSetValue(propertyFilters: RuleSet, key: string, data: string[], ruleSetIndex: number) {
    propertyFilters.ruleSet[ruleSetIndex].rules[0].value = data.join(',');
  }

  removeEmptyRuleSet(propertyFilters: RuleSet, key: string, ruleSetIndex: number) {
    propertyFilters.ruleSet.splice(ruleSetIndex, 1);
  }




}
