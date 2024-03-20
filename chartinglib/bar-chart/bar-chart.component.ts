import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  simpleEchartsOptions: EChartsOption = {};
  drillDownL1EchartsOptions: EChartsOption = {};
  drillDownL2EchartsOptions: EChartsOption = {};
  title = 'charting';
  @ViewChild('chartContainer') chartContainer!: ElementRef;

  myChart: any;


  constructor() {

    this.echartsExtentions = [
      BarChart,
      TooltipComponent,
      GridComponent,
      LegendComponent,
    ];
  }

  ngOnInit() {
    var chartContainer = document.getElementById("chartContainer1");
    var myChart = echarts.init(chartContainer, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });

    var chartContainer2 = document.getElementById("chartContainer2");
    var myChart2 = echarts.init(chartContainer2, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });

    this.simpleEchartsOptions = {
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
          ]
        },
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

    const drilldownL1Data = [
      {
        dataGroupId: 'animals',
        data: [
          ['Cats', 4],
          ['Dogs', 2],
          ['Cows', 1],
          ['Sheep', 2],
          ['Pigs', 1]
        ]
      },
      {
        dataGroupId: 'fruits',
        data: [
          ['Apples', 4],
          ['Oranges', 2]
        ]
      },
      {
        dataGroupId: 'cars',
        data: [
          ['Toyota', 4],
          ['Opel', 2],
          ['Volkswagen', 2]
        ]
      }
    ];

    this.drillDownL1EchartsOptions = {
      xAxis: {
        data: ['Animals', 'Fruits', 'Cars']
      },
      yAxis: {},
      dataGroupId: '',
      animationDurationUpdate: 500,
      series: {
        type: 'bar',
        id: 'sales',
        data: [
          {
            value: 5,
            groupId: 'animals'
          },
          {
            value: 2,
            groupId: 'fruits'
          },
          {
            value: 4,
            groupId: 'cars'
          }
        ],
        universalTransition: {
          enabled: true,
          divideShape: 'clone'
        }
      }
    };

    myChart.setOption(this.drillDownL1EchartsOptions);

    myChart.on('click', (event: any) => {
      if (event.data) {
        const subData = drilldownL1Data.find(
          (data: any) => data.dataGroupId === event.data.groupId
        );

        if (!subData) {
          return;
        }

        myChart.setOption({
          xAxis: {
            data: subData.data.map((item: any) => item[0])
          },
          series: {
            type: 'bar',
            id: 'sales',
            dataGroupId: subData.dataGroupId,
            data: subData.data.map((item: any) => item[1]),
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
              onclick: () => {
                myChart.setOption(this.drillDownL1EchartsOptions);
              }
            }
          ]
        });
      }
    });

    const drilldownL2Data = [
      {
        groupId: 'animals',
        parentGroupId: null,
        data: [
          {
            value: 5,
            data: [
              { groupId: 'cow', value: 5, parentGroupId: 'herbivores', data: null },
              { groupId: 'goat', value: 2, parentGroupId: 'herbivores', data: null },
              { groupId: 'elephant', value: 3, parentGroupId: 'herbivores', data: null },
              { groupId: 'zebra', value: 1, parentGroupId: 'herbivores', data: null },
              { groupId: 'buffalo', value: 7, parentGroupId: 'herbivores', data: null },
            ],
            groupId: 'herbivores',
            parentGroupId: 'animals'
          },
          {
            value: 2,
            data: [
              { groupId: 'Tiger', value: 9, parentGroupId: 'carnivores', data: null },
              { groupId: 'Lion', value: 4, parentGroupId: 'carnivores', data: null },
            ],
            groupId: 'carnivores',
            parentGroupId: 'animals'
          },
          {
            value: 3,
            data: [
              { groupId: 'Bear', value: 6, parentGroupId: 'omnivores', data: null },
              { groupId: 'Dog', value: 4, parentGroupId: 'omnivores', data: null },
              { groupId: 'Human', value: 2, parentGroupId: 'omnivores', data: null },
            ],
            groupId: 'omnivores',
            parentGroupId: 'animals'
          }
        ]
      },
      {
        groupId: 'fruits',
        parentGroupId: null,
        data: [
          {
            value: 5,
            groupId: 'sweet',
            parentGroupId: 'fruits',
            data: null
          },
          {
            value: 2,
            groupId: 'sour',
            parentGroupId: 'fruits',
            data: null
          },
        ]
      },
      {
        groupId: 'cars',
        parentGroupId: null,
        data: [
          {
            value: 6,
            groupId: 'Manual',
            parentGroupId: 'cars',
            data: null
          },
          {
            value: 9,
            groupId: 'Automatic',
            parentGroupId: 'cars',
            data: null
          }
        ]
      }
    ];

    this.drillDownL2EchartsOptions = {
      xAxis: {
        data: ['Animals', 'Fruits', 'Cars']
      },
      yAxis: {},
      dataGroupId: '',
      animationDurationUpdate: 500,
      series: {
        type: 'bar',
        id: 'sales',
        data: [
          {
            value: 3,
            groupId: 'animals'
          },
          {
            value: 2,
            groupId: 'fruits'
          },
          {
            value: 2,
            groupId: 'cars'
          }
        ],
        universalTransition: {
          enabled: true,
          divideShape: 'clone'
        }
      }
    };

    myChart2.setOption(this.drillDownL2EchartsOptions);


    myChart2.on('click', (event: any) => {
      if (event.data) {
        var prevData = this.drillDownL2EchartsOptions;
        var settedData = this.setOptionData(event.data.parentGroupId, drilldownL2Data, myChart2) ;
        if(settedData)
        {
          prevData = settedData;
        }
        const subData = this.findGroupById(event.data.groupId, drilldownL2Data);

        if (!subData) {
          return;
        }

        var newData = {
          xAxis: {
            data: subData.data.map((item: any) => item.groupId)
          },
          series: {
            type: 'bar',
            id: 'sales',
            dataGroupId: subData.data.map((item: any) => item.value),
            data: subData.data,
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
              onclick: (event : any) => {
                myChart2.setOption(prevData);
                // event?.preventDefault();
              }
            }
          ]
        }
        myChart2.setOption(newData);
      }
    });

    // window.addEventListener('resize', () => {
    //   this.myChart.resize();
    // });
  }

  ngAfterViewInit() {
  }

  setOptionData(groupId: any, data: any, myChart : any){
    const subData = groupId ? this.findGroupById(groupId, data)  : {data : data};
    if (!subData) {
      return null;
    }
    return <EChartsOption>{
      xAxis: {
        data: subData.data.map((item: any) => item.groupId)
      },
      series: {
        type: 'bar',
        id: 'sales',
        dataGroupId:  subData.data.map((item: any) => {
    return item.value !== undefined ? item.value : item.data.length;
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
          onclick: (event : any) => {
            myChart.setOption(this.setOptionData(subData.parentGroupId, data, myChart));
            // event?.preventDefault();
          }
        }
      ]
    }
  }

  findGroupById(groupId: string, data: any): any {
    for (const group of data) {
      if (group.groupId === groupId) {
        return group;
      } else {
        const foundGroup = group.data.find((item: any) => item.groupId === groupId);
        if (foundGroup) {
          return foundGroup;
        } else {
          for (const subGroup of group.data) {
            if (subGroup.data && subGroup.data.length > 0) {
              const recursivelyFoundGroup = this.findGroupById(groupId, [subGroup]);
              if (recursivelyFoundGroup) {
                return recursivelyFoundGroup;
              }
            }
          }
        }
      }
    }
    return null; // Group ID not found
  }

}
