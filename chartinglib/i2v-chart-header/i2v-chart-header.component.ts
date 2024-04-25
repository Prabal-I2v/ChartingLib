import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ICustomFilter, TimeRange } from '../Models/WidgetRequestModel';
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
  @Output() daysFilterOutput: EventEmitter<TimeRange> = new EventEmitter<TimeRange>();
  @Output() customFilterOutput: EventEmitter<string | number | string[] | number[]> = new EventEmitter<string | number | string[] | number[]>();
  @ViewChild("multiselect") multiselectRef: any;
  // TimeFilter = ['Hours', 'Days', 'Week', 'Month', 'Year','Custom'];
  TimeFilter = ['Today', 'Last Week', 'Last Month', 'Custom'];
  rangeDates: Date[] | undefined = [];
  selectedCustomFilter: ICustomFilter;
  CustomFilterKeys: string[];
  CustomFilterValues: string[];
  TimeFilterValue: string;
  CustomFilterKeyValue: string;
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

  ngOnInit() {
    this.selectedCustomFilterkey = Object.keys(this.customFilters)[0];
    this.selectedCustomFilterValue = this.customFilters[this.selectedCustomFilterkey];
    this.CustomFilterKeys = Object.keys(this.customFilters);
    
  }

  onCustomFilterKeyChange(event) {
    this.selectedCustomFilterkey = event.value;
    this.selectedCustomFilterValue = [];
    this.multiselectRef.updateModel(this.selectedCustomFilterValue);
  }

  onCustomFilterValuesChange(event) {
    this.selectedCustomFilterValue = event.value;
    this.customFilterOutput.emit(this.selectedCustomFilterValue);
  }

  onTimeChange(event) {
    var timeObj = this.date_selected(event.value);
    if (timeObj != null) {
      console.log("Start Time : " + this.startDate + " - " + " End Time : " + this.endDate);
      this.daysFilterOutput.emit(timeObj);
    }
  }

  date_selected(interval?): TimeRange {
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
    if (this.startDate != this.rangeDates[0] || this.endDate != this.rangeDates[1]) {
      this.startDate = this.rangeDates[0]
      this.endDate = this.rangeDates[1];
      console.log("Start Time : " + this.startDate + " - " + " End Time : " + this.endDate);

      this.daysFilterOutput.emit({
        startTime: moment(this.startDate).valueOf(), endTime: moment(this.endDate).valueOf()
      })
    }
  }

}
