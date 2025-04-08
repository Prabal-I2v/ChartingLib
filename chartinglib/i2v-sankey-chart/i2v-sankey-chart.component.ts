import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { I2vChartsComponent } from '../i2v-charts/i2v-charts.component';
import { ChartingDataService } from '../charting-data.service';
import { ChartsOutputModel } from '../Models/ChartsOutputModel';
import { ClientChartModel, ChartSeries } from '../Models/ClientChartModel';
import { Sankey } from '@progress/kendo-charts/dist/npm/sankey'


@Component({
  selector: 'i2v-sankey-chart',
  templateUrl: './i2v-sankey-chart.component.html',
  styleUrl: './i2v-sankey-chart.component.css'
})
export class I2vSankeyChartComponent  extends I2vChartsComponent {
  public data = {
    nodes: [
      { id: "female", label: { text: "Female (23%)" } },
      { id: "male", label: { text: "Male (77%)" } },
      { id: "angry", label: { text: "Angry (20%)" } },
      { id: "happy", label: { text: "Happy (18%)" } },
      { id: "neutral", label: { text: "Neutral (57%)" } },
      { id: "sad", label: { text: "Sad (3%)" } },
      { id: "disgusted", label: { text: "Disgusted (2%)" } },
      { id: "scared", label: { text: "Scared (0%)" } },
      { id: "0-20", label: { text: "0-20 (3%)" } },
      { id: "21-40", label: { text: "21-40 (64%)" } },
      { id: "41-60", label: { text: "41-60 (33%)" } },
      { id: "61-80", label: { text: "61-80 (1%)" } },
    ],
    links: [
      // Gender to Emotion
      { sourceId: "female", targetId: "angry", value: 18 },
      { sourceId: "female", targetId: "disgusted", value: 38 },
      { sourceId: "female", targetId: "happy", value: 411 },
      { sourceId: "female", targetId: "neutral", value: 951 },
      { sourceId: "female", targetId: "sad", value: 69 },
      { sourceId: "male", targetId: "angry", value: 1283 },
      { sourceId: "male", targetId: "disgusted", value: 73 },
      { sourceId: "male", targetId: "happy", value: 773 },
      { sourceId: "male", targetId: "neutral", value: 2810 },
      { sourceId: "male", targetId: "sad", value: 135 },
      { sourceId: "male", targetId: "scared", value: 2 },
      
      // Emotion to Age Group
      { sourceId: "angry", targetId: "0-20", value: 8 },
      { sourceId: "angry", targetId: "21-40", value: 706 },
      { sourceId: "angry", targetId: "41-60", value: 587 },
      { sourceId: "disgusted", targetId: "0-20", value: 1 },
      { sourceId: "disgusted", targetId: "21-40", value: 76 },
      { sourceId: "disgusted", targetId: "41-60", value: 34 },
      { sourceId: "happy", targetId: "0-20", value: 31 },
      { sourceId: "happy", targetId: "21-40", value: 673 },
      { sourceId: "happy", targetId: "41-60", value: 478 },
      { sourceId: "happy", targetId: "61-80", value: 2 },
      { sourceId: "neutral", targetId: "0-20", value: 144 },
      { sourceId: "neutral", targetId: "21-40", value: 2624 },
      { sourceId: "neutral", targetId: "41-60", value: 954 },
      { sourceId: "neutral", targetId: "61-80", value: 39 },
      { sourceId: "sad", targetId: "0-20", value: 2 },
      { sourceId: "sad", targetId: "21-40", value: 110 },
      { sourceId: "sad", targetId: "41-60", value: 92 },
      { sourceId: "scared", targetId: "0-20", value: 1 },
      { sourceId: "scared", targetId: "21-40", value: 1 },
    ],
  };;
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

  transformData(data: ChartsOutputModel): ClientChartModel {
      const chartData = new ClientChartModel();
      chartData.series = data.data.map((x) => {
        return new ChartSeries({ name: x.label, data: x.data });
      });
      if (data.labels.length > 0) {
        chartData.chartCategories = data.labels[0].value;
        chartData.x_label = data.labels[0].key;
      } else {
        chartData.chartCategories = data.data.map((x) => {
          return x.label;
        });
      }

      return chartData;
    }
}