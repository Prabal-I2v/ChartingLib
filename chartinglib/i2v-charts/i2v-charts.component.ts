import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges
} from "@angular/core";
import { ChartSeries, ClientChartModel } from "../Models/ClientChartModel";
import { ChartsOutputModel } from "../Models/ChartsOutputModel";
import { ICustomFilter, RulePropertyType, RuleSet, Widget, ICustomFilterOutputEmittorModel, ITimeRange, IDateTimeFilterOutputEmittorModel } from "../Models/WidgetRequestModel";
import { ChartingDataService } from "../charting-data.service";
import { dashboard } from "../Models/DashboardModel";


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

  @Input() widgetRequestModel: Widget;
  @Input() isModel: boolean;
  @Input() isLoading: boolean;
  @Input() dataExists: boolean;
  @Input() customFilters: ICustomFilter;

  @Input() dashboardCustomFilterValue : ICustomFilter = {};
  @Output() daysFilterOutput: EventEmitter<IDateTimeFilterOutputEmittorModel> = new EventEmitter<IDateTimeFilterOutputEmittorModel>();
  @Output() customFilterOutput: EventEmitter<ICustomFilterOutputEmittorModel> = new EventEmitter<ICustomFilterOutputEmittorModel>();

  private _chartData: ClientChartModel;
  @Input()
  set chartData(data: ChartsOutputModel) {
    this._chartData = this.transformData(data);
  }
  get chartData(): ClientChartModel {
    return this._chartData;
  }

  get getDefinedFilterValue(){
    // if(Object.keys(this.widgetRequestModel.customFilters).length == 0 && Object.keys(this.dashboardCustomFilterValue).length == 0)
    //   {
    //     return this.widgetRequestModel.customFilters;
    //   }
    // else if(Object.keys(this.widgetRequestModel.customFilters).length > 0)
    //   {
    //     return this.widgetRequestModel.customFilters;
    //   }
    //   else{
        return this.dashboardCustomFilterValue 
      // }
  }
  private baseChartingDataService: ChartingDataService;
  private cdr: ChangeDetectorRef;

  constructor() { }

  ngOnInit() {
    if(Object.keys(this.widgetRequestModel.customFilters).length == 0)
      {
        this.widgetRequestModel.customFilters = this.dashboardCustomFilterValue
      }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
    //because chart header is not detecting chnages
    this.widgetRequestModel.customFilters = JSON.parse(JSON.stringify(this.widgetRequestModel.customFilters));
    if(changes.dashboardCustomFilterValue && changes.dashboardCustomFilterValue.currentValue !== changes.dashboardCustomFilterValue.previousValue)
    {
      this.widgetRequestModel.customFilters = this.dashboardCustomFilterValue; 
    }
  }

  init(cdr: ChangeDetectorRef, chartingDataService: ChartingDataService = null) {
    if (chartingDataService != null && chartingDataService != undefined) {
      this.isLoading = true;
      this.baseChartingDataService = chartingDataService;
    }
    if (cdr != null && cdr != undefined) {
      this.cdr = cdr;
    }
  }



  ngAfterViewInit() {
    if (this.baseChartingDataService != undefined && this.baseChartingDataService != null)
      setInterval(() => {
        this.getDataFromServer(this.widgetRequestModel);
      }, this.widgetRequestModel.refreshInterval * 1000);
  }

  onCustomFilterValuesChange(event: ICustomFilterOutputEmittorModel) {
    console.log(event)
    switch (event.key) {
      case "Video Sources":
        this.widgetRequestModel.customFilters[event.key] = this.customFilters[event.key].filter(x => event.value.includes(String(x.returnValue)));

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
          if (event.value && event.value.length > 0) {
            this.setAlreadyPresentRuleSetValue(this.widgetRequestModel.propertyFilters, "VideoSourceId", event.value, index);
          }
          else {
            this.removeEmptyRuleSet(this.widgetRequestModel.propertyFilters, "VideoSourceId", index);
          }
        }
        else {
          if (event.value && event.value.length > 0) {
            this.widgetRequestModel.propertyFilters.ruleSet.push(this.createRule(event, "VideoSourceId"))
          }
        }
        break;
    }
    this.getDataFromServer(this.widgetRequestModel);
    this.customFilterOutput.emit(event);
  }

  onTimeChange(event: IDateTimeFilterOutputEmittorModel) {
    console.log(event);
    this.widgetRequestModel.customFilters['Time'] = [{ displayName: event.key, returnValue: event.value }];
    this.widgetRequestModel.startTime = event.value.startTime;
    this.widgetRequestModel.endTime = event.value.endTime;
    this.getDataFromServer(this.widgetRequestModel);
    this.daysFilterOutput.emit(event);
  }

  getDataFromServer(widgetRequestModel: Widget) {
    if (widgetRequestModel != null) {
      this.baseChartingDataService.getChartingData(widgetRequestModel).subscribe((data: ChartsOutputModel) => {
        if (data && this.checkIfAnySeriesExists(data)) {
          this.chartData = data;
          this.dataExists = true;
        } else {
          this.dataExists = false;
        }
      },
        (error) => {
          this.dataExists = false;
        });
      this.isLoading = false;
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

  checkIfAnySeriesExists(data: ChartsOutputModel): boolean {
    var index = data.data.findIndex(x => {
      return x.data.length > 0;
    })

    return index != -1 ? true : false;
  }


}
