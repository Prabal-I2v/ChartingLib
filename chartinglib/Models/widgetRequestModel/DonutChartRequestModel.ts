import { Enum_Method_Aggregation, Enum_WidgetType, Widget, WidgetConstructorProps } from "../Widget";

export interface DonutConf {
  resultLabel: string
  seriesAggregation : Enum_Method_Aggregation,
  showSeriesLabelValue : boolean;
}

export class DonutWidgetConstructorProps extends WidgetConstructorProps{
  donutConf : DonutConf
}
export class DonutChartWidget extends Widget {
  donutConf : DonutConf
    constructor(params: DonutWidgetConstructorProps) {
        // Call the parent constructor with the params
        super({
          widgetType: Enum_WidgetType.PieChart,  // Set default widget type
          ...params  // Allow overriding any properties
        });
        this.donutConf = params.donutConf
      }
}