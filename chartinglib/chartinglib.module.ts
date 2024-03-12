import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartingComponent } from './chartinglib.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { EchartsxModule } from 'echarts-for-angular';
import { LineChartComponent } from './line-chart/line-chart.component';
import { FusionChartsModule } from "angular-fusioncharts";

// Import FusionCharts library and chart modules
import * as FusionCharts from "fusioncharts";
import * as charts from "fusioncharts/fusioncharts.charts";
import * as PowerCharts from "fusioncharts/fusioncharts.powercharts"
import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import * as GammelTheme from "fusioncharts/themes/fusioncharts.theme.gammel";
import * as CandyTheme from "fusioncharts/themes/fusioncharts.theme.candy";
import * as OceanTheme from "fusioncharts/themes/fusioncharts.theme.ocean";

import { FusionChartComponent } from './fusion-chart/fusion-chart.component';


FusionChartsModule.fcRoot(FusionCharts, charts, PowerCharts, FusionTheme, GammelTheme, CandyTheme, OceanTheme);

@NgModule({
  declarations: [
    ChartingComponent,
    BarChartComponent,
    LineChartComponent,
    FusionChartComponent
  ],
  imports: [
    CommonModule,
    EchartsxModule,
    FusionChartsModule
  ],
  exports:[
    BarChartComponent,
    FusionChartComponent
  ]
})
export class ChartinglibModule { }
