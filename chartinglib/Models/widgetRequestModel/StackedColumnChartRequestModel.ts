import { ThreeDimensionWidget, ThreeDimensionWidgetConstructorProps } from "../dimension-widgets";
import { Enum_WidgetType } from "../enums/enums";

export class StackedColumnChartWidget extends ThreeDimensionWidget {
    constructor(params: ThreeDimensionWidgetConstructorProps) {
        // Call the parent constructor with the params
        super({
          widgetType: Enum_WidgetType.StackedColumnChart,  // Set default widget type
          ...params  // Allow overriding any properties
        });
      }
}