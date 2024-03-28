import { Component, Input, OnInit } from '@angular/core';
import { I2vChartsComponent } from '../i2v-charts/i2v-charts.component';

@Component({
  selector: 'i2v-bar-chart',
  templateUrl: './i2v-bar-chart.component.html',
  styleUrl: './i2v-bar-chart.component.scss'
})
export class I2vBarChartComponent extends I2vChartsComponent implements OnInit {
    @Input() chartCategories : any=[];
    @Input() chartData : any;
    @Input() color:any

    constructor() {
      super();
    }
    ngOnInit(): void {
      this.chartData.forEach(element => {
        this.chartCategories.push(element.name);
       });
    }
}
