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
import * as moment from "moment";
import { ICustomFilter, ISetIntervalFilterOutputEmittorModel, IDateTimeFilterOutputEmittorModel, ICustomFilterOutputEmittorModel, ICommonFilterOutputEmittorModel, ITimeRange } from "../Models/interfaces/interfaces";
import { CustomFilterValueModel } from "../Models/types/types";
import { Widget, ThreeDimensionWidget } from "../Models/Widget";

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
  svgIcon: string = 'assets/fill/va/default.svg'
  heading = "";
  subHeading = "";
  disableTimeFilter = false;
  showFilter = false;
  hideWidget = false;
  removeWidget = false;
  showTimeDurationFilter: boolean = false;
  isContexMenuOpen: boolean = false;
  hideWidgetMsg: string = "Hide Widget";
  removeWidgetMsg: string = "Remove Widget";
  position = { top: 0, left: 0 };
  @Input() showTimeFilter: boolean = true;
  @Input() showRefreshInterval: boolean = true;
  @Input() showEntity: boolean = true;
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
  @Output() widgetRemoveEmittor = new EventEmitter<boolean>();
  @Output() clearCustomFiltersValues = new EventEmitter<boolean>();
  @Output() editWidgetOutput = new EventEmitter();


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

  refreshIntervalValue = 60;

  private startDate: Date;
  private endDate: Date;

  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };

  constructor(private cdr: ChangeDetectorRef) {
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
    if (this.widgetModel) {
      this.svgIcon = this.widgetModel.displayConfig.svgIcon ? this.widgetModel.displayConfig.svgIcon : "assets/fill/va/default.svg";
      this.heading = this.widgetModel.displayConfig.heading;
      this.subHeading = this.widgetModel?.displayConfig.subHeading;
      this.disableTimeFilter = this.widgetModel.filterConfig.disableTimeFilter;
      this.hideWidget = this.widgetModel.widgetInteractivityConfig.isWidgetHidden;
      this.removeWidget = false;
      this.hideWidgetMsg = this.hideWidget ? "Show Widget" : "Hide Widget";
      this.removeWidgetMsg = !this.removeWidget ? "Remove Widget" : "Undo Remove Widget";
      this.customFilterKeys = Object.keys(this.customFilters);
      // this.customFilters = this.widgetModel.customFilters;
      if (this.widgetModel instanceof ThreeDimensionWidget && ((this.widgetModel.dataInputConfig.groupBy1 && this.widgetModel.dataInputConfig.groupBy1.isTime) || (this.widgetModel.dataInputConfig.groupBy2 && this.widgetModel.dataInputConfig.groupBy2.isTime))) {
        this.showTimeDurationFilter = true;
        this.timePeriodValue = this.widgetModel.showableProperties[0]?.displayName || "Month";
      }
      // this.customFiltersValue = this.widgetModel.customFilters;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // // Only update if the relevant inputs changed
    if (changes.widgetModel?.currentValue?.isDashboardFilterApplied && changes.widgetModel.currentValue.isDashboardFilterApplied != changes.widgetModel.previousValue?.isDashboardFilterApplied) {
      // this.setFilterValueAsPerCustomFiltersAndWidgetCustomFilter();
      this.selectedCustomFilterkey = "";
      this.selectedCustomFilterValue = [];
      this.timeFilterValue = "";
      this.enableCustomTime = false;
    }
    if (changes['widgetModel']?.currentValue) {
      if (
        !changes['widgetModel']?.previousValue ||
        this.heading !== changes['widgetModel']?.currentValue?.displayConfig?.heading ||
        this.subHeading !== changes['widgetModel']?.currentValue?.displayConfig?.subHeading
      ) {
        this.heading = changes['widgetModel']?.currentValue?.displayConfig?.heading || "";
        this.subHeading = changes['widgetModel']?.currentValue?.displayConfig?.subHeading || "";
        this.cdr.markForCheck();
      }
    }
    if (changes.isEditModeOn?.previousValue != undefined && changes.isEditModeOn?.currentValue != changes.isEditModeOn?.previousValue) {
      this.cdr.detectChanges();
      setTimeout(() => {
        // this.widgetResizeEmittor.emit(changes.isEditModeOn?.currentValue);
      }, 100)

    }
  }

  ngAfterViewInit(): void {
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
    if (this.showFilterValues)
      this.toggleShowFilterValues();
     this.selectedCustomFilterkey = "";
      this.selectedCustomFilterValue = [];
      this.timeFilterValue = "";
      this.enableCustomTime = false;
    this.clearCustomFiltersValues.emit(true);
  }

  setIntervalTime(event: { value: number }): void {
    this.refreshIntervalValue = event.value;

    this.refreshIntervalFilterOutput.emit({
      key: this.timeFilterValue,
      value: this.refreshIntervalValue
    });
  }


  private areDatesEqual(date1: Date, date2: Date): boolean {
    return date1.getTime() === date2.getTime();
  }

  toggleShowFilter() {
    this.showFilter = !this.showFilter;
    // this.widgetResizeEmittor.emit(this.showFilter);
  }

  toggleShowFilterValues() {
    this.showFilterValues = !this.showFilterValues;
    this.showFilterValuesChange.emit(this.showFilterValues);
    this.widgetResizeEmittor.emit(this.showFilterValues);
  }

  toggleHideWidget() {
    this.widgetModel.widgetInteractivityConfig.isWidgetHidden = !this.widgetModel.widgetInteractivityConfig.isWidgetHidden;
    this.hideWidget = this.widgetModel.widgetInteractivityConfig.isWidgetHidden;
    this.hideWidgetMsg = this.hideWidget ? "Show Widget" : "Hide Widget";
  }
  
  toggleRemoveWidget() {
    this.removeWidget = !this.removeWidget
    this.removeWidgetMsg = !this.removeWidget ? "Remove Widget" : "Undo Widget";
    this.widgetRemoveEmittor.emit(this.removeWidget);
  }


  onEditWidget() {
    this.editWidgetOutput.next(null)
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

}