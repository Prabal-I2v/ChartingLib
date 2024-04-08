import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ICustomFilter } from '../i2v-charts/i2v-charts.component';

@Component({
  selector: 'i2v-chart-header',
  templateUrl: './i2v-chart-header.component.html',
  styleUrl: './i2v-chart-header.component.scss'
})
export class I2vChartHeaderComponent {

  @Input() heading : string = "";
  @Input() subHeading : string = "";
  @Input()  disableTimeFilter:boolean=false;
  @Input() customFilters : ICustomFilter;
  @Output() daysFilterOutput : EventEmitter<string> = new EventEmitter<string>();
  @Output() customFilterOutput : EventEmitter<string | number | string[] | number[]> = new EventEmitter<string | number | string[] | number[]>();
  @ViewChild("multiselect") multiselectRef : any;
  TimeFilter = ['Hours', 'Days', 'Week', 'Month', 'Year','Custom'];
  rangeDates: Date[] | undefined;
  selectedCustomFilter : ICustomFilter;
  CustomFilterKeys : string[];
  CustomFilterValues :  string[];
  TimeFilterValue : string;
  CustomFilterKeyValue : string;

  selectedCustomFilterkey : string;
  selectedCustomFilterValue : string[];

  constructor(){

  }

  ngOnInit()
  {
      this.selectedCustomFilterkey = Object.keys(this.customFilters)[0];
      this.selectedCustomFilterValue = this.customFilters[this.selectedCustomFilterkey];
      this.CustomFilterKeys = Object.keys(this.customFilters);
  }

  onCustomFilterKeyChange(event)
  {
      this.selectedCustomFilterkey = event.value;
      this.selectedCustomFilterValue = [];
      this.multiselectRef.updateModel(this.selectedCustomFilterValue);
  }

  onCustomFilterValuesChange(event)
  {
    this.selectedCustomFilterValue = event.value;
    this.customFilterOutput.emit(this.selectedCustomFilterValue);
  }

  onTimeChange(event)
  {
    this.daysFilterOutput.emit(this.TimeFilterValue);
  }


}
