import { Enum_WidgetType, Widget, WidgetConstructorProps } from "../Widget";

export class ColumnChartWidget extends Widget {
   constructor(params: WidgetConstructorProps) {
        // Call the parent constructor with the params
        super({
          widgetType: Enum_WidgetType.ColumnChart,  // Set default widget type
          ...params  // Allow overriding any properties
        });
      }
}