import { Component, Input } from '@angular/core';
import { I2vChartsComponent } from '../i2v-charts/i2v-charts.component';
import { ChartsOutputModel } from '../Models/ChartsOutputModel';
import { ChartSeries, ClientChartModel } from '../Models/ClientChartModel';

@Component({
  selector: 'i2v-heatmap-chart',
  templateUrl: './i2v-heatmap-chart.component.html',
  styleUrl: './i2v-heatmap-chart.component.scss'
})
export class I2vHeatmapChartComponent extends I2vChartsComponent{


  constructor() {
    super();
  }

  // public yAxisLabelContent = (e: { value: string }): string => {
  //   return this.chartData.chartCategories[e.value] || "";
  // };

  transformData(data: ChartsOutputModel) : ClientChartModel {

    var chartData = new ClientChartModel();
    chartData.series= [];
      data.data.forEach((x,i) => {
      // return new ChartSeries(x.label, x.data);
       x.data.forEach((y,j)=>{
        chartData.series.push(
          new ChartSeries({name:x.label,value:parseInt(y),yaxis:data.labels[0].value[j]})
        //   {
        //   name:x.label,
        //   data:x.data,
        //   yaxis: data.labels[i].value[j]
        // }
      );
       });
       console.log(chartData.series);


    })
    console.log(chartData.series);
    // if (data.labels.length > 0) {
    //   chartData.chartCategories = data.labels[0].value;
    //   chartData.x_label = data.labels[0].key
    // }
    // else{
    //   chartData.chartCategories = data.data.map((x) => {
    //     return x.label
    //   })
    // }
    return chartData;
  }

  // export function makeDataObjects(rows: number, cols: number): DataObject[] {
  //   const mapdata: DataObject[] = [];
  //   for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
  //     Array.from(Array(cols)).map((_, colIndex) => {
  //       mapdata.push({
  //         xAxis: `X${rowIndex + 1}`,
  //         yAxis: `Y${colIndex + 1}`,
  //         value: cols + rowIndex * colIndex,
  //       });
  //     });
  //   }

  //   return mapdata;
  // }


}
