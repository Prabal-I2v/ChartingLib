import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChartingComponent } from "./chartinglib.component";
// import { FusionChartsModule } from "angular-fusioncharts";
import {
  GridModule,
  ExcelModule,
  PDFModule,
} from "@progress/kendo-angular-grid";

// Import FusionCharts library and chart modules
// import * as FusionCharts from "fusioncharts";
// import * as charts from "fusioncharts/fusioncharts.charts";
// import * as PowerCharts from "fusioncharts/fusioncharts.powercharts"
// import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
// import * as GammelTheme from "fusioncharts/themes/fusioncharts.theme.gammel";
// import * as CandyTheme from "fusioncharts/themes/fusioncharts.theme.candy";
// import * as OceanTheme from "fusioncharts/themes/fusioncharts.theme.ocean";

// import { FusionChartComponent } from './fusion-chart/fusion-chart.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PDFExportModule } from "@progress/kendo-angular-pdf-export";
import { BrowserModule } from "@angular/platform-browser";
import { ChartsModule } from "@progress/kendo-angular-charts";
import { LayoutModule } from "@progress/kendo-angular-layout";
import { MultiSelectModule } from "primeng/multiselect";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { I2vBarChartComponent } from "./i2v-bar-chart/i2v-bar-chart.component";
import { I2vChartHeaderComponent } from "./i2v-chart-header/i2v-chart-header.component";
import { FormsModule } from "@angular/forms";
import { I2vPieChartComponent } from "./i2v-pie-chart/i2v-pie-chart.component";
import { I2vColumnChartComponent } from "./i2v-column-chart/i2v-column-chart.component";
import { I2vStackedcolumnChartComponent } from "./i2v-stackedcolumn-chart/i2v-stackedcolumn-chart.component";
import { I2vHeatmapChartComponent } from "./i2v-heatmap-chart/i2v-heatmap-chart.component";
import { I2vStackedbarChartComponent } from "./i2v-stackedbar-chart/i2v-stackedbar-chart.component";
import { I2vLineChartComponent } from "./i2v-line-chart/i2v-line-chart.component";
import { I2vAreaChartComponent } from "./i2v-area-chart/i2v-area-chart.component";
import { HttpClientModule } from "@angular/common/http";
import { I2vKpiChartComponent } from "./i2v-kpi-chart/i2v-kpi-chart.component";
import { I2vDonutChartComponent } from "./i2v-donut-chart/i2v-donut-chart.component";
import { FormatTimePipe } from "./Models/pipes/formatTime.pipe";
import { ShowVideoSourceNamePipe } from "./Models/pipes/showVideoSourceName.pipe";
import { DetailsWidgetComponent } from "./details-widget/details-widget.component";
import { MatBadgeModule } from "@angular/material/badge";
import { I2vSankeyChartComponent } from "./i2v-sankey-chart/i2v-sankey-chart.component";
import { GridstackModule } from 'gridstack/dist/angular';
import { i2vUtilityModule } from "@i2v-systems/i2v-utility";
import { MatTooltip } from "@angular/material/tooltip";
import { CustomFilterDialogComponent } from "./custom-filter-dialog/custom-filter-dialog.component";
import { i2vContextMenuModule } from "@i2v-systems/context-menu";
import { I2vGridComponent } from './i2v-grid/i2v-grid.component';
import { GetImagePipe } from "src/app/pipes/getImage.pipe";
import { SharedModule } from "../../shared.module";
// import {NgxDaterangepickerMd} from "ngx-daterangepicker-material";
// FusionChartsModule.fcRoot(FusionCharts, charts, PowerCharts, FusionTheme, GammelTheme, CandyTheme, OceanTheme);

@NgModule({
  declarations: [
    FormatTimePipe,
    ShowVideoSourceNamePipe,
    ChartingComponent,
    // FusionChartComponent,
    // I2vChartsComponent,
    I2vChartHeaderComponent,
    I2vBarChartComponent,
    I2vPieChartComponent,
    I2vDonutChartComponent,
    I2vColumnChartComponent,
    I2vKpiChartComponent,
    I2vStackedcolumnChartComponent,
    I2vHeatmapChartComponent,
    I2vStackedbarChartComponent,
    I2vLineChartComponent,
    I2vAreaChartComponent,
    DetailsWidgetComponent,
    I2vSankeyChartComponent,
    CustomFilterDialogComponent,
    I2vGridComponent
  ],
  imports: [
    CommonModule,
    // BrowserAnimationsModule,
    // EchartsxModule,
    // FusionChartsModule,
    // BrowserModule,
    PDFExportModule,
    CalendarModule,
    ChartsModule,
    LayoutModule,
    GridModule,
    ExcelModule,
    PDFModule,
    MultiSelectModule,
    DropdownModule,
    HttpClientModule,
    MatBadgeModule,
    GridstackModule,
    MatTooltip,
    
    // NgxDaterangepickerMd,
    i2vContextMenuModule,
    SharedModule
  ],
  exports: [
    // FusionChartComponent,
    I2vChartHeaderComponent,
    I2vBarChartComponent,
    I2vPieChartComponent,
    I2vDonutChartComponent,
    I2vColumnChartComponent,
    I2vStackedcolumnChartComponent,
    I2vKpiChartComponent,
    I2vHeatmapChartComponent,
    I2vStackedbarChartComponent,
    I2vLineChartComponent,
    I2vAreaChartComponent,
    I2vSankeyChartComponent,
    I2vGridComponent,
    ChartsModule,
    LayoutModule,
    GridModule,
    ExcelModule,
    PDFModule,
    CalendarModule,
    DropdownModule,
    MultiSelectModule,
    FormatTimePipe,
    ShowVideoSourceNamePipe,
    DetailsWidgetComponent,
    GridstackModule

  ],
})
export class ChartinglibModule {}
