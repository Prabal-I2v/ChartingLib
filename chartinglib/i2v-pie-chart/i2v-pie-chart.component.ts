import { Component, Input } from '@angular/core';
import { I2vChartsComponent } from '../i2v-charts/i2v-charts.component';
import { Enum_Entity, Enum_Method, Enum_WidgetType, PropertyType, WidgetRequestModel } from '../Models/WidgetRequestModel';
import { ChartingDataService } from '../charting-data.service';

@Component({
  selector: 'i2v-pie-chart',
  templateUrl: './i2v-pie-chart.component.html',
  styleUrl: './i2v-pie-chart.component.scss'
})
export class I2vPieChartComponent extends I2vChartsComponent {
  @Input() chartCategories: any;
  @Input() chartData: any;

  public labelContent(args: any): string {
    return `${args.dataItem.category} years old`;
  }

  constructor(private chartingDataService:ChartingDataService) {
    super();
  }
  public getData() {
    var widgetRequestModel = new WidgetRequestModel();
    widgetRequestModel.id = 1;
    widgetRequestModel.startTime = 1711521221084
    widgetRequestModel.endTime = 1711521243832
    widgetRequestModel.widgetType = Enum_WidgetType.PieChart
    widgetRequestModel.entity = Enum_Entity.Highway_ATCC
    widgetRequestModel.method = Enum_Method.Sum
    widgetRequestModel.baseFilter = {
      "rules": [
        {
          "field": "EventName",
          "operator": "Equal",
          "value": "Highway_ATCC",
          "type": PropertyType.String
        },
      ],
      "ruleSet": [],
      "condition": "and"

    },
    widgetRequestModel.fieldName = {"bus" : PropertyType.Number, "truck" : PropertyType.Number, "motorbike" : PropertyType.Number, "car" : PropertyType.Number, "bicycle" : PropertyType.Number}
    widgetRequestModel.groupBy1 = ""
    widgetRequestModel.groupByOneIsTime = false
    widgetRequestModel.groupBy2 = ""
    widgetRequestModel.groupByTwoIsTime = false
    widgetRequestModel.isDistinct = true
    widgetRequestModel.clubbingTime = false
    widgetRequestModel.pagination = false
    widgetRequestModel.pageNumber = 0
    widgetRequestModel.pageLimit = 0
    widgetRequestModel.identifierFieldName = ""
    widgetRequestModel.multiplicationFactor = 0
  //   widgetRequestModel.propertyFilters = {
  //     "rules": [],
  //     "ruleSet": [
  //         {
  //             "rules": [
  //                 {
  //                     "field": "Truck",
  //                     "operator": "NotEqual",
  //                     "value": "DASModule"
  //                 },
  //                 {
  //                     "field": "EventName",
  //                     "operator": "Equal",
  //                     "value": "Highway_ATCC"
  //                 }
  //             ],
  //             "ruleset": [],
  //             "condition": "and"
  //         }
  //     ],
  //     "condition": "and"
  // },
    widgetRequestModel.refreshInterval = 1

    this.chartingDataService.getChartingData(widgetRequestModel).subscribe((data)=>{
    data.Labels.array.forEach((element,i) => {
          this.chartData.push({element:data.Data[0][i]})
        });

    //  this.chartData=  this.chartingDataService.tranformData( data);
    });
  }
}
