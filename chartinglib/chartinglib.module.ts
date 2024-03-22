import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartingComponent } from './chartinglib.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { EchartsxModule } from 'echarts-for-angular';
import { LineChartComponent } from './line-chart/line-chart.component';
// import { FusionChartsModule } from "angular-fusioncharts";
import { GridModule, ExcelModule, PDFModule } from "@progress/kendo-angular-grid";

// Import FusionCharts library and chart modules
// import * as FusionCharts from "fusioncharts";
// import * as charts from "fusioncharts/fusioncharts.charts";
// import * as PowerCharts from "fusioncharts/fusioncharts.powercharts"
// import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
// import * as GammelTheme from "fusioncharts/themes/fusioncharts.theme.gammel";
// import * as CandyTheme from "fusioncharts/themes/fusioncharts.theme.candy";
// import * as OceanTheme from "fusioncharts/themes/fusioncharts.theme.ocean";

// import { FusionChartComponent } from './fusion-chart/fusion-chart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KendoChartComponent } from './kendo-chart/kendo-chart.component';
import { PDFExportModule } from "@progress/kendo-angular-pdf-export";
import { BrowserModule } from '@angular/platform-browser';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { MultiSelectModule } from 'primeng/multiselect';
import { GaugesModule } from "@progress/kendo-angular-gauges";
import { DropdownModule } from 'primeng/dropdown';
import { I2vChartsComponent } from './i2v-charts/i2v-charts.component';

// FusionChartsModule.fcRoot(FusionCharts, charts, PowerCharts, FusionTheme, GammelTheme, CandyTheme, OceanTheme);

@NgModule({
  declarations: [
    ChartingComponent,
    BarChartComponent,
    LineChartComponent,
    // FusionChartComponent,
    KendoChartComponent,
    I2vChartsComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    // EchartsxModule,
    // FusionChartsModule,
    BrowserModule,
    PDFExportModule,
    GaugesModule,
    ChartsModule,
    LayoutModule,
    GridModule,
    ExcelModule,
    PDFModule,
    MultiSelectModule,
    DropdownModule
  ],
  exports:[
    BarChartComponent,
    // FusionChartComponent,
    KendoChartComponent,
    I2vChartsComponent,
    ChartsModule,
    LayoutModule,
    GridModule,
    ExcelModule,
    PDFModule
  ]
})
export class ChartinglibModule { }
