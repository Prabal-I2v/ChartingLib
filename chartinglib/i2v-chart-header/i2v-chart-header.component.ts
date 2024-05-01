import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ICustomFilter, ITimeRange, ICustomFilterOutputEmittorModel, CustomFilterValueModel, IDateTimeFilterOutputEmittorModel } from '../Models/WidgetRequestModel';
import * as moment from 'moment';

declare var $: any;
declare var _: any;
@Component({
  selector: 'i2v-chart-header',
  templateUrl: './i2v-chart-header.component.html',
  styleUrl: './i2v-chart-header.component.scss'
})
export class I2vChartHeaderComponent {

  @Input() heading: string = "";
  @Input() subHeading: string = "";
  @Input() disableTimeFilter: boolean = false;
  @Input() customFilters: ICustomFilter;
  @Input() widgetCustomFiltersValue: ICustomFilter;
  @Output() daysFilterOutput: EventEmitter<IDateTimeFilterOutputEmittorModel> = new EventEmitter<IDateTimeFilterOutputEmittorModel>();
  @Output() customFilterOutput: EventEmitter<ICustomFilterOutputEmittorModel> = new EventEmitter<ICustomFilterOutputEmittorModel>();
  @ViewChild("multiselect") multiselectRef: any;
  @ViewChild("keySelect") keySelectRef: any;
  @ViewChild("customTimeFilter") customTimeFilter: any

  CustomFilterKeys: string[];
  CustomFilterValues: string[];

  //properties for customFilter
  selectedCustomFilterkey: string;
  selectedCustomFilterValue: string[]

  //properties for time filter
  TimeFilterValue: string;
  timeObj: ITimeRange
  TimeFilter = ['Today', 'Last Week', 'Last Month', 'Custom'];
  DateRange: Date[] | undefined = [];
  private startDate: Date = new Date(new Date($.now()).getFullYear(), new Date($.now()).getMonth(), new Date($.now()).getDate() - 1, 0, 0, 0);
  private endDate: Date = new Date($.now());
  enableCustomTime: boolean = false;


  constructor(private cdr: ChangeDetectorRef) {
    this.DateRange[0] = this.startDate
    this.DateRange[1] = this.endDate
  }

  ngOnChanges(changes: SimpleChanges) {
   
    this.cdr.detectChanges();
    if (changes.customFilters && changes.customFilters.currentValue != changes.customFilters.previousValue) {
      this.setFilterValueAsPerCustomFiltersAndWidgetCustomFilter();
    }

    if (changes.widgetCustomFiltersValue && changes.widgetCustomFiltersValue.currentValue != changes.widgetCustomFiltersValue.previousValue) {
      this.SetValueAsPerWidgetCustomFiltersValue();
    }
    this.cdr.detectChanges();

  }
  ngOnInit() {
    // this.setFilterValueFromPassedAndSelectedValue();

  }

  printWidgetModelValue()
  {
    console.log(this.widgetCustomFiltersValue);
  }

  ngAfterViewInit() {
    this.setFilterValueAsPerCustomFiltersAndWidgetCustomFilter();
  }

  private setFilterValueAsPerCustomFiltersAndWidgetCustomFilter() {
    if (this.customFilters) {
      this.CustomFilterKeys = Object.keys(this.customFilters);
      this.selectedCustomFilterkey = this.CustomFilterKeys[0];
      this.selectedCustomFilterValue = []
    }
    this.SetValueAsPerWidgetCustomFiltersValue();

  }

  private UpdateUIFilterModelValues() {
    if (this.keySelectRef && this.multiselectRef) {
      this.keySelectRef.updateModel(this.selectedCustomFilterkey);
      this.multiselectRef.updateModel(this.selectedCustomFilterValue);
    }
    if(this.customTimeFilter){
      this.customTimeFilter.updateInputfield(this.DateRange);
    }
  }

  private SetValueAsPerWidgetCustomFiltersValue() {
    if (this.widgetCustomFiltersValue && Object.keys(this.widgetCustomFiltersValue).length > 0 && this.customFilters) {
      for (const key of Object.keys(this.customFilters)) {
        if (key in this.widgetCustomFiltersValue) {
          this.selectedCustomFilterkey = key;
          break; // Exit the loop after finding the first matching key
        }
      }
      if (this.selectedCustomFilterkey in this.widgetCustomFiltersValue) {
        this.selectedCustomFilterValue = this.widgetCustomFiltersValue[this.selectedCustomFilterkey].map(x => { return String(x.returnValue); });
        this.customFilterOutput.emit({ key: this.selectedCustomFilterkey, value: this.selectedCustomFilterValue });
      }
      if ("Time" in this.widgetCustomFiltersValue) {
        this.TimeFilterValue = this.widgetCustomFiltersValue["Time"][0].displayName;
        if (this.TimeFilterValue == 'Custom') {
          this.enableCustomTime = true;
        }
        else{
          this.enableCustomTime = false;
        }
        this.DateRange[0] = new Date((<ITimeRange>this.widgetCustomFiltersValue["Time"][0].returnValue).startTime);
        this.DateRange[1] = new Date((<ITimeRange>this.widgetCustomFiltersValue["Time"][0].returnValue).endTime);
        this.daysFilterOutput.emit({key : this.TimeFilterValue, value : (<ITimeRange>this.widgetCustomFiltersValue["Time"][0].returnValue)});
      }
    }
    this.UpdateUIFilterModelValues();
  }

