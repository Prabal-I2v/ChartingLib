import { ThreeDimensionWidget, ThreeDimensionWidgetConstructorProps } from "../Widget";;
import { Enum_WidgetType } from "../enums/enums";

export class StackedBarChartWidget extends ThreeDimensionWidget {

  widgetType = Enum_WidgetType.StackedBarChart
  constructor(params: ThreeDimensionWidgetConstructorProps) {
    // Call the parent constructor with the params
    super({
      ...params  // Allow overriding any properties
    });
  }
}