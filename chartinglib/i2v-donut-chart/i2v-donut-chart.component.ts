import { Component, Input } from '@angular/core';
import { I2vChartsComponent } from '../i2v-charts/i2v-charts.component';
import { LegendItemVisualArgs, SeriesLabelsContentArgs } from '@progress/kendo-angular-charts';
import { Group, Path, Rect } from '@progress/kendo-drawing';
import { Point, Size } from '@progress/kendo-drawing/dist/npm/geometry';



@Component({
  selector: 'app-i2v-donut-chart',
  templateUrl: './i2v-donut-chart.component.html',
  styleUrl: './i2v-donut-chart.component.scss'
})
export class I2vDonutChartComponent extends I2vChartsComponent {
  @Input() chartCategories: any;
  @Input() chartData: any;
  @Input() seriesColors:any[];
  @Input() showCenter:any=false;




  public labelContent(e: SeriesLabelsContentArgs): string {
    return e.category;
  }

  constructor() {
    super();
  }
}
