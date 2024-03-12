import { Component, Input } from '@angular/core';
import { EChartsOption, format } from 'echarts';
import { Observable } from 'rxjs';
import { ChartType, IChartDataModel } from './chartingUtility';
import { BarChart } from 'echarts/charts';
import { BaseChartClassModel } from './BaseChartClassModel';

interface Query {
  measures?: string[],
  dimensions?: string[],
  order?: object,
  filters?: object[],
  limit?: number
}

@Component({
  selector: 'charting-lib',
  templateUrl: './chartinglib.component.html',
  styleUrls: ['./chartinglib.component.scss']
})

export class ChartingComponent {
  title = 'charting';
  echartsOptions : EChartsOption = {};
  @Input() chartType : BaseChartClassModel | undefined;

  ngOnInit()
  {
    var generalChartData = this.getData();
    // var DataAsPerRequiredChart = this.chartType.formatChartData()
  }

  getData() : IChartDataModel
  {
      return {
        xAxisData: ['Category 1', 'Category 2', 'Category 3'],
        seriesData: [
            [120, 200, 150],
            [220, 100, 250]
        ],
        seriesLabels: ['Series 1', 'Series 2']
    };
  }
  
}
