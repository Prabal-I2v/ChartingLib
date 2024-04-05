import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ChartSeries, ClientChartModel } from '../Models/ClientChartModel';
import { ChartsOutputModel } from '../Models/ChartsOutputModel';

export class ICustomFilter {
  [key: string]: string[];
}

@Component({
  selector: 'i2v-charts',
  templateUrl: './i2v-charts.component.html',
  styleUrl: './i2v-charts.component.scss'
})

export class I2vChartsComponent {
  // @Input() chartCategories : chartCategories;
  private _chartData : ClientChartModel
  @Input() 
  set chartData(data : ChartsOutputModel){
    this._chartData = this.transformData(data)
  }
  get chartData() : ClientChartModel{
    return this._chartData
  }

  @Input() heading: string = "";
  @Input() subHeading: string = "";
  @Input() customFilters: ICustomFilter;
  @Output() daysFilterOutput: EventEmitter<string> = new EventEmitter<string>();
  @Output() customFilterOutput: EventEmitter<string | number | string[] | number[]> = new EventEmitter<string | number | string[] | number[]>();


  constructor() {

  }

  ngOnInit() {

  }

  onCustomFilterValuesChange(event) {
    this.customFilterOutput.emit(event);
  }

  onTimeChange(event) {
    this.daysFilterOutput.emit(event);
  }

  transformData(data: ChartsOutputModel) : ClientChartModel {

    var chartData = new ClientChartModel();
    chartData.series = data.data.map((x) => {
      return new ChartSeries(x.label, x.data);
    })
    if (data.labels.length > 0) {
      chartData.chartCategories = data.labels[0].value;
      chartData.x_label = data.labels[0].key
    }
    else{
      chartData.chartCategories = data.data.map((x) => {
        return x.label
      })
    }

    return chartData;
  }

 

}
