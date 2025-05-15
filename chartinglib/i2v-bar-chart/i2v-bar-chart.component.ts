import { ChangeDetectorRef, Component, ElementRef, Input } from "@angular/core";
import { I2vChartsComponent } from "../i2v-charts/i2v-charts.component";
import { ChartingDataService } from "../charting-data.service";

@Component({
  selector: "i2v-bar-chart",
  templateUrl: "./i2v-bar-chart.component.html",
  styleUrl: "./i2v-bar-chart.component.scss",
  standalone:false,
})
export class I2vBarChartComponent extends I2vChartsComponent {
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
}
