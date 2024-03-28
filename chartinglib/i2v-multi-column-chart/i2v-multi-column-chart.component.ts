import { Component, Input } from '@angular/core';
import { I2vChartsComponent } from '../i2v-charts/i2v-charts.component';
import { SeriesVisualArgs } from '@progress/kendo-angular-charts';
import { Circle, Group, Path, geometry } from '@progress/kendo-drawing';
import { IntlService } from '@progress/kendo-angular-intl';
const { transform, Circle: GeomCircle } = geometry;

@Component({
  selector: 'i2v-multi-column-chart',
  templateUrl: './i2v-multi-column-chart.component.html',
  styleUrl: './i2v-multi-column-chart.component.scss'
})
export class I2vMultiColumnChartComponent extends I2vChartsComponent {
  @Input() chartCategories: any;
  @Input() chartData: any;
  @Input() color:any
  @Input() mwidth:any

  public radius = (e: SeriesVisualArgs) => {
    var height = e.rect.size.height;
    var width = this.mwidth;
    var radius =  width/4;
    var originY = e.rect.origin.y+radius;
    var originX = e.rect.origin.x ;
    var pointX = originX + radius;
    var pointY = originY + radius/2;

    // const geometry = new GeomCircle([pointX, pointY], radius);
    // const circle = new Circle(geometry, {
    //   stroke: { color: e.series.color, width: 1 },
    //   fill: { color: e.series.color }
    // });

    const geometry1 = new GeomCircle([originX+width/2 , pointY-radius/2], radius);

    const circle1 = new Circle(geometry1, {
      stroke: { color: e.series.color },
      fill: { color: e.series.color }
    });

    const path = new Path({
      stroke: { color: e.series.color, width: 1 },
      fill: {  color: e.series.color }
    });
    path
      .moveTo(pointX, originY)
      .lineTo(originX + width - radius, originY)
      .lineTo(originX + width - radius, originY + height)
      .lineTo(pointX, originY + height)
      .close();

    const group = new Group();
    group.append(path, circle1);

    return group;
  };


  constructor(public intl: IntlService) {
    super();
  }

}

