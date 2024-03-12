import { EChartsOption } from "echarts";
import { IChartDataModel } from "./chartingUtility";

export abstract class BaseChartClassModel {
    static formatChartData(title = '', xAxisLabel = '', yAxisLabel = ''): (source: IChartDataModel) => EChartsOption {
        return (source: IChartDataModel) => {
            let options: EChartsOption = {
                tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                title: { text: title, show: true },
                xAxis: { type: 'category', data: source.xAxisData, name: xAxisLabel, axisTick: { alignWithLabel: true } },
                series: [],
                yAxis: { type: 'value', name: yAxisLabel },
                legend: { data: source.seriesLabels }
            };

            source.seriesData.forEach((series: any, index: any) => {
                if (options.series && Array.isArray(options.series)) {
                    options.series.push({
                        type: 'bar',
                        data: series,
                        name: source.seriesLabels[index],
                        label: { show: true, rotate: 90, align: 'left', verticalAlign: 'middle', position: 'insideBottom', distance: 15, formatter: '{a} → {c}', fontSize: 14 }
                    });
                }
            });

            return options;
        };
    }

    // getChartOptions(query: Query, title = '', xAxisLabel = '', yAxisLabel = '') {
    //     // Load data synchronously
    //     const data = this.cmcs.loadSync(query);
        
    //     // Reduce data to format it for chart
    //     const chartData = data.reduce((ac: ChartData, cv: object, index: number) => {
    //         const vals = Object.values(cv);
    
    //         if (index == 0) {
    //             for (let i = 1; i < vals.length; i++) {
    //                 ac.seriesData.push([]);
    //             }
    
    //             ac.seriesLabels = Object.keys(cv).slice(1).map(k => k.substring(k.lastIndexOf('.') + 1));
    //         }
    
    //         ac.xAxisData.push(vals[0]);
    
    //         for (let i = 1; i < vals.length; i++) {
    //             ac.seriesData[i - 1].push(vals[i]);
    //         }
    
    //         return ac;
    //     }, { xAxisData: [], seriesData: [], seriesLabels: [] });
    
    //     // Format chart data
    //     const formattedChartData = this.formatBarChartData(title, xAxisLabel, yAxisLabel)(chartData);
    
    //     return formattedChartData;
    // }
    
}