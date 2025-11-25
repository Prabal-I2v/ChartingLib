import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { ChartsOutputModel } from "../Models/ChartsOutputModel";
import { ChartingDataService } from "../charting-data.service";
import { Subject, Subscription, timer } from "rxjs";
import { debounce } from "rxjs/operators";
import { EventPropertyType } from "Analytic/ClientApp/src/app/Models/eventPropertyType.model";
import { v4 as uuidv4 } from 'uuid';
import { TableOutputModel } from "../Models/TableOutputModel";
import { Widget } from "../Models/Widget";
import { Enum_Method_Aggregation, Enum_Method_Aggregation_With_Labels, Enum_TimePeriod } from "../Models/enums/enums";
import { CustomFilterValueModel, RuleSet } from "../Models/types/types";
import { ICustomFilter, ISetIntervalFilterOutputEmittorModel, IDateTimeFilterOutputEmittorModel, ICustomFilterOutputEmittorModel, ITimeRange, ICommonFilterOutputEmittorModel } from "../Models/interfaces/interfaces";
import { ChartSeries, ClientChartModel } from "../Models/ClientChartModel";

@Component({
  selector: "i2v-charts",
  templateUrl: "./i2v-charts.component.html",
  styleUrl: "./i2v-charts.component.scss",
})
export abstract class I2vChartsComponent implements OnInit {
  isModel: boolean;
  isLoading: boolean;
  dataExists: boolean;
  dataExistsForShowableProperties: boolean = true;

  isCustomFilterApplied: boolean = false;
  isChartToBeRemoved: boolean = false;
  @Input() showEntity: boolean = true;
  @Input() showTimeFilter: boolean = true;
  @Input() showRefreshInterval: boolean = true;
  @Input() showFilterValues: boolean = false;
  @Output() showFilterValuesChange = new EventEmitter<boolean>();
  @Output() widgetResizeCallbackEmittor = new EventEmitter<any>();
  @Output() widgetRemoveCallbackEmittor = new EventEmitter<any>();
  @Output() editWidgetOutput = new EventEmitter<any>();
  @Output() copiedWidgetOutput = new EventEmitter<any>();

  //this property is used pass initial value for filters like all time filters, all videosources and all
  applyToAllEnabled: boolean = false;
  @Input() customFilters: ICustomFilter;
  @Input() widgetRequestModel: Widget;
  @Input() refreshCallSubject: Subject<any> = new Subject<any>();
  @Input() dashboardCustomFilterValue: ICustomFilter = {};
  @Input() isEditModeOn: boolean = false;
  @Output()
  refreshIntervalFilterOutput: EventEmitter<ISetIntervalFilterOutputEmittorModel> =
    new EventEmitter<ISetIntervalFilterOutputEmittorModel>();
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
  customFilterValues: Record<string, CustomFilterValueModel[]>;

