import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MultiSelect } from 'primeng/multiselect';

export class ICustomFilter{
  [key : string] : string[];
}

@Component({
  selector: 'i2v-charts',
  templateUrl: './i2v-charts.component.html',
  styleUrl: './i2v-charts.component.scss'
})

export class I2vChartsComponent {
    @Input() heading : string = "";
    @Input() subHeading : string = "";
    @Input() customFilters : ICustomFilter;
    @Output() daysFilterOutput : EventEmitter<string> = new EventEmitter<string>();
    @Output() customFilterOutput : EventEmitter<string | number | string[] | number[]> = new EventEmitter<string | number | string[] | number[]>();
    @ViewChild("multiselect") multiselectRef : any;
    TimeFilter = ['hours', 'days', 'weeks', 'months', 'years']
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
    }

    onTimeChange(event)
    {
      console.log("Date value : ", event);
    }

}
