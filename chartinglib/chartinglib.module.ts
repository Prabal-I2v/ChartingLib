import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartingComponent } from './chartinglib.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { EchartsxModule } from 'echarts-for-angular';

@NgModule({
  declarations: [
    ChartingComponent,
    BarChartComponent
  ],
  imports: [
    CommonModule,
    EchartsxModule
  ],
  exports:[
    BarChartComponent
  ]
})
export class ChartinglibModule { }
