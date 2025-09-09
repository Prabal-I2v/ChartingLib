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
  Enum_TimePeriod,
  CustomFilterValueModel,
} from "../Models/Widget";
import { ChartingDataService } from "../charting-data.service";
import { Subject, Subscription, timer } from "rxjs";
import { debounce } from "rxjs/operators";
import { month } from "../Models/vehicle-icon-mapping";
import { EventPropertyType } from "Analytic/ClientApp/src/app/Models/eventPropertyType.model";
import { v4 as uuidv4 } from 'uuid';
import { TableOutputModel } from "../Models/TableOutputModel";

@Component({
  selector: "i2v-charts",
  templateUrl: "./i2v-charts.component.html",
  styleUrl: "./i2v-charts.component.scss",
})
export abstract class I2vChartsComponent implements OnInit {
  isModel: boolean;
  isLoading: boolean;
  dataExists: boolean;
  isCustomFilterApplied: boolean = false;
  @Input() showEntity: boolean = true;
  @Input() showTimeFilter: boolean = true;
  @Input() showRefreshInterval: boolean = true;
  @Input() showFilterValues: boolean = false;
  @Output() showFilterValuesChange = new EventEmitter<boolean>();
  @Output() widgetResizeCallbackEmittor = new EventEmitter<any>();

  //this property is used pass initial value for filters like all time filters, all videosources and all
  applyToAllEnabled: boolean = false;
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
  customFilterValues: Record<string, CustomFilterValueModel[]>;

  private _chartData: ClientChartModel;
  @Input()
  set chartData(data: ChartsOutputModel) {
    this._chartData = this.transformChartData(data);
  }
  get chartData(): ClientChartModel {
    return this._chartData;
  }

  private _tableData: TableOutputModel;
  @Input()
  set tableData(data: TableOutputModel) {
    this._tableData = this.transformTableData(data);
  }
  get tableData(): TableOutputModel {
    return this._tableData;
  }

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
        this.interval = setInterval(() => {
          this.getDataFromServer(this.widgetRequestModel);
        }, this.widgetRequestModel.refreshInterval * 1000);
      }
      if (this.widgetRequestModel.isDashboardFilterApplied) {
        this.widgetRequestModel.customFilters = JSON.parse(JSON.stringify(this.dashboardCustomFilterValue));
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
      this.customFilterValues = { ...this.widgetRequestModel.customFilters };
      this.showFilterValues = false;
      if (this.isCustomFilterApplied && this.applyToAllEnabled) {
        this.isCustomFilterApplied = false;
        this.widgetRequestModel.isDashboardFilterApplied = true;
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
    this.isCustomFilterApplied = true;
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

  // Type guard functions
  private isChartsOutputModel(data: any): data is ChartsOutputModel {
    return data && 'labels' in data && 'data' in data;
  }

  private isTableOutputModel(data: any): data is TableOutputModel {
    return data && 'columns' in data && 'rows' in data;
  }


  // The actual API call is moved to this method
  private fetchDataFromServer(widgetRequestModel: Widget) {
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
    }

    this.apiSubscription = this.chartingDataService
      .getChartingData(widgetRequestModel)
      .subscribe(
        // In your subscription handler
        (data: ChartsOutputModel | TableOutputModel) => {
          this.dataExists = false;

          if (data) {
            if (this.isChartsOutputModel(data) && this.checkIfAnySeriesExists(data)) {
              this.chartData = data;
              this.dataExists = true;
            }
            else if (this.isTableOutputModel(data)) {
              this.tableData = data;
              this.dataExists = true;
            }
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
  public transformChartData(data: ChartsOutputModel): ClientChartModel {
    let isMonthData = false;
    if (data.labels[0]?.key.toLowerCase() === "month") isMonthData = true;

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

  // Table transformation
  public transformTableData(data: TableOutputModel): TableOutputModel {
    const clientModel = new TableOutputModel();

    // Set headers from columns
    clientModel.columns = [...data.columns];

    // Transform rows
    clientModel.rows = data.rows;

    return clientModel;
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
      this.widgetRequestModel.customFilters = { ...this.dashboardCustomFilterValue };
      this.setValueAsPerWidgetCustomFiltersValue(this.dashboardCustomFilterValue);
      this.widgetRequestModel.customFilters = JSON.parse(JSON.stringify(this.widgetRequestModel.customFilters));
      this.widgetRequestModel.isDashboardFilterApplied = true;
      this.cd.detectChanges();
    }
  }

  updateCustomFiltersValues() {
    if (this.widgetRequestModel.isDashboardFilterApplied || this.applyToAllEnabled) {
      if (this.isCustomFilterApplied) {
        this.widgetRequestModel.isDashboardFilterApplied = this.applyToAllEnabled;
        const isCustomFilterValuesEmpty = !this.customFilterValues || Object.keys(this.customFilterValues).length === 0;
        if (isCustomFilterValuesEmpty) {
          this.customFilterValues = { ...this.widgetRequestModel.customFilters };
        }
      }
      if (!this.applyToAllEnabled) {
        this.widgetRequestModel.customFilters = {
          ...(this.customFilterValues ?? this.dashboardCustomFilterValue)
        };
        this.setValueAsPerWidgetCustomFiltersValue(this.widgetRequestModel.customFilters);
        this.widgetRequestModel.customFilters = JSON.parse(JSON.stringify(this.widgetRequestModel.customFilters));
      } else {
        this.widgetRequestModel.customFilters = { ...this.dashboardCustomFilterValue };
        this.setValueAsPerWidgetCustomFiltersValue(this.dashboardCustomFilterValue);
        this.widgetRequestModel.customFilters = JSON.parse(JSON.stringify(this.widgetRequestModel.customFilters));
        this.widgetRequestModel.isDashboardFilterApplied = true;
      }
      this.cd.detectChanges();
    }
  }
}