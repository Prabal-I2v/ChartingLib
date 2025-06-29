export class ClientChartModel {
  series: ChartSeries[];
  xAxisFields: string[];
  xAxisLabel: string;
  yAxisLabel: string;
}

export class ChartSeries {
  name: string;
  data: any[];
  // value: number;
  // yAxis: string;
  color?: string;

  constructor(params: {
    name?: string;
    data?: any[];
    // yAxis?: string;
    // value?: number;
    color?: string;
  }) {
    this.name = params.name;
    this.data = params.data;
    // if (params.value) {
    //   this.value = params.value;
    // }
    if (params.color) {
      this.color = params.color;
    }
    // if (params.yAxis) {
    //   this.yAxis = params.yAxis;
    // }
  }
}