  onCustomFilterKeyChange(event) {
    this.selectedCustomFilterkey = event.value;
    if (this.selectedCustomFilterkey in this.widgetCustomFiltersValue) {
      this.selectedCustomFilterValue = this.widgetCustomFiltersValue[this.selectedCustomFilterkey].map(x => { return String(x.returnValue); });
    }
    else {
      this.selectedCustomFilterValue = [];
    }
    this.multiselectRef.updateModel(this.selectedCustomFilterValue);
  }

  onCustomFilterValuesChange(event) {
    if (event == undefined) {
      this.selectedCustomFilterValue = [];
    }
    else {
      this.selectedCustomFilterValue = event.value;
    }
    // this.widgetCustomFiltersValue[this.selectedCustomFilterkey] = this.customFilters[this.selectedCustomFilterkey].filter(x => this.selectedCustomFilterValue.includes(String(x.returnValue)));
    this.customFilterOutput.emit({ key: this.selectedCustomFilterkey, value: this.selectedCustomFilterValue });
  }


  onTimeChange(event) {
    this.timeObj = this.date_selected(event.value);
    if (this.timeObj != null) {
      this.TimeFilterValue = event.value;
      this.widgetCustomFiltersValue['Time'] = [{ displayName: this.TimeFilterValue, returnValue: this.timeObj }];
      console.log("Start Time : " + this.startDate + " - " + " End Time : " + this.endDate);
      this.daysFilterOutput.emit({key : this.TimeFilterValue, value : this.timeObj});
    }
  }

  date_selected(interval?): ITimeRange {
    var SelectedInterval = ""
    if (interval) {
      SelectedInterval = interval;
    }
    var today = new Date($.now());
    switch (SelectedInterval) {
      case 'Last Week':
        this.enableCustomTime = false;
        var temp = today.getDate() - 7;
        this.startDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          temp,
          0,
          0,
          0
        );
        return { startTime: moment(this.startDate).valueOf(), endTime: moment(this.endDate).valueOf() }
      case 'Today':
        this.enableCustomTime = false;
        this.startDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          0,
          0,
          0
        );
        return { startTime: moment(this.startDate).valueOf(), endTime: moment(this.endDate).valueOf() }
      case 'Last Month':
        this.enableCustomTime = false;
        var temp = today.getMonth() - 1;
        this.startDate = new Date(
          today.getFullYear(),
          temp,
          today.getDate(),
          0,
          0,
          0
        );
        return { startTime: moment(this.startDate).valueOf(), endTime: moment(this.endDate).valueOf() }
      case 'Custom':
        this.enableCustomTime = true;
        if ("Time" in this.widgetCustomFiltersValue) {
          this.TimeFilterValue = this.widgetCustomFiltersValue["Time"][0].displayName;
          if (this.TimeFilterValue == 'Custom') {
            this.enableCustomTime = true;
          }
          this.DateRange[0] = new Date((<ITimeRange>this.widgetCustomFiltersValue["Time"][0].returnValue).startTime);
          this.DateRange[1] = new Date((<ITimeRange>this.widgetCustomFiltersValue["Time"][0].returnValue).endTime);
          this.daysFilterOutput.emit({key : this.TimeFilterValue, value : this.timeObj});
        }
        return null

    }
  }

  onCustomTimeSelected() {
    // console.log(event);
    if (this.startDate != this.DateRange[0] && this.endDate != this.DateRange[1]) {
      this.startDate = this.DateRange[0]
      this.endDate = this.DateRange[1];
      this.timeObj = { startTime: moment(this.startDate).valueOf(), endTime: moment(this.endDate).valueOf() }
      console.log("Start Time : " + this.startDate + " - " + " End Time : " + this.endDate);
      // this.widgetCustomFiltersValue['Time'] = [{ displayName: this.TimeFilterValue, returnValue: this.timeObj }];
      this.daysFilterOutput.emit({key : this.TimeFilterValue, value : this.timeObj});
    }
  }

}
