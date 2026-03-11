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
import { ToastrService } from "ngx-toastr";

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
  private widgetLevelFilterBackup: ICustomFilter = {};
  isCustomFilterApplied: boolean = false;
  isChartToBeRemoved: boolean = false;
  private localWidgetRequestModel: Widget;
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

  constructor(public cd: ChangeDetectorRef, protected chartingDataService: ChartingDataService, private elementRef?: ElementRef,private toastr?: ToastrService,) {
    // Generate and store a UUID when component is created
    this.componentId = uuidv4();
  }

  ngOnInit() {
    this.refreshCallSubjectSubscription = this.refreshCallSubject.subscribe(() => {
      if (this.localWidgetRequestModel) this.getDataFromServer(this.localWidgetRequestModel);
    });
    this.localWidgetRequestModel = structuredClone(this.widgetRequestModel);
    // Set up the debounced data fetching
    this.debouncedRefreshSubscription = this.debouncedRefreshSubject
      .pipe(debounce(() => timer(this.debounceTime)))
      .subscribe((localWidgetRequestModel: Widget) => {
        this.fetchDataFromServer(localWidgetRequestModel);
      });
  
    if (this.localWidgetRequestModel) {
      this.widgetLevelFilterBackup = structuredClone(this.localWidgetRequestModel.filterConfig?.customFilters || {});
      this.isModel = true;
      this.localWidgetRequestModel.filterConfig = this.localWidgetRequestModel.filterConfig || { customFilters: {}, isDashboardFilterApplied: false };
      this.localWidgetRequestModel.filterConfig.customFilters = this.localWidgetRequestModel.filterConfig.customFilters || {};
      if (this.applyToAllEnabled) {
        this.localWidgetRequestModel.filterConfig.customFilters = JSON.parse(JSON.stringify(this.dashboardCustomFilterValue || {}));
      } else {
        this.isCustomFilterApplied = true;
      }
      this.getDataFromServer(this.localWidgetRequestModel);
    } else {
      this.isModel = false;
    }
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['widgetRequestModel'] && !changes['widgetRequestModel'].firstChange) {
  
      const prevModel = changes['widgetRequestModel'].previousValue as Widget;
      const currModel = changes['widgetRequestModel'].currentValue as Widget;
      const isSameWidget = prevModel?.id === currModel?.id;
      const filterConfigChanged =
        JSON.stringify(prevModel?.filterConfig) !== JSON.stringify(currModel?.filterConfig);
  
      const runtimeFilterConfig =
        isSameWidget && !filterConfigChanged && this.localWidgetRequestModel?.filterConfig
          ? structuredClone(this.localWidgetRequestModel.filterConfig)
          : null;
  
      this.localWidgetRequestModel = structuredClone(this.widgetRequestModel);
  
      // Restore runtime filterConfig — don't let dashboard save reset filters
      if (runtimeFilterConfig && this.localWidgetRequestModel) {
        this.localWidgetRequestModel.filterConfig = runtimeFilterConfig;
      }
  
      if (
        prevModel?.refreshInterval !== currModel?.refreshInterval ||
        prevModel?.allowRefresh !== currModel?.allowRefresh
      ) {
        this.localWidgetRequestModel.refreshInterval = currModel.refreshInterval;
        this.localWidgetRequestModel.allowRefresh = currModel.allowRefresh;
        this.setRefreshInterval();
      }
    }
  
    // dashboard filter value changed — rest stays same
    if (changes['dashboardCustomFilterValue'] &&
        changes['dashboardCustomFilterValue'].currentValue !== changes['dashboardCustomFilterValue'].previousValue) {
      this.applyToAllEnabled = this.dashboardCustomFilterValue?.['ApplyToAll']?.[0]?.returnValue as boolean;
      this.updateCustomFiltersValues();
      return;
    }
  
    if (changes['isEditModeOn'] &&
        changes['isEditModeOn'].currentValue !== changes['isEditModeOn'].previousValue) {
      if (!changes['isEditModeOn'].currentValue) {
        this.showFilterValues = false;
        if (this.isCustomFilterApplied && this.applyToAllEnabled) {
          this.isCustomFilterApplied = false;
          this.localWidgetRequestModel.filterConfig.isDashboardFilterApplied = true;
          this.widgetResizeCallback(this.showFilterValues);
        }
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
            this.localWidgetRequestModel.filterConfig.customFilters[customFilter.key] = this.customFilters[
              customFilter.key
            ].filter((x) => customFilter.value.includes(String(x.returnValue)));

            if (this.localWidgetRequestModel.filterConfig.propertyFilters == null) {
              this.localWidgetRequestModel.filterConfig.propertyFilters = new RuleSet();
            }

            if (this.localWidgetRequestModel.filterConfig.propertyFilters.ruleSet == null) {
              this.localWidgetRequestModel.filterConfig.propertyFilters.ruleSet = [];
            } else {
              this.localWidgetRequestModel.filterConfig.propertyFilters.condition = "and";
            }
            this.localWidgetRequestModel.filterConfig.propertyFilters.ruleSet = 
              (this.localWidgetRequestModel.filterConfig.propertyFilters.ruleSet || [])
                .filter(rs => !rs.rules?.some(r => r.field === "VideoSourceId"));
          
            if ((this.localWidgetRequestModel.filterConfig.propertyFilters as any).ruleset) {
              (this.localWidgetRequestModel.filterConfig.propertyFilters as any).ruleset = 
                ((this.localWidgetRequestModel.filterConfig.propertyFilters as any).ruleset || [])
                  .filter(rs => !rs.rules?.some(r => r.field === "VideoSourceId"));
            }
          
            if (customFilter.value && customFilter.value.length > 0) {
              this.localWidgetRequestModel.filterConfig.propertyFilters.ruleSet.push(
                this.createRule(customFilter, "VideoSourceId"),
              );
            }
          
            break;
          }
        }
      }
    }

    if ("Time" in dashboardCustomFilterValue) {
      const timeFilter = dashboardCustomFilterValue["Time"][0];
      const timeRange = timeFilter.returnValue as ITimeRange;

      this.localWidgetRequestModel.filterConfig.customFilters["Time"] = [
        { displayName: timeFilter.displayName, returnValue: timeRange },
      ];
      this.localWidgetRequestModel.filterConfig.startTime = timeRange.startTime;
      this.localWidgetRequestModel.filterConfig.endTime = timeRange.endTime;
    }


    if ("RefreshInterval" in dashboardCustomFilterValue) {
      var refreshIntervalValue = Number(dashboardCustomFilterValue["RefreshInterval"][0].returnValue);

      this.localWidgetRequestModel.filterConfig.customFilters["RefreshInterval"] = [
        { displayName: "RefreshInterval", returnValue: refreshIntervalValue },
      ];
      this.localWidgetRequestModel.refreshInterval = refreshIntervalValue;
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
    this.localWidgetRequestModel.filterConfig.isDashboardFilterApplied = false;
    this.getDataFromServer(this.localWidgetRequestModel);
  }

  onEditWidgetOutput() {
    this.editWidgetOutput.next(structuredClone(this.widgetRequestModel));
  }

  onCustomFilterValuesChange(
    event: ICustomFilterOutputEmittorModel,
    commonCall: boolean = false,
  ) {
    switch (event.key) {
      // case null: {
      //   // Check if Video Sources exists in the customFilters
      //   if (this.localWidgetRequestModel.filterConfig.customFilters?.["Video Sources"]) {
      //     // Remove Video Sources from customFilters
      //     delete this.localWidgetRequestModel.filterConfig.customFilters["Video Sources"];
      //     }
      //   }

      case "Video Sources": {
        this.localWidgetRequestModel.filterConfig.customFilters[event.key] = this.customFilters[
          event.key
        ].filter((x) => event.value.includes(String(x.returnValue)));

        if (this.localWidgetRequestModel.filterConfig.propertyFilters == null) {
          this.localWidgetRequestModel.filterConfig.propertyFilters = new RuleSet();
        }

        if (this.localWidgetRequestModel.filterConfig.propertyFilters.ruleSet == null) {
          this.localWidgetRequestModel.filterConfig.propertyFilters.ruleSet = [];
        } else {
          this.localWidgetRequestModel.filterConfig.propertyFilters.condition = "and";
        }

        const index = this.isRuleSetAlreadyPresent(
          this.localWidgetRequestModel.filterConfig.propertyFilters,
          "VideoSourceId",
        );
        if (index != -1) {
          if (event.value && event.value.length > 0) {
            this.setAlreadyPresentRuleSetValue(
              this.localWidgetRequestModel.filterConfig.propertyFilters,
              "VideoSourceId",
              event.value,
              index,
            );
          } else {
            this.removeEmptyRuleSet(
              this.localWidgetRequestModel.filterConfig.propertyFilters,
              "VideoSourceId",
              index,
            );
          }
        } else {
          if (event.value && event.value.length > 0) {
            this.localWidgetRequestModel.filterConfig.propertyFilters.ruleSet.push(
              this.createRule(event, "VideoSourceId"),
            );
          }
        }
        break;
      }
    }
    this.localWidgetRequestModel.filterConfig.isDashboardFilterApplied = false;
    this.isCustomFilterApplied = true;
    this.getDataFromServer(this.localWidgetRequestModel);
  }

  onTimeChange(
    event: IDateTimeFilterOutputEmittorModel,
    commonCall: boolean = false,
  ) {
    this.localWidgetRequestModel.filterConfig.customFilters["Time"] = [
      { displayName: event.key, returnValue: event.value },
    ];
    this.localWidgetRequestModel.filterConfig.startTime = event.value.startTime;
    this.localWidgetRequestModel.filterConfig.endTime = event.value.endTime;

    this.localWidgetRequestModel.filterConfig.isDashboardFilterApplied = false;
    this.getDataFromServer(this.localWidgetRequestModel);
  }

  onRefreshIntervalChange(event: ISetIntervalFilterOutputEmittorModel) {
    this.localWidgetRequestModel.filterConfig.customFilters["RefreshInterval"] = [
      { displayName: event.key, returnValue: event.value },
    ];
    this.localWidgetRequestModel.refreshInterval = event.value;
    this.localWidgetRequestModel.filterConfig.isDashboardFilterApplied = false;
    this.setRefreshInterval();
    // this.refreshIntervalFilterOutput.emit(event);
  }

  getDataFromServer(localWidgetRequestModel: Widget) {
    if (!localWidgetRequestModel) {
      return;
    }
    this.isLoading = true;
    this.cd.detectChanges();
    // Trigger the debounced subject instead of directly calling the API
    this.debouncedRefreshSubject.next(localWidgetRequestModel);
  }

  // Type guard functions
  private isChartsOutputModel(data: any): data is ChartsOutputModel {
    return data && 'labels' in data && 'seriesData' in data;
  }

  private isTableOutputModel(data: any): data is TableOutputModel {
    return data && 'columns' in data && 'rows' in data;
  }

  // The actual API call is moved to this method
  private setTimeAccordingToWidget(localWidgetRequestModel: Widget): void {
    if (!localWidgetRequestModel?.filterConfig?.customFilters?.Time?.[0]) {
      return;
    }

    const timeFilter = localWidgetRequestModel.filterConfig.customFilters.Time[0];
    const today = new Date();
    let startDate: Date;

    switch (timeFilter.displayName) {
      case 'Today':
        // Set to start of today
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        localWidgetRequestModel.filterConfig.startTime = startDate.getTime();
        localWidgetRequestModel.filterConfig.endTime = today.getTime();
        break;

      case 'Last 7 days':
        // Set to 7 days ago from start of today
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7, 0, 0, 0);
        localWidgetRequestModel.filterConfig.startTime = startDate.getTime();
        localWidgetRequestModel.filterConfig.endTime = today.getTime();
        break;

      case 'Last 30 days':
        // Set to 30 days ago from start of today
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate(), 0, 0, 0);
        localWidgetRequestModel.filterConfig.startTime = startDate.getTime();
        localWidgetRequestModel.filterConfig.endTime = today.getTime();
        break;

      case 'Custom':
        // For custom, use the timeRange values directly from the filter
        const timeRange = timeFilter.returnValue as ITimeRange;
        if (timeRange) {
          localWidgetRequestModel.filterConfig.startTime = timeRange.startTime;
          localWidgetRequestModel.filterConfig.endTime = timeRange.endTime;
        }
        break;
    }

    // Update the time range in customFilters as well
    localWidgetRequestModel.filterConfig.customFilters.Time[0].returnValue = {
      startTime: localWidgetRequestModel.filterConfig.startTime,
      endTime: localWidgetRequestModel.filterConfig.endTime
    };
  }

  private fetchDataFromServer(localWidgetRequestModel: Widget) {
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
    }
  
    // defensive guard
    if (!localWidgetRequestModel || !localWidgetRequestModel.filterConfig) {
      this.toastr.warning('fetchDataFromServer: missing localWidgetRequestModel or filterConfig');
      this.isLoading = false;
      this.cd.detectChanges();
      return;
    }
    this.setTimeAccordingToWidget(localWidgetRequestModel);
    if (this.localWidgetRequestModel.allowRefresh) {
      this.setRefreshInterval()
    }
    this.apiSubscription = this.chartingDataService
      .getChartingData(localWidgetRequestModel)
      .subscribe(
        (data: ChartsOutputModel | TableOutputModel) => {
          if (data === null || data === undefined) {
            // do NOT set dataExists=false here — keep loading so UI doesn't show "No Data" immediately
            this.toastr.info('fetchDataFromServer: api returned null/undefined, keeping loader');
            return;
          }
          if (this.isChartsOutputModel(data)) {
            const hasSeries = this.checkIfAnySeriesExists(data);
            this.dataExists = hasSeries;
            this.dataExistsForShowableProperties = true;
            if (hasSeries) {
              this.transformChartData(data);
            } else {
              // no series -> set flag so UI shows "No Data"
              this.dataExistsForShowableProperties = false;
            }
          } else if (this.isTableOutputModel(data)) {
            // tables considered valid
            this.dataExists = true;
            this.dataExistsForShowableProperties = true;
            this.transformChartData(data);
          } else {
            // unknown shape => no data
            this.dataExists = false;
            this.dataExistsForShowableProperties = true;
          }
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
    const refreshFilter = this.localWidgetRequestModel?.filterConfig?.customFilters?.['RefreshInterval']?.[0] || this.widgetRequestModel?.filterConfig?.customFilters?.['RefreshInterval']?.[0];
    
    if (!refreshFilter) {
        return;
    }
    const intervalValue = Number(refreshFilter.returnValue);

    if (intervalValue !== -1 && intervalValue > 0) {
        this.interval = setInterval(() => {
            this.getDataFromServer(this.localWidgetRequestModel);
        }, intervalValue * 1000);
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
    if (!this.elementRef) return;
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
    this.updateTimePeriodInWidget(this.localWidgetRequestModel, newTimePeriod);
    this.getDataFromServer(this.localWidgetRequestModel);
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

  clearCustomFiltersValues(event: boolean) {

    if (!event || !this.localWidgetRequestModel?.filterConfig) {
      return;
    }
  
    const clonedDashboardFilters =
      structuredClone(this.dashboardCustomFilterValue || {});
  
    this.setValueAsPerWidgetCustomFiltersValue(clonedDashboardFilters);
  
    this.localWidgetRequestModel.filterConfig = structuredClone({
      ...this.localWidgetRequestModel.filterConfig,
      customFilters: clonedDashboardFilters,
      isDashboardFilterApplied: true
    });
  
    this.cd.detectChanges();
  }

  updateCustomFiltersValues() {
    if (!this.localWidgetRequestModel?.filterConfig) return;
  
    if (this.applyToAllEnabled) {
      this.widgetLevelFilterBackup = structuredClone(this.localWidgetRequestModel.filterConfig.customFilters || {});
      const clonedDashboardFilters = structuredClone(this.dashboardCustomFilterValue || {});
      this.setValueAsPerWidgetCustomFiltersValue(clonedDashboardFilters);
      this.localWidgetRequestModel.filterConfig.customFilters = clonedDashboardFilters;
      this.localWidgetRequestModel.filterConfig.isDashboardFilterApplied = true; 
    } 
    else {
      this.localWidgetRequestModel.filterConfig.customFilters = structuredClone(this.widgetLevelFilterBackup || {});
      this.setValueAsPerWidgetCustomFiltersValue(this.localWidgetRequestModel.filterConfig.customFilters);
      this.localWidgetRequestModel.filterConfig.isDashboardFilterApplied = false;
    }
    this.cd.detectChanges();
  }

  appendNameToAggregatedProperty(chartData: ClientChartModel): ChartSeries[] {
    if (this.localWidgetRequestModel.dataInputConfig.fieldsAggregationType == Enum_Method_Aggregation.Greatest || this.localWidgetRequestModel.dataInputConfig.fieldsAggregationType == Enum_Method_Aggregation.Least) {
      var aggregatedSeriesIndex = chartData.series.findIndex((x) => x.name.toLowerCase() == Enum_Method_Aggregation_With_Labels[this.localWidgetRequestModel.dataInputConfig.fieldsAggregationType].toLowerCase())
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
    var isSeriesShowable = this.localWidgetRequestModel.showableProperties.find(
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
