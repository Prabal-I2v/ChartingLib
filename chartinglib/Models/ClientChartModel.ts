export class ClientChartModel {
  series: ChartSeries[];
  chartCategories: string[];
  x_label: string;
  y_label: string;
}

export class ChartSeries {
  name: string;
  data: any[];
  value: number;
  yaxis: string;
  color?: string;

  constructor(params: {
    name?: string;
    data?: any[];
    yaxis?: string;
    value?: number;
    color?: string;
  }) {
    this.name = params.name;
    this.data = params.data;
    if (params.value) {
      this.value = params.value;
    }
    if (params.color) {
      this.color = params.color;
    }
    if (params.yaxis) {
      this.yaxis = params.yaxis;
    }
  }
}
