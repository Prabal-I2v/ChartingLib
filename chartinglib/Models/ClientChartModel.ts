export class ClientChartModel {
  series: ChartSeries[];
  xAxisFields: string[];
  xAxisLabel: string;
  yAxisLabel: string;
}

export class ChartSeries {
  name: string;
  data: string[] | number[];
  displayName : string;
  color?: string;

  constructor(params: {
    name?: string;
    displayName : string;
    data?: string[] | number[];
    color?: string;
  }) {
    this.name = params.name;
    this.data = params.data;
    this.displayName = params.displayName ?? params.name
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
