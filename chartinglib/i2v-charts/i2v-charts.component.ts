import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { ChartSeries, ClientChartModel } from "../Models/ClientChartModel";
import { ChartsOutputModel } from "../Models/ChartsOutputModel";
import {
  ICustomFilter,
  RuleSet,
  Widget,
  ICustomFilterOutputEmittorModel,
  ITimeRange,
  IDateTimeFilterOutputEmittorModel,
  ISetIntervalFilterOutputEmittorModel as IRefreshIntervalFilterOutputEmittorModel,
  ICommonFilterOutputEmittorModel,
} from "../Models/Widget";
import { ChartingDataService } from "../charting-data.service";
import { Subject, Subscription, timer } from "rxjs";
import { debounce } from "rxjs/operators";
import { month } from "../Models/vehicle-icon-mapping";
import { EventPropertyType } from "src/app/Models/eventPropertyType.model";
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: "i2v-charts",
  templateUrl: "./i2v-charts.component.html",
  styleUrl: "./i2v-charts.component.scss",
})
export abstract class I2vChartsComponent implements OnInit {
  isModel: boolean;
  isLoading: boolean;
  dataExists: boolean;
  showFilterValue: boolean = false;

  //this property is used pass initial value for filters like all time filters, all videosources and all
  @Input() customFilters: ICustomFilter;
  @Input() widgetRequestModel: Widget;
  @Input() refreshCallSubject: Subject<any> = new Subject<any>();
  @Input() dashboardCustomFilterValue: ICustomFilter = {};
  @Input() isEditModeOn: boolean = false;
  @Output()
  refreshIntervalFilterOutput: EventEmitter<IRefreshIntervalFilterOutputEmittorModel> =
    new EventEmitter<IRefreshIntervalFilterOutputEmittorModel>();
  @Output() daysFilterOutput: EventEmitter<IDateTimeFilterOutputEmittorModel> =
    new EventEmitter<IDateTimeFilterOutputEmittorModel>();
  @Output() customFilterOutput: EventEmitter<ICustomFilterOutputEmittorModel> =
    new EventEmitter<ICustomFilterOutputEmittorModel>();

  private interval: NodeJS.Timeout;
  private apiSubscription: Subscription;
  private debouncedRefreshSubject: Subject<Widget> = new Subject<Widget>();
  private debouncedRefreshSubscription: Subscription;
  private refreshCallSubjectSubscription: Subscription;
  private debounceTime = 500; // milliseconds
  componentId: string;

  private _chartData: ClientChartModel;
  @Input()
  set chartData(data: ChartsOutputModel) {
    this._chartData = this.transformData(data);
  }
  get chartData(): ClientChartModel {
    return this._chartData;
  }

  constructor(private cd: ChangeDetectorRef, private chartingDataService: ChartingDataService) {
        // Generate and store a UUID when component is created
        this.componentId = uuidv4();
  }

  ngOnInit() {
    this.refreshCallSubjectSubscription = this.refreshCallSubject.subscribe(() => {
      this.getDataFromServer(this.widgetRequestModel);
    });

    // Set up the debounced data fetching
    this.debouncedRefreshSubscription = this.debouncedRefreshSubject
      .pipe(debounce(() => timer(this.debounceTime)))
      .subscribe((widgetRequestModel: Widget) => {
        this.fetchDataFromServer(widgetRequestModel);
      });

    if (this.widgetRequestModel) {
      this.isModel = true;
      if (this.widgetRequestModel.allowRefresh) {
        this.interval = setInterval(() => {
          this.getDataFromServer(this.widgetRequestModel);
        }, this.widgetRequestModel.refreshInterval * 1000);
      }
      if (this.widgetRequestModel.isDashboardFilterApplied) {
        this.widgetRequestModel.customFilters = JSON.parse(JSON.stringify(this.dashboardCustomFilterValue));
      }
    } else {
      this.isModel = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.dashboardCustomFilterValue &&
      changes.dashboardCustomFilterValue.currentValue !==
      changes.dashboardCustomFilterValue.previousValue
    ) {
      this.widgetRequestModel.customFilters = this.dashboardCustomFilterValue;
      this.setValueAsPerWidgetCustomFiltersValue(this.dashboardCustomFilterValue);
      this.widgetRequestModel = JSON.parse(JSON.stringify(this.widgetRequestModel))
      this.widgetRequestModel.isDashboardFilterApplied = true;
      this.cd.detectChanges();
    }
  }

