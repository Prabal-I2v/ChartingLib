import { Component, Input } from '@angular/core';

@Component({
  selector: 'i2v-kpi-chart',
  templateUrl: './i2v-kpi-chart.component.html',
  styleUrl: './i2v-kpi-chart.component.scss'
})
export class I2vKpiChartComponent {
  @Input() heading:String;
  @Input() value:any;
  @Input() data:any;
  @Input() percentValue:number;
  // public data = [0,1,2,3,4,5,6,7,8,9,10,10,10,9,8,7,6,7,8,9,10,11,12,13,14,15];
}
