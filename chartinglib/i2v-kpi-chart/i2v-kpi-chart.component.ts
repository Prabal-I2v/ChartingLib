import { Component, Input } from '@angular/core';
import { I2vChartsComponent } from '../i2v-charts/i2v-charts.component';

@Component({
  selector: 'i2v-kpi-chart',
  templateUrl: './i2v-kpi-chart.component.html',
  styleUrl: './i2v-kpi-chart.component.scss'
})
export class I2vKpiChartComponent extends I2vChartsComponent {
  @Input() KPIHeading:String;
  @Input() value:any;
  @Input() data:any;
  @Input() percentValue:number;
  @Input() disableTimeFilter:boolean=false;
  // public data = [0,1,2,3,4,5,6,7,8,9,10,10,10,9,8,7,6,7,8,9,10,11,12,13,14,15];
}