  private setValueAsPerWidgetCustomFiltersValue(dashboardCustomFilterValue: ICustomFilter): void {
    if (!dashboardCustomFilterValue || Object.keys(dashboardCustomFilterValue).length === 0) {
      return;
    }

    for (const key of Object.keys(this.customFilters)) {
      if (key in dashboardCustomFilterValue) {
        var selectedCustomFilterkey = key;
        var selectedCustomFilterValue = dashboardCustomFilterValue[selectedCustomFilterkey]
          .map(x => String(x.returnValue));

        var customFilter = {
          key: selectedCustomFilterkey,
          value: selectedCustomFilterValue
        };

        switch (customFilter.key) {
          case "Video Sources": {
            this.widgetRequestModel.customFilters[customFilter.key] = this.customFilters[
              customFilter.key
            ].filter((x) => customFilter.value.includes(String(x.returnValue)));

            if (this.widgetRequestModel.propertyFilters == null) {
              this.widgetRequestModel.propertyFilters = new RuleSet();
            }

            if (this.widgetRequestModel.propertyFilters.ruleSet == null) {
              this.widgetRequestModel.propertyFilters.ruleSet = [];
            } else {
              this.widgetRequestModel.propertyFilters.condition = "and";
            }

            const index = this.isRuleSetAlreadyPresent(
              this.widgetRequestModel.propertyFilters,
              "VideoSourceId",
            );
            if (index != -1) {
              if (customFilter.value && customFilter.value.length > 0) {
                this.setAlreadyPresentRuleSetValue(
                  this.widgetRequestModel.propertyFilters,
                  "VideoSourceId",
                  customFilter.value,
                  index,
                );
              } else {
                this.removeEmptyRuleSet(
                  this.widgetRequestModel.propertyFilters,
                  "VideoSourceId",
                  index,
                );
              }
            } else {
              if (customFilter.value && customFilter.value.length > 0) {
                this.widgetRequestModel.propertyFilters.ruleSet.push(
                  this.createRule(customFilter, "VideoSourceId"),
                );
              }
            }
            break;
          }
        }
      }
    }

    if ("Time" in dashboardCustomFilterValue) {
      const timeFilter = dashboardCustomFilterValue["Time"][0];
      const timeRange = timeFilter.returnValue as ITimeRange;

      this.widgetRequestModel.customFilters["Time"] = [
        { displayName: timeFilter.displayName, returnValue: timeRange },
      ];
      this.widgetRequestModel.startTime = timeRange.startTime;
      this.widgetRequestModel.endTime = timeRange.endTime;
    }


    if ("RefreshInterval" in dashboardCustomFilterValue) {
      var refreshIntervalValue = Number(dashboardCustomFilterValue["RefreshInterval"][0].returnValue);

      this.widgetRequestModel.customFilters["RefreshInterval"] = [
        { displayName: "RefreshInterval", returnValue: refreshIntervalValue },
      ];
      this.widgetRequestModel.refreshInterval = refreshIntervalValue;
      this.setRefreshInterval();
    }


  }

  onCombineFilterOutputEmittor(changeEvents: ICommonFilterOutputEmittorModel) {
    Object.keys(changeEvents).forEach((key: string) => {
      switch (key) {
        case "RefreshIntervalEmitModel":
          this.onRefreshIntervalChange(<IRefreshIntervalFilterOutputEmittorModel>changeEvents[key]);
          break;
        case "DateFilterEmitModel":
          this.onTimeChange(<IDateTimeFilterOutputEmittorModel>changeEvents[key], true);
          break;
        case "CustomFilterEmitModel":
          this.onCustomFilterValuesChange(<ICustomFilterOutputEmittorModel>changeEvents[key], true);
          break;
      }
    });
    this.widgetRequestModel.isDashboardFilterApplied = false;
    this.getDataFromServer(this.widgetRequestModel);
  }

  onCustomFilterValuesChange(
    event: ICustomFilterOutputEmittorModel,
    commonCall: boolean = false,
  ) {
    switch (event.key) {
      case "Video Sources": {
        this.widgetRequestModel.customFilters[event.key] = this.customFilters[
          event.key
        ].filter((x) => event.value.includes(String(x.returnValue)));

        if (this.widgetRequestModel.propertyFilters == null) {
          this.widgetRequestModel.propertyFilters = new RuleSet();
        }

        if (this.widgetRequestModel.propertyFilters.ruleSet == null) {
          this.widgetRequestModel.propertyFilters.ruleSet = [];
        } else {
          this.widgetRequestModel.propertyFilters.condition = "and";
        }

        const index = this.isRuleSetAlreadyPresent(
          this.widgetRequestModel.propertyFilters,
          "VideoSourceId",
        );
        if (index != -1) {
          if (event.value && event.value.length > 0) {
            this.setAlreadyPresentRuleSetValue(
              this.widgetRequestModel.propertyFilters,
              "VideoSourceId",
              event.value,
              index,
            );
          } else {
            this.removeEmptyRuleSet(
              this.widgetRequestModel.propertyFilters,
              "VideoSourceId",
              index,
            );
          }
        } else {
          if (event.value && event.value.length > 0) {
            this.widgetRequestModel.propertyFilters.ruleSet.push(
              this.createRule(event, "VideoSourceId"),
            );
          }
        }
        break;
      }
    }
    this.widgetRequestModel.isDashboardFilterApplied = false;
    this.getDataFromServer(this.widgetRequestModel);
    // if (!commonCall) {
    //   this.getDataFromServer(this.widgetRequestModel);
    // }

    // this.customFilterOutput.emit(event);
  }

