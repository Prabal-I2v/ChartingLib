import { OneDimensionWidget, OneDimensionWidgetConstructorProps } from "../Widget";;
import { Enum_WidgetType } from "../enums/enums";

export class LineChart1DWidget extends OneDimensionWidget {
  widgetType = Enum_WidgetType.LineChart1D
  constructor(params: OneDimensionWidgetConstructorProps) {
    // Call the parent constructor with the params
    super({
      ...params  // Allow overriding any properties
    });
  }
}