import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

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
  

    constructor(){

    }

    ngOnInit()
    {
      
    }

    onCustomFilterValuesChange(event)
    {
      this.customFilterOutput.emit(event);
    }

    onTimeChange(event)
    {
      this.daysFilterOutput.emit(event);
    }


}
