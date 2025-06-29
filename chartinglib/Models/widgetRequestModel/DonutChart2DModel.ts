import { TwoDimensionWidget, TwoDimensionWidgetConstructorProps } from "../Widget";;
import { Enum_Method_Aggregation, Enum_WidgetType, WidgetDimension } from "../enums/enums";

export interface DonutConf {
  resultLabel: string
  seriesAggregation : Enum_Method_Aggregation,
  showSeriesLabelValue : boolean;
}

export class Donut2DWidgetConstructorProps extends TwoDimensionWidgetConstructorProps {
  donutConf? : DonutConf
}
export class DonutChart2DWidget extends TwoDimensionWidget {
  widgetType = Enum_WidgetType.Donut2D
  donutConf? : DonutConf
    constructor(params: Donut2DWidgetConstructorProps) {
        // Call the parent constructor with the params
        super({
          ...params  // Allow overriding any properties
        });
        this.donutConf = params.donutConf
      }
}