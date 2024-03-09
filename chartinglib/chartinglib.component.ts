import { Component } from '@angular/core';
import { EChartsOption } from 'echarts';
import { Observable } from 'rxjs';

interface Query {
  measures?: string[],
  dimensions?: string[],
  order?: object,
  filters?: object[],
  limit?: number
}

interface ChartData {
  xAxisData: string[],
  seriesData: number[][],
  seriesLabels: string[]
}

@Component({
  selector: 'charting-lib',
  templateUrl: './chartinglib.component.html',
  styleUrls: ['./chartinglib.component.scss']
})

export class ChartingComponent {
  title = 'charting';

  private formatBarChartData(title = '', xAxisLabel = '', yAxisLabel = ''): (source$: Observable<ChartData>) => Observable<EChartsOption> {
    return source$ => source$.pipe(
      map((chartData : any) => {
        let options: EChartsOption = {
          tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
          grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
          title: { text: title, show: true },
          xAxis: { type: 'category', data: chartData.xAxisData, name: xAxisLabel, axisTick: { alignWithLabel: true } },
          series: [],
          yAxis: { type: 'value', name: yAxisLabel },
          legend: { data: chartData.seriesLabels }
        };

        chartData.seriesData.forEach((series, index) => {
          if (options.series && Array.isArray(options.series)) {
            options.series.push({
              type: 'bar',
              data: series,
              name: chartData.seriesLabels[index],
              label: { show: true, rotate: 90, align: 'left', verticalAlign: 'middle', position: 'insideBottom', distance: 15, formatter: '{a} → {c}', fontSize: 14 }
            });
          }
        });

        return options;
      })
    );
  }

  private getChartOptions(query: Query, title = '', xAxisLabel = '', yAxisLabel = '') {
    return this.cmcs.load(query).pipe(
        switchMap(data => data),
        reduce((ac: ChartData, cv: object, index: number) => {
        const vals = Object.values(cv);

        if (index == 0) {
            for (let i = 1; i < vals.length; i++) {
            ac.seriesData.push([]);
            }

            ac.seriesLabels = Object.keys(cv).slice(1).map(k => k.substring(k.lastIndexOf('.') + 1));
        }

        ac.xAxisData.push(vals[0]);

        for (let i = 1; i < vals.length; i++) {
            ac.seriesData[i - 1].push(vals[i]);
        }

        return ac;
        },
        { xAxisData: [], seriesData: [], seriesLabels: [] }
        ),
        this.formatBarChartData(title, xAxisLabel, yAxisLabel)
    );
}
}