  constructor(public cd: ChangeDetectorRef, private chartingDataService: ChartingDataService, private elementRef?: ElementRef) {
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
        this.setRefreshInterval()
      }
      if (this.widgetRequestModel.filterConfig.isDashboardFilterApplied) {
        this.widgetRequestModel.filterConfig.customFilters = JSON.parse(JSON.stringify(this.dashboardCustomFilterValue));
      } else {
        this.isCustomFilterApplied = true;
      }
    } else {
      this.isModel = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dashboardCustomFilterValue?.currentValue !== changes.dashboardCustomFilterValue?.previousValue) {
      this.applyToAllEnabled = this.dashboardCustomFilterValue?.["ApplyToAll"]?.[0]?.returnValue as boolean;
      this.updateCustomFiltersValues();
    }
    else if
      (!changes.isEditModeOn?.currentValue) {
      this.customFilterValues = { ...this.widgetRequestModel.filterConfig.customFilters };
      this.showFilterValues = false;
      if (this.isCustomFilterApplied && this.applyToAllEnabled) {
        this.isCustomFilterApplied = false;
        this.widgetRequestModel.filterConfig.isDashboardFilterApplied = true;
        this.widgetResizeCallback(this.showFilterValues);
      }
    }
  }

  onShowFilterValuesChange() {
    this.widgetResizeCallback(this.showFilterValues);
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
            this.widgetRequestModel.filterConfig.customFilters[customFilter.key] = this.customFilters[
              customFilter.key
            ].filter((x) => customFilter.value.includes(String(x.returnValue)));

            if (this.widgetRequestModel.filterConfig.propertyFilters == null) {
              this.widgetRequestModel.filterConfig.propertyFilters = new RuleSet();
            }

            if (this.widgetRequestModel.filterConfig.propertyFilters.ruleSet == null) {
              this.widgetRequestModel.filterConfig.propertyFilters.ruleSet = [];
            } else {
              this.widgetRequestModel.filterConfig.propertyFilters.condition = "and";
            }

            const index = this.isRuleSetAlreadyPresent(
              this.widgetRequestModel.filterConfig.propertyFilters,
              "VideoSourceId",
            );
            if (index != -1) {
              if (customFilter.value && customFilter.value.length > 0) {
                this.setAlreadyPresentRuleSetValue(
                  this.widgetRequestModel.filterConfig.propertyFilters,
                  "VideoSourceId",
                  customFilter.value,
                  index,
                );
              } else {
                this.removeEmptyRuleSet(
                  this.widgetRequestModel.filterConfig.propertyFilters,
                  "VideoSourceId",
                  index,
                );
              }
            } else {
              if (customFilter.value && customFilter.value.length > 0) {
                this.widgetRequestModel.filterConfig.propertyFilters.ruleSet.push(
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

      this.widgetRequestModel.filterConfig.customFilters["Time"] = [
        { displayName: timeFilter.displayName, returnValue: timeRange },
      ];
      this.widgetRequestModel.filterConfig.startTime = timeRange.startTime;
      this.widgetRequestModel.filterConfig.endTime = timeRange.endTime;
    }


    if ("RefreshInterval" in dashboardCustomFilterValue) {
      var refreshIntervalValue = Number(dashboardCustomFilterValue["RefreshInterval"][0].returnValue);

      this.widgetRequestModel.filterConfig.customFilters["RefreshInterval"] = [
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
          this.onRefreshIntervalChange(<ISetIntervalFilterOutputEmittorModel>changeEvents[key]);
          break;
        case "DateFilterEmitModel":
          this.onTimeChange(<IDateTimeFilterOutputEmittorModel>changeEvents[key], true);
          break;
        case "CustomFilterEmitModel":
          this.onCustomFilterValuesChange(<ICustomFilterOutputEmittorModel>changeEvents[key], true);
          break;
      }
    });
    this.widgetRequestModel.filterConfig.isDashboardFilterApplied = false;
    this.getDataFromServer(this.widgetRequestModel);
  }

  onEditWidgetOutput() {
    this.editWidgetOutput.next(this.widgetRequestModel);
  }

  onCustomFilterValuesChange(
    event: ICustomFilterOutputEmittorModel,
    commonCall: boolean = false,
  ) {
    switch (event.key) {
      // case null: {
      //   // Check if Video Sources exists in the customFilters
      //   if (this.widgetRequestModel.filterConfig.customFilters?.["Video Sources"]) {
      //     // Remove Video Sources from customFilters
      //     delete this.widgetRequestModel.filterConfig.customFilters["Video Sources"];
      //     }
      //   }

      case "Video Sources": {
        this.widgetRequestModel.filterConfig.customFilters[event.key] = this.customFilters[
          event.key
        ].filter((x) => event.value.includes(String(x.returnValue)));

        if (this.widgetRequestModel.filterConfig.propertyFilters == null) {
          this.widgetRequestModel.filterConfig.propertyFilters = new RuleSet();
        }

        if (this.widgetRequestModel.filterConfig.propertyFilters.ruleSet == null) {
          this.widgetRequestModel.filterConfig.propertyFilters.ruleSet = [];
        } else {
          this.widgetRequestModel.filterConfig.propertyFilters.condition = "and";
        }

        const index = this.isRuleSetAlreadyPresent(
          this.widgetRequestModel.filterConfig.propertyFilters,
          "VideoSourceId",
        );
        if (index != -1) {
          if (event.value && event.value.length > 0) {
            this.setAlreadyPresentRuleSetValue(
              this.widgetRequestModel.filterConfig.propertyFilters,
              "VideoSourceId",
              event.value,
              index,
            );
          } else {
            this.removeEmptyRuleSet(
              this.widgetRequestModel.filterConfig.propertyFilters,
              "VideoSourceId",
              index,
            );
          }
        } else {
          if (event.value && event.value.length > 0) {
            this.widgetRequestModel.filterConfig.propertyFilters.ruleSet.push(
              this.createRule(event, "VideoSourceId"),
            );
          }
        }
        break;
      }
    }
    this.widgetRequestModel.filterConfig.isDashboardFilterApplied = false;
    this.isCustomFilterApplied = true;
    this.getDataFromServer(this.widgetRequestModel);
  }

  onTimeChange(
    event: IDateTimeFilterOutputEmittorModel,
    commonCall: boolean = false,
  ) {
    this.widgetRequestModel.filterConfig.customFilters["Time"] = [
      { displayName: event.key, returnValue: event.value },
    ];
    this.widgetRequestModel.filterConfig.startTime = event.value.startTime;
    this.widgetRequestModel.filterConfig.endTime = event.value.endTime;

    this.widgetRequestModel.filterConfig.isDashboardFilterApplied = false;
    this.getDataFromServer(this.widgetRequestModel);
  }

  onRefreshIntervalChange(event: ISetIntervalFilterOutputEmittorModel) {
    this.widgetRequestModel.filterConfig.customFilters["RefreshInterval"] = [
      { displayName: event.key, returnValue: event.value },
    ];
    this.widgetRequestModel.refreshInterval = event.value;
    this.widgetRequestModel.filterConfig.isDashboardFilterApplied = false;
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

  // Type guard functions
  private isChartsOutputModel(data: any): data is ChartsOutputModel {
    return data && 'labels' in data && 'seriesData' in data;
  }

  private isTableOutputModel(data: any): data is TableOutputModel {
    return data && 'columns' in data && 'rows' in data;
  }

  // The actual API call is moved to this method
  private setTimeAccordingToWidget(widgetRequestModel: Widget): void {
    if (!widgetRequestModel?.filterConfig?.customFilters?.Time?.[0]) {
      return;
    }

    const timeFilter = widgetRequestModel.filterConfig.customFilters.Time[0];
    const today = new Date();
    let startDate: Date;

    switch (timeFilter.displayName) {
      case 'Today':
        // Set to start of today
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        widgetRequestModel.filterConfig.startTime = startDate.getTime();
        widgetRequestModel.filterConfig.endTime = today.getTime();
        break;

      case 'Last 7 days':
        // Set to 7 days ago from start of today
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7, 0, 0, 0);
        widgetRequestModel.filterConfig.startTime = startDate.getTime();
        widgetRequestModel.filterConfig.endTime = today.getTime();
        break;

      case 'Last 30 days':
        // Set to 30 days ago from start of today
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate(), 0, 0, 0);
        widgetRequestModel.filterConfig.startTime = startDate.getTime();
        widgetRequestModel.filterConfig.endTime = today.getTime();
        break;

      case 'Custom':
        // For custom, use the timeRange values directly from the filter
        const timeRange = timeFilter.returnValue as ITimeRange;
        if (timeRange) {
          widgetRequestModel.filterConfig.startTime = timeRange.startTime;
          widgetRequestModel.filterConfig.endTime = timeRange.endTime;
        }
        break;
    }

    // Update the time range in customFilters as well
    widgetRequestModel.filterConfig.customFilters.Time[0].returnValue = {
      startTime: widgetRequestModel.filterConfig.startTime,
      endTime: widgetRequestModel.filterConfig.endTime
    };
  }

  private fetchDataFromServer(widgetRequestModel: Widget) {
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
    }
    this.setTimeAccordingToWidget(widgetRequestModel);
    this.apiSubscription = this.chartingDataService
      .getChartingData(widgetRequestModel)
      .subscribe(
        // In your subscription handler
        (data: ChartsOutputModel | TableOutputModel) => {
          this.dataExists = false;

          if (data) {
            // this.transformChartData(data);
            // this.dataExists = true;
            if (this.isChartsOutputModel(data) && this.checkIfAnySeriesExists(data)) {
              this.transformChartData(data);
              this.dataExists = true;
            }
            else if (this.isTableOutputModel(data)) {
              // this.tableData = data;
              this.transformChartData(data);
              this.dataExists = true;
            }
          }
          this.cd.detectChanges();
          this.isLoading = false;
          this.cd.detectChanges();
        },
        (error) => {
          this.dataExists = false;
          this.isLoading = false;
          this.cd.detectChanges();
        }
      );
  }

  // Chart transformation (your original logic)
  public abstract transformChartData(data: ChartsOutputModel | TableOutputModel): void;

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
    const index = data.seriesData.findIndex((x) => {
      return x.data.length > 0;
    });

    return index != -1 ? true : false;
  }

  setRefreshInterval() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.widgetRequestModel.refreshInterval != -1) {
      this.interval = setInterval(() => {
        this.getDataFromServer(this.widgetRequestModel);
      }, this.widgetRequestModel.refreshInterval * 1000);
    }
  }

  ngOnDestroy() {
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
    }

    if (this.debouncedRefreshSubscription) {
      this.debouncedRefreshSubscription.unsubscribe();
    }

    if (this.refreshCallSubjectSubscription) {
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

  widgetResizeCallback(value: boolean) {
    this.cd.detectChanges();
    const height = this.elementRef.nativeElement.offsetHeight;
    const width = this.elementRef.nativeElement.offsetWidth;
    this.widgetResizeCallbackEmittor.emit({ "value": value, "height": height, "width": width });
  }

  public onWidgetRemoveCallback(value: boolean) {
    this.cd.detectChanges();
    if (value) {
      this.isChartToBeRemoved = true;
    }
    else {
      this.isChartToBeRemoved = false
    }
    this.widgetRemoveCallbackEmittor.emit(value);
  }

  onTimeDurationChanged(event: string) {
    const newTimePeriod = Enum_TimePeriod[event.toLowerCase() as keyof typeof Enum_TimePeriod];
    if (!newTimePeriod) {
      return;
    }
    this.updateTimePeriodInWidget(this.widgetRequestModel, newTimePeriod);
    this.getDataFromServer(this.widgetRequestModel);
  }

  private updateTimePeriodInWidget(widgetModel: any, newTimePeriod: string) {
    if (!widgetModel) {
      console.error("Widget model is undefined.");
      return;
    }
    // Update groupBy1 and groupBy2 if they are time-based
    if (widgetModel.groupBy1?.isTime) {
      widgetModel.groupBy1.mainColumn = newTimePeriod;
    }

    if (widgetModel.groupBy2?.isTime) {
      widgetModel.groupBy2.mainColumn = newTimePeriod;
    }

    // Update showableProperties
    widgetModel.showableProperties?.forEach((property: any) => {
      if (this.isTimeRelatedProperty(property.name)) {
        property.name = newTimePeriod.toLowerCase();
        property.displayName = this.capitalizeFirstLetter(newTimePeriod);
      }

      //  dependentOnColumn inside multiValued
      if (property.multiValued?.dependentOnColumn && this.isTimeRelatedProperty(property.multiValued.dependentOnColumn)) {
        property.multiValued.dependentOnColumn = this.capitalizeFirstLetter(newTimePeriod);
      }
    });

    // Update showablePropertiesLabel
    widgetModel.showablePropertiesLabel?.forEach((label: any) => {
      if (this.isTimeRelatedProperty(label.name)) {
        label.name = newTimePeriod.toLowerCase();
        label.displayName = this.capitalizeFirstLetter(newTimePeriod);
      }
    });
  }

  private isTimeRelatedProperty(propertyName: string): boolean {
    return ["day", "month", "year", "week"].some(keyword =>
      propertyName?.toLowerCase().includes(keyword)
    );
  }

  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  clearCustomFiltersValues(event) {
    if (event) {
      this.widgetRequestModel.filterConfig.customFilters = { ...this.dashboardCustomFilterValue };
      this.setValueAsPerWidgetCustomFiltersValue(this.dashboardCustomFilterValue);
      this.widgetRequestModel.filterConfig.customFilters = JSON.parse(JSON.stringify(this.widgetRequestModel.filterConfig.customFilters));
      this.widgetRequestModel.filterConfig.isDashboardFilterApplied = true;
      this.cd.detectChanges();
    }
  }

  updateCustomFiltersValues() {
    if (this.widgetRequestModel.filterConfig.isDashboardFilterApplied || this.applyToAllEnabled) {
      //apply time without checking apply to all
      this.setValueAsPerWidgetCustomFiltersValue({ 'Time': this.dashboardCustomFilterValue['Time'] });

      if (this.isCustomFilterApplied) {
        this.widgetRequestModel.filterConfig.isDashboardFilterApplied = this.applyToAllEnabled;
        const isCustomFilterValuesEmpty = !this.customFilterValues || Object.keys(this.customFilterValues).length === 0;
        if (isCustomFilterValuesEmpty) {
          this.customFilterValues = { ...this.widgetRequestModel.filterConfig.customFilters };
        }
      }
      if (!this.applyToAllEnabled) {
        this.widgetRequestModel.filterConfig.customFilters = {
          ...(this.customFilterValues)
        };
        this.setValueAsPerWidgetCustomFiltersValue(this.widgetRequestModel.filterConfig.customFilters);
        this.widgetRequestModel.filterConfig.customFilters = JSON.parse(JSON.stringify(this.widgetRequestModel.filterConfig.customFilters));
      } else {
        this.widgetRequestModel.filterConfig.customFilters = { ...this.dashboardCustomFilterValue };
        this.setValueAsPerWidgetCustomFiltersValue(this.dashboardCustomFilterValue);
        this.widgetRequestModel.filterConfig.customFilters = JSON.parse(JSON.stringify(this.widgetRequestModel.filterConfig.customFilters));
        this.widgetRequestModel.filterConfig.isDashboardFilterApplied = true;
      }
      this.cd.detectChanges();
    }
  }

  appendNameToAggregatedProperty(chartData: ClientChartModel): ChartSeries[] {
    if (this.widgetRequestModel.dataInputConfig.fieldsAggregationType == Enum_Method_Aggregation.Greatest || this.widgetRequestModel.dataInputConfig.fieldsAggregationType == Enum_Method_Aggregation.Least) {
      var aggregatedSeriesIndex = chartData.series.findIndex((x) => x.name.toLowerCase() == Enum_Method_Aggregation_With_Labels[this.widgetRequestModel.dataInputConfig.fieldsAggregationType].toLowerCase())
      if (aggregatedSeriesIndex !== -1) {
        const aggregatedSeriesValueArray = chartData.series[aggregatedSeriesIndex].data;

        if (aggregatedSeriesValueArray.length == 1) {
          const aggregatedValue = aggregatedSeriesValueArray[0];
          const resArray = chartData.series.filter((x, index) => x.data[0] === aggregatedValue && index != aggregatedSeriesIndex).map(y => y.name);
          if (resArray.length > 0) {
            chartData.series[aggregatedSeriesIndex].displayName += ` (${resArray.join(' , ')})`;
          }
        }
      }
    }

    return chartData.series;
  }

  isShowableSeries(chartSeries: ChartSeries): boolean {
    var isSeriesShowable = this.widgetRequestModel.showableProperties.find(
      x =>
        x.displayName.toLowerCase() === chartSeries.name.toLowerCase() ||
        x.name.toLowerCase() === chartSeries.displayName.toLowerCase()
    );
    return isSeriesShowable ? true : false;
  }

  seriesTrackBy(index: number): string | number {
    // Assuming each series has a unique 'id' or 'displayName'
    return index;
  }

  xAxisTrackBy(index: number): string | number {
    return index;
  }

}
