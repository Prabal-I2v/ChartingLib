import { ChangeDetectorRef, Component, ElementRef, Input } from "@angular/core";
import { I2vChartsComponent } from "../i2v-charts/i2v-charts.component";
import { ChartingDataService } from "../charting-data.service";
import { ChartsOutputModel } from "../Models/ChartsOutputModel";
import { ClientChartModel, ChartSeries } from "../Models/ClientChartModel";

@Component({
  selector: "i2v-pie-chart",
  templateUrl: "./i2v-pie-chart.component.html",
  styleUrl: "./i2v-pie-chart.component.scss",
})
export class I2vPieChartComponent extends I2vChartsComponent {

  chartData: ClientChartModel;

  public labelContent(args: any): string {
    var x = `${args.dataItem.name}`;
    return x;
  }

  constructor(
    chartingDataService: ChartingDataService,
    cd: ChangeDetectorRef,
    elementRef: ElementRef
  ) {
    super(cd, chartingDataService,elementRef);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  transformChartData(data: ChartsOutputModel) {
    const chartData = new ClientChartModel();
    chartData.series = data.seriesData.map((x) => {
      return new ChartSeries({ data :x.data, name: x.label });
    });

    chartData.xAxisFields = data.seriesData.map((x) => {
      return x.label;
    });
   this.chartData = chartData;
  }
}
