import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'i2v-kpi-chart',
  templateUrl: './i2v-kpi-chart.component.html',
  styleUrl: './i2v-kpi-chart.component.scss'
})
export class I2vKpiChartComponent  implements OnInit{
  @Input() heading:String;
  @Input() value:any;
  @Input() data:any;
  @Input() linecolor:any;
  @Input() percentValue:number;
  series:any;
  ngOnInit(){
    this.series={
      line:{
        color:this.linecolor,
        width:2,
        style:'smooth',
      },

    }
  }
  // public data = [0,1,2,3,4,5,6,7,8,9,10,10,10,9,8,7,6,7,8,9,10,11,12,13,14,15];
}