  onTimeChange(
    event: IDateTimeFilterOutputEmittorModel,
    commonCall: boolean = false,
  ) {
    this.widgetRequestModel.customFilters["Time"] = [
      { displayName: event.key, returnValue: event.value },
    ];
    this.widgetRequestModel.startTime = event.value.startTime;
    this.widgetRequestModel.endTime = event.value.endTime;

    this.widgetRequestModel.isDashboardFilterApplied = false;
    this.getDataFromServer(this.widgetRequestModel);
    // if (!commonCall) {
    //   this.getDataFromServer(this.widgetRequestModel);
    // }
    // this.daysFilterOutput.emit(event);
  }

  onRefreshIntervalChange(event: IRefreshIntervalFilterOutputEmittorModel) {
    this.widgetRequestModel.customFilters["RefreshInterval"] = [
      { displayName: event.key, returnValue: event.value },
    ];
    this.widgetRequestModel.refreshInterval = event.value;
    this.widgetRequestModel.isDashboardFilterApplied = false;
    this.setRefreshInterval();
    // this.refreshIntervalFilterOutput.emit(event);
  }

  getDataFromServer(widgetRequestModel: Widget) {
    if (widgetRequestModel != null) {
      this.isLoading = true;
      this.cd.detectChanges();
      // Trigger the debounced subject instead of directly calling the API
      this.debouncedRefreshSubject.next(widgetRequestModel);
    }
  }

  // The actual API call is moved to this method
  private fetchDataFromServer(widgetRequestModel: Widget) {
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
    }

    this.apiSubscription = this.chartingDataService
      .getChartingData(widgetRequestModel)
      .subscribe(
        (data: ChartsOutputModel) => {
          if (data && this.checkIfAnySeriesExists(data)) {
            this.chartData = data;
            this.dataExists = true;
          } else {
            this.dataExists = false;
          }
          this.isLoading = false;
          this.cd.detectChanges();
        },
        (error) => {
          this.dataExists = false;
          this.isLoading = false;
          this.cd.detectChanges();
        },
      );
  }

  transformData(data: ChartsOutputModel): ClientChartModel {
    let isMonthData = false;
    if (data.labels[0].key == "month") isMonthData = true;

    const chartData = new ClientChartModel();
    chartData.series = data.data.map((x) => {
      return new ChartSeries({ name: x.label, data: x.data });
    });
    if (data.labels.length > 0) {
      if (isMonthData) {
        const monthData: any[] = [];
        data.labels[0].value.forEach((x) => {
          monthData.push(month[parseInt(x) - 1]);
        });

        chartData.chartCategories = monthData;
      } else {
        chartData.chartCategories = data.labels[0].value;
      }

      chartData.x_label = data.labels[0].key;
    } else {
      chartData.chartCategories = data.data.map((x) => {
        return x.label;
      });
    }
    return chartData;
  }

  createRule(
    data: ICustomFilterOutputEmittorModel,
    fieldName: string,
  ): RuleSet {
    const ruleSet = new RuleSet();
    ruleSet.condition = "and";
    ruleSet.ruleSet = [];
    ruleSet.rules = [];
    ruleSet.rules.push({
      field: fieldName,
      operator: "Contains",
      value: data.value.join(","),
      type: EventPropertyType.StringArray,
    });
    return ruleSet;
  }

  isRuleSetAlreadyPresent(propertyFilters: RuleSet, key: string): number {
    const index = propertyFilters.ruleSet.findIndex((ruleSet) => {
      return ruleSet.rules.some((rule) => rule.field === key);
    });

    return index;
  }

  setAlreadyPresentRuleSetValue(
    propertyFilters: RuleSet,
    key: string,
    data: string[],
    ruleSetIndex: number,
  ) {
    propertyFilters.ruleSet[ruleSetIndex].rules[0].value = data.join(",");
  }

  removeEmptyRuleSet(
    propertyFilters: RuleSet,
    key: string,
    ruleSetIndex: number,
  ) {
    propertyFilters.ruleSet.splice(ruleSetIndex, 1);
  }

  checkIfAnySeriesExists(data: ChartsOutputModel): boolean {
    const index = data.data.findIndex((x) => {
      return x.data.length > 0;
    });

    return index != -1 ? true : false;
  }

  setRefreshInterval() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      this.getDataFromServer(this.widgetRequestModel);
    }, this.widgetRequestModel.refreshInterval * 1000);
  }

  ngOnDestroy() {
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
    }

    if (this.debouncedRefreshSubscription) {
      this.debouncedRefreshSubscription.unsubscribe();
    }

    if(this.refreshCallSubjectSubscription){
      this.refreshCallSubjectSubscription.unsubscribe();
    }

    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  formatUnixTimestamp(unix_timestamp) {
    // Create a new Date object using the Unix timestamp (in milliseconds)
    const date = new Date(unix_timestamp);

    // Extract date components
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const day = date.getDate().toString().padStart(2, "0");

    // Extract time components
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    // Format the date and time string in YYYY-MM-DD HH:MM:SS format
    const formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

    return formattedDateTime;
  }
}