import { ThreeDimensionWidget, ThreeDimensionWidgetConstructorProps } from "../Widget";;
import { Enum_WidgetType } from "../enums/enums";

export class StackedColumnChartWidget extends ThreeDimensionWidget {
  widgetType = Enum_WidgetType.StackedColumnChart
  constructor(params: ThreeDimensionWidgetConstructorProps) {
    // Call the parent constructor with the params
    super({
      ...params  // Allow overriding any properties
    });
  }
}