import { TwoDimensionWidget, TwoDimensionWidgetConstructorProps } from "../dimension-widgets";
import { Enum_WidgetType } from "../enums/enums";

export class BarChartWidget extends TwoDimensionWidget {
    constructor(params: TwoDimensionWidgetConstructorProps) {
        // Call the parent constructor with the params
        super({
          widgetType: Enum_WidgetType.BarChart,  // Set default widget type
          ...params  // Allow overriding any properties
        });
      }
}