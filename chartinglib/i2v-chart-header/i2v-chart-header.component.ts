import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ICustomFilter, ITimeRange, ICustomFilterOutputEmittorModel, CustomFilterValueModel } from '../Models/WidgetRequestModel';
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
  @Output() daysFilterOutput: EventEmitter<ITimeRange> = new EventEmitter<ITimeRange>();
  @Output() customFilterOutput: EventEmitter<ICustomFilterOutputEmittorModel> = new EventEmitter<ICustomFilterOutputEmittorModel>();
  @ViewChild("multiselect") multiselectRef: any;
  @ViewChild("keySelect") keySelectRef: any;
  // TimeFilter = ['Hours', 'Days', 'Week', 'Month', 'Year','Custom'];
  TimeFilter = ['Today', 'Last Week', 'Last Month', 'Custom'];
  rangeDates: Date[] | undefined = [];
  selectedCustomFilter: ICustomFilter;
  CustomFilterKeys: string[];
  CustomFilterValues: string[];
  TimeFilterValue: string;
  // CustomFilterKeyValue: string;
  selectedCustomFilterkey: string;
  selectedCustomFilterValue: string[];
  SelectedInterval: string = 'Today';
  private startDate: Date = new Date(
    new Date($.now()).getFullYear(),
    new Date($.now()).getMonth(),
    new Date($.now()).getDate() - 1,
    0,
    0,
    0
  );
  private endDate: Date = new Date($.now());
  enableCustomTime: boolean = false;
  constructor() {
    this.rangeDates[0] = this.startDate
    this.rangeDates[1] = this.endDate
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.customFilters && changes.customFilters.currentValue != changes.customFilters.previousValue) {
      this.setFilterValueFromPassedAndSelectedValue()
    }
  }
  ngOnInit() {
    // this.setFilterValueFromPassedAndSelectedValue();

  }

  ngAfterViewInit() {
    this.setFilterValueFromPassedAndSelectedValue();
  }

  private setFilterValueFromPassedAndSelectedValue() {
    this.selectedCustomFilterkey = "";
    if (this.widgetCustomFiltersValue && Object.keys(this.widgetCustomFiltersValue).length>0) {
      for (const key of Object.keys(this.customFilters)) {
        if (key in this.widgetCustomFiltersValue) {
          this.selectedCustomFilterkey = key;
          break; // Exit the loop after finding the first matching key
        }
      }
      this.selectedCustomFilterValue = this.widgetCustomFiltersValue[this.selectedCustomFilterkey].map(x => { return String(x.returnValue); });
      this.customFilterOutput.emit({ key: this.selectedCustomFilterkey, value: this.selectedCustomFilterValue })
      if ("Time" in this.widgetCustomFiltersValue) {
        this.TimeFilterValue = this.widgetCustomFiltersValue["Time"][0].displayName;
        if(this.TimeFilterValue == 'Custom'){
            this.enableCustomTime = true;
        }
        this.rangeDates[0] = new Date((<ITimeRange>this.widgetCustomFiltersValue["Time"][0].returnValue).startTime);
        this.rangeDates[1] = new Date((<ITimeRange>this.widgetCustomFiltersValue["Time"][0].returnValue).endTime);
        this.daysFilterOutput.emit((<ITimeRange>this.widgetCustomFiltersValue["Time"][0].returnValue));
      }
      this.keySelectRef.updateModel(this.selectedCustomFilterkey);
      this.multiselectRef.updateModel(this.selectedCustomFilterValue);
    }
    // else {
    //   this.selectedCustomFilterValue = [];
    // }
    // this.selectedCustomFilterValue = this.customFilters[this.selectedCustomFilterkey].map(x=> { return x.returnValue});
    if (this.customFilters) {
      this.CustomFilterKeys = Object.keys(this.customFilters);
    }
   
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
    this.widgetCustomFiltersValue[this.selectedCustomFilterkey] = this.customFilters[this.selectedCustomFilterkey].filter(x => this.selectedCustomFilterValue.includes(String(x.returnValue)));

    this.customFilterOutput.emit({ key: this.selectedCustomFilterkey, value: this.selectedCustomFilterValue });
  }

  onTimeChange(event) {
    var timeObj = this.date_selected(event.value);
    if (timeObj != null) {
      this.TimeFilterValue = event.value;
      this.widgetCustomFiltersValue['Time'] = [{ displayName: this.TimeFilterValue, returnValue: timeObj }];
      console.log("Start Time : " + this.startDate + " - " + " End Time : " + this.endDate);
      this.daysFilterOutput.emit(timeObj);
    }
  }

  date_selected(interval?): ITimeRange {
    if (interval) {
      this.SelectedInterval = interval;
    }
    var today = new Date($.now());
    switch (this.SelectedInterval) {
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
        return null

    }
  }

  onCustomTimeSelected() {
    // console.log(event);
    if (this.startDate != this.rangeDates[0] && this.endDate != this.rangeDates[1]) {
      this.startDate = this.rangeDates[0]
      this.endDate = this.rangeDates[1];
      var timeObj = {startTime: moment(this.startDate).valueOf(), endTime: moment(this.endDate).valueOf()}
      console.log("Start Time : " + this.startDate + " - " + " End Time : " + this.endDate);
      this.widgetCustomFiltersValue['Time'] = [{ displayName: this.TimeFilterValue, returnValue: timeObj }];

      this.daysFilterOutput.emit(timeObj)
    }
  }

}
