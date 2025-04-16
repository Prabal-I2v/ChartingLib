import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import {
  ICustomFilter,
  ITimeRange,
  ICustomFilterOutputEmittorModel,
  CustomFilterValueModel,
  IDateTimeFilterOutputEmittorModel,
  ISetIntervalFilterOutputEmittorModel,
  ICommonFilterOutputEmittorModel,
  Widget,
} from "../Models/Widget";
import * as moment from "moment";
import { EditAnalyticServerComponent } from "src/app/modules/settings/analytic-server-form/editAnalyticServer/edit-analytic-server.component";
import { CommonModalComponent, CommonModalData } from "@i2v-systems/common-components";
import { MatDialog } from "@angular/material/dialog";
import { CustomFilterDialogComponent } from "../custom-filter-dialog/custom-filter-dialog.component";
import { MyContextMenuComponent } from "src/app/shared/context-menu/context-menu.component";
import { ContextMenuItem } from "src/app/Models/ContextMenuItem.model";

declare let $: any;

interface DateRange {
  startTime: Date;
  endTime: Date;
}

@Component({
  selector: "i2v-chart-header",
  templateUrl: "./i2v-chart-header.component.html",
  styleUrl: "./i2v-chart-header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class I2vChartHeaderComponent implements OnInit, OnChanges {
  svgIcon: string = ""
  heading = "";
  subHeading = "";
  disableTimeFilter = false;
  showFilter = false;
  hideWidget = false;
  showTimeDurationFilter: boolean = false;
  isContexMenuOpen:boolean = false;
  hideWidgetMsg: string = "Hide Widget";
  position = { top: 0, left: 0 };
  @Input() applyToAllEnabled: boolean = false;
  @Input() showFilterValues: boolean = false;
  @Output() showFilterValuesChange = new EventEmitter<boolean>();
  @Input() customFilters: ICustomFilter;
  @Input() isEditModeOn = false;
  @Input() widgetModel: Widget;
  @Output() refreshIntervalFilterOutput = new EventEmitter<ISetIntervalFilterOutputEmittorModel>();
  @Output() daysFilterOutput = new EventEmitter<IDateTimeFilterOutputEmittorModel>();
  @Output() customFilterOutput = new EventEmitter<ICustomFilterOutputEmittorModel>();
  @Output() combineFilterOutputEmittor = new EventEmitter<ICommonFilterOutputEmittorModel>();
  @Output() timePeriodOutput = new EventEmitter<string>();
  @Output() widgetResizeEmittor = new EventEmitter<boolean>();
  @Output() clearCustomFiltersValues = new EventEmitter<boolean>();

  @ViewChild("multiselectRef") multiselectRef: any;
  @ViewChild("keySelectRef") keySelectRef: any;
  @ViewChild("customTimeFilterRef") customTimeFilterRef: any;
  @ViewChild("refreshIntervalRef") refreshIntervalRef: any;

  // These are the properties that are used for filter values like all videosources, maybe servers, labels if passed 
  customFilterKeys: string[] = [];
  selectedCustomFilterkey: string;
  selectedCustomFilterValue: string[] = [];

  // Time filter properties
  readonly timeFilter = ["Today", "Last 7 days", "Last 30 days", "Custom"];
  readonly timePeriodOptions = ["Month", "Week", "Year", "Day"];
  timeFilterValue: string;
  timeObj: ITimeRange;
  dateRange: Date[] = [];
  enableCustomTime = false;
  timePeriodValue = "Month";

  // Refresh interval options
  readonly refreshInterval: CustomFilterValueModel[] = [
    { displayName: "30sec", returnValue: 30 },
    { displayName: "1min", returnValue: 60 },
    { displayName: "2min", returnValue: 120 },
    { displayName: "5min", returnValue: 300 },
    { displayName: "10min", returnValue: 600 },
  ];
  refreshIntervalValue = 60;

  private startDate: Date;
  private endDate: Date;

  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };

  constructor(private cdr: ChangeDetectorRef, private dialog: MatDialog,) {
    const now = new Date();
    this.startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    this.endDate = new Date(now);
    this.endDate.setHours(24, 0, 0, 0);

    this.dateRange[0] = this.startDate;
    this.dateRange[1] = this.endDate;
    this.isEditModeOn = false;
  }

  ngOnInit(): void {
    //set properties
    this.svgIcon = this.widgetModel.svgIcon ? this.widgetModel.svgIcon : "assets/fill/va/default.svg";
    this.heading = this.widgetModel.heading;
    this.subHeading = this.widgetModel?.subHeading;
    this.disableTimeFilter = this.widgetModel.disableTimeFilter;
    this.hideWidget = this.widgetModel.isWidgetHidden;
    this.hideWidgetMsg = this.hideWidget ? "Show Widget" : "Hide Widget";
    this.customFilterKeys = Object.keys(this.customFilters);
    // this.customFilters = this.widgetModel.customFilters;
    if((this.widgetModel.groupBy1 && this.widgetModel.groupBy1.isTime) || (this.widgetModel.groupBy2 && this.widgetModel.groupBy2.isTime)){
      this.showTimeDurationFilter = true;
      this.timePeriodValue = this.widgetModel.showablePropertiesLabel[0]?.displayName || "Month";
    }
    if (!this.widgetModel.isDashboardFilterApplied) {
      this.setCustomFilterValuesAsPerWidgetModel();
    }
    // this.customFiltersValue = this.widgetModel.customFilters;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // // Only update if the relevant inputs changed
    if (changes.widgetModel?.currentValue?.isDashboardFilterApplied && changes.widgetModel.currentValue.isDashboardFilterApplied != changes.widgetModel.previousValue?.isDashboardFilterApplied) {
      // this.setFilterValueAsPerCustomFiltersAndWidgetCustomFilter();
      this.selectedCustomFilterkey = "";
      this.selectedCustomFilterValue = [];
      this.timeFilterValue = "";
      this.enableCustomTime = false;
      this.updateUIFilterModelValues();
    }

    if(changes.isEditModeOn?.previousValue != undefined && changes.isEditModeOn?.currentValue != changes.isEditModeOn?.previousValue)
      {
        this.cdr.detectChanges();
        setTimeout(()=>{
                  // this.widgetResizeEmittor.emit(changes.isEditModeOn?.currentValue);
        }, 100)

      }
  }

  ngAfterViewInit(): void {
    this.updateUIFilterModelValues()
  }

  onCustomFilterKeyChange(event: { value: string }): void {
    this.selectedCustomFilterkey = event.value;

    // Reset or update selected values based on the key selection
    if (this.selectedCustomFilterkey in this.customFilters) {
      this.selectedCustomFilterValue = this.customFilters[this.selectedCustomFilterkey]
        .map(x => String(x.returnValue));
    } else {
      this.selectedCustomFilterValue = [];
    }

    if (this.multiselectRef) {
      this.multiselectRef.updateModel(this.selectedCustomFilterValue);
    }
  }

  onCustomFilterValuesChange(event: { value: string[] }): void {
    this.selectedCustomFilterValue = event?.value || [];

    this.customFilterOutput.emit({
      key: this.selectedCustomFilterkey,
      value: this.selectedCustomFilterValue
    });
  }

  onTimeChange(event: { value: string }): void {
    const selectedInterval = event.value;
    this.timeObj = this.getTimeRangeForInterval(selectedInterval);

    if (this.timeObj) {
      this.timeFilterValue = selectedInterval;
      this.enableCustomTime = selectedInterval === 'Custom';

      this.daysFilterOutput.emit({
        key: this.timeFilterValue,
        value: this.timeObj
      });
    }
  }
  
  onTimeDurationChange(event: { value: string }): void {
    this.timePeriodValue = event.value;
    this.timePeriodOutput.emit(this.timePeriodValue);
  }

  onCustomTimeSelected(): void {
    const startDateChanged = !this.areDatesEqual(this.startDate, this.dateRange[0]);
    const endDateChanged = !this.areDatesEqual(this.endDate, this.dateRange[1]);

    if (startDateChanged || endDateChanged) {
      this.startDate = this.dateRange[0];
      this.endDate = this.dateRange[1];

      this.timeObj = {
        startTime: moment(this.startDate).valueOf(),
        endTime: moment(this.endDate).valueOf()
      };

      this.daysFilterOutput.emit({
        key: this.timeFilterValue,
        value: this.timeObj
      });
    }
  }

  clearCustomFilters(): void { 
    if(this.showFilterValues)
    this.toggleShowFilterValues();
    this.clearCustomFiltersValues.emit(true);
  }

  setIntervalTime(event: { value: number }): void {
    this.refreshIntervalValue = event.value;

    this.refreshIntervalFilterOutput.emit({
      key: this.timeFilterValue,
      value: this.refreshIntervalValue
    });
  }

  // Private methods
  private hasCustomFiltersChanged(changes: SimpleChanges): boolean {
    return changes.widgetCustomFiltersValue != null;
  }

  private setFilterValueAsPerCustomFiltersAndWidgetCustomFilter(): void {
    this.setValueAsPerWidgetCustomFiltersValue();
  }

  private setValueAsPerWidgetCustomFiltersValue(): void {
    if (!this.customFilters || Object.keys(this.customFilters).length === 0) {
      return;
    }

    const combineFilterOutputEmittorModel: ICommonFilterOutputEmittorModel = {};

    // Handle custom filter
    this.setCustomFilterValues(combineFilterOutputEmittorModel);

    // Handle time filter
    this.setTimeFilterValues(combineFilterOutputEmittorModel);

    // Handle refresh interval
    this.setRefreshIntervalValues(combineFilterOutputEmittorModel);

    // Emit combined filter changes
    if (Object.keys(combineFilterOutputEmittorModel).length > 0) {
      this.combineFilterOutputEmittor.next(combineFilterOutputEmittorModel);
    }

    // Update UI components
    this.updateUIFilterModelValues();
  }

  private setCustomFilterValues(outputModel: ICommonFilterOutputEmittorModel): void {
    for (const key of this.customFilterKeys) {
      if (key in this.customFilters) {
        this.selectedCustomFilterkey = key;
  
        const allValues = this.customFilters[this.selectedCustomFilterkey];
  
        // Check if 'videoSources' exists in widget.customFilters
        if ('Video Sources' in this.widgetModel.customFilters) {
          const allowedVideoSources = this.widgetModel.customFilters['Video Sources']
            .map((item: CustomFilterValueModel) => item.returnValue);
        
          this.selectedCustomFilterValue = allValues
            .filter(x => allowedVideoSources.includes(x.returnValue))
            .map(x => String(x.returnValue));
        } else {
          this.selectedCustomFilterValue = allValues.map(x => String(x.returnValue));
        }
        
  
        outputModel["CustomFilterEmitModel"] = {
          key: this.selectedCustomFilterkey,
          value: this.selectedCustomFilterValue
        };
        break;
      }
    }
  }

  private setTimeFilterValues(outputModel: ICommonFilterOutputEmittorModel): void {
    if ("Time" in this.customFilters) {
      const timeFilter = this.customFilters["Time"][0];
      this.timeFilterValue = timeFilter.displayName;
      this.enableCustomTime = this.timeFilterValue === "Custom";

      const timeRange = timeFilter.returnValue as ITimeRange;
      this.dateRange[0] = new Date(timeRange.startTime);
      this.dateRange[1] = new Date(timeRange.endTime);

      outputModel["DateFilterEmitModel"] = {
        key: this.timeFilterValue,
        value: timeRange
      };
    }
  }

  private setRefreshIntervalValues(outputModel: ICommonFilterOutputEmittorModel): void {
    if ("RefreshInterval" in this.customFilters) {
      this.refreshIntervalValue = Number(
        this.customFilters["RefreshInterval"][0].returnValue
      );

      outputModel["RefreshIntervalEmitModel"] = {
        key: "RefreshInterval",
        value: this.refreshIntervalValue
      };
    }
  }

  private updateUIFilterModelValues(): void {
    // Update UI components if they exist
    if (this.keySelectRef) {
      this.keySelectRef.updateModel(this.selectedCustomFilterkey);
    }

    if (this.multiselectRef) {
      this.multiselectRef.updateModel(this.selectedCustomFilterValue);
    }

    if (this.customTimeFilterRef) {
      this.customTimeFilterRef.updateInputfield(this.dateRange);
    }

    if (this.refreshIntervalRef) {
      setTimeout(() => {
        this.refreshIntervalRef.updateModel(this.refreshIntervalValue);
      }, 0);
    }
  }

  private getTimeRangeForInterval(interval: string): ITimeRange | null {
    const today = new Date();

    switch (interval) {
      case "Today":
        this.enableCustomTime = false;
        this.startDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          0, 0, 0
        );
        break;

      case "Last 7 days":
        this.enableCustomTime = false;
        this.startDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 7,
          0, 0, 0
        );
        break;

      case "Last 30 days":
        this.enableCustomTime = false;
        this.startDate = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          today.getDate(),
          0, 0, 0
        );
        break;

      case "Custom":
        this.enableCustomTime = true;
        // For custom, keep using the existing date range
        return null;

      default:
        return null;
    }

    return {
      startTime: moment(this.startDate).valueOf(),
      endTime: moment(this.endDate).valueOf()
    };
  }

  private areDatesEqual(date1: Date, date2: Date): boolean {
    return date1.getTime() === date2.getTime();
  }

  toggleShowFilter()
  {
    this.showFilter = !this.showFilter;
    // this.widgetResizeEmittor.emit(this.showFilter);
  }

  toggleShowFilterValues()
  {
    this.showFilterValues = !this.showFilterValues;
    this.showFilterValuesChange.emit(this.showFilterValues);
    this.widgetResizeEmittor.emit(this.showFilterValues);
  }

  toggleHideWidget(){
    this.widgetModel.isWidgetHidden = !this.widgetModel.isWidgetHidden;
    this.hideWidget = this.widgetModel.isWidgetHidden;
    this.hideWidgetMsg = this.hideWidget ? "Show Widget" : "Hide Widget";
  }

  onMenuClick() {
    console.log(this.widgetModel)
    const event: any = {};
    event.component = CustomFilterDialogComponent;
    event.data = {
      parentComponent: this,
      dateRange: this.dateRange,
      timeFilterValue: this.timeFilterValue,
      refreshIntervalValue: this.refreshIntervalValue,
      selectedCustomFilterkey: this.selectedCustomFilterkey,
      selectedFilterValues: this.selectedCustomFilterValue,
      customFilters: this.customFilters,
      timeFilter: this.timeFilter,
      refreshInterval: this.refreshInterval,
      customFilterKeys: this.customFilterKeys,
      enableCustomTime: this.enableCustomTime,
      disableTimeFilter: this.disableTimeFilter,
      showTimeDurationFilter : this.showTimeDurationFilter
    };
  
    const dialogData: CommonModalData = {
      event: event,
      width: '500px',
      height: '550px',
      heading: 'Add Custom Filters',
      footerButtons: [
        {
          Callback: "clearFilters",
          title: "Clear",
          basedOnChildTemplate: true,
          style: "i2v-btn medium secondary-outline btn-left"
        },
        {
          Callback: "applyFilters",
          title: "Update",  
          basedOnChildTemplate: true,
          style: "i2v-btn medium primary-default",
        },
        {
          Callback: 'cancel',
          title: 'Cancel',
          basedOnChildTemplate: true,
          style: 'i2v-button tertiary-outline medium',
        },
      ],
      showPreviousButton: false,
      showNextButton: false,
      showBackButton: false,
    };
  
    const ref = this.dialog.open(CommonModalComponent, {
      minHeight: '300px',
      panelClass: 'custom-dialog-container',
      data: dialogData,
    });
  
    ref.afterClosed().subscribe((data) => {});
  }

  onContextMenuEvent(event) {
    if (this.isContexMenuOpen == false) {
      this.isContexMenuOpen = true;
      this.position = { top: event.clientY, left: event.clientX };
    } else {
      this.isContexMenuOpen = false;
    }
    event.stopPropagation();
  }
  
  onMenuClosed() {
    this.isContexMenuOpen = false;
  }

  setCustomFilterValuesAsPerWidgetModel() {
        // Set initial filter values from widgetModel
        if (this.widgetModel.customFilters) {
          // Initialize filters from widget model
          for (const key of Object.keys(this.widgetModel.customFilters)) {
            if (key === 'Time') {
              const timeFilter = this.widgetModel.customFilters[key][0];
              this.timeFilterValue = timeFilter.displayName;
              this.enableCustomTime = timeFilter.displayName === 'Custom';
              if (timeFilter.returnValue) {
                const timeRange = timeFilter.returnValue as ITimeRange;
                this.dateRange = [new Date(timeRange.startTime), new Date(timeRange.endTime)];
              }
            } else if (key === 'RefreshInterval') {
              this.refreshIntervalValue = Number(this.widgetModel.customFilters[key][0].returnValue);
            } else {
              // For other custom filters (like Video Sources)
              this.selectedCustomFilterkey = key;
              this.selectedCustomFilterValue = this.widgetModel.customFilters[key]
                .map(item => String(item.returnValue));
            }
          }
        }
  }
}