import { ChangeDetectorRef, Component, ElementRef, Input } from "@angular/core";
import { I2vChartsComponent } from "../i2v-charts/i2v-charts.component";
import { ChartingDataService } from "../charting-data.service";

@Component({
  selector: "i2v-line-chart",
  templateUrl: "./i2v-line-chart.component.html",
  styleUrl: "./i2v-line-chart.component.scss",
  standalone:false,
})
export class I2vLineChartComponent extends I2vChartsComponent {
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
