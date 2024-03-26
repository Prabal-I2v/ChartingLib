import { Component } from '@angular/core';

@Component({
  selector: 'app-kpi-chart',
  standalone: false,
  templateUrl: './kpi-chart.component.html',
  styleUrl: './kpi-chart.component.scss'
})
export class KpiChartComponent {
  public data = [0,1,2,3,4,5,6,7,8,9,10,10,10,9,8,7,6,7,8,9,10,11,12,13,14,15];
}
