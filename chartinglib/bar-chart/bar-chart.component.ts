import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { BarChart } from 'echarts/charts';
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';

type EChartsOption = echarts.EChartsOption;

@Component({
  selector: 'charting-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit {
  readonly echartsExtentions: any[] = [];
  echartsOptions: EChartsOption = {};
  title = 'charting';


  constructor() {
    var myChart = echarts.init();
    this.echartsExtentions = [
      BarChart,
      TooltipComponent,
      GridComponent,
      LegendComponent,
    ];
  }

  ngOnInit() {
    this.echartsOptions = {
      tooltip: {
        // position : 'top'
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '8%',
        top: '3%',
        containLabel: true,
      },
      yAxis: {
        type: 'value',
      },
      xAxis: {
        type: 'category',
        data: ['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'],
        axisLabel: {
          interval: 0,
          rotate: 15,
        },
      },
      legend: {
        data: ['ali', 'behrooz'],
        bottom: 0,
      },
      series: [
        {
          name: 'ali',
          type: 'bar',

          data: [
            { value: 10, name: 'Search Engine' },
          { value: 3, name: 'Direct' },
          { value: 10, name: 'Email' },
          { value: 14, name: 'Union Ads' },
          { value: 23, name: 'Video Ads' },
        ]},
        {
          name: 'behrooz',
          type: 'bar',
          label: {
            show: true
          },
          data: [1, 17, 12, 11, 40, 3, 21],
          emphasis: {
            itemStyle: {
              shadowBlur: 5,
              shadowColor: 'red'
            }
          }
        },
      ],
    };
  }

  ngAfterViewInit(){
  }

  setData (event) {
    if (event.data) {
      var subData = drilldownData.find(function (data) {
        return data.dataGroupId === (event.data as DataItem).groupId;
      });
      if (!subData) {
        return;
      }
      myChart.setOption<echarts.EChartsOption>({
        xAxis: {
          data: subData.data.map(function (item) {
            return item[0];
          })
        },
        series: {
          type: 'bar',
          id: 'sales',
          dataGroupId: subData.dataGroupId,
          data: subData.data.map(function (item) {
            return item[1];
          }),
          universalTransition: {
            enabled: true,
            divideShape: 'clone'
          }
        },
        graphic: [
          {
            type: 'text',
            left: 50,
            top: 20,
            style: {
              text: 'Back',
              fontSize: 18
            },
            onclick: function () {
              myChart.setOption<echarts.EChartsOption>(option);
            }
          }
        ]
      });
    }
  }

}
