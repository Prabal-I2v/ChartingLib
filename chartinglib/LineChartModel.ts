import { EChartsOption } from "echarts";
import { BaseChartClassModel } from "./BaseChartClassModel";
import { IChartDataModel } from "./chartingUtility";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
class LineChartModel extends BaseChartClassModel {
  formatChartData(
    title = "",
    xAxisLabel = "",
    yAxisLabel = "",
  ): (source: IChartDataModel) => EChartsOption {
    return (source: IChartDataModel) => {
      let options: EChartsOption = {
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
        title: { text: title, show: true },
        xAxis: {
          type: "category",
          data: source.xAxisData,
          name: xAxisLabel,
          axisTick: { alignWithLabel: true },
        },
        series: [],
        yAxis: { type: "value", name: yAxisLabel },
        legend: { data: source.seriesLabels },
      };

      source.seriesData.forEach((series: any, index: any) => {
        if (options.series && Array.isArray(options.series)) {
          options.series.push({
            type: "bar",
            data: series,
            name: source.seriesLabels[index],
            label: {
              show: true,
              rotate: 90,
              align: "left",
              verticalAlign: "middle",
              position: "insideBottom",
              distance: 15,
              formatter: "{a} → {c}",
              fontSize: 14,
            },
          });
        }
      });

      return options;
    };
  }
}
