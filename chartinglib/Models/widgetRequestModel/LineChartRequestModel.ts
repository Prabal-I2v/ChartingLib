import { Enum_WidgetType, Widget, WidgetConstructorProps } from "../Widget";

export class LineChartWidget extends Widget {
    constructor(params: WidgetConstructorProps) {
        // Call the parent constructor with the params
        super({
          widgetType: Enum_WidgetType.LineChart,  // Set default widget type
          ...params  // Allow overriding any properties
        });
      }
}