export class HeatMapClientChartData {
    data: HeatMapDataModel[] = [];
    xAxisLabel: string;
    yAxisLabel: string;
}

export class HeatMapDataModel {
    xAxis: string;
    yAxis: string;
    value: number;
}