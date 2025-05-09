import { ThreeDimensionWidget, ThreeDimensionWidgetConstructorProps, TwoDimensionWidget, TwoDimensionWidgetConstructorProps } from "../dimension-widgets";
import { Enum_WidgetType } from "../enums/enums";

export class AreaChartWidget extends TwoDimensionWidget {
    constructor(params: TwoDimensionWidgetConstructorProps) {
        // Call the parent constructor with the params
        super({
          widgetType: Enum_WidgetType.AreaChart,
          ...params  // Allow overriding any properties
        });
      }
}