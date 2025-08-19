
import { Enum_WidgetType } from "../enums/enums";
import { OneDimensionWidget, OneDimensionWidgetConstructorProps } from "../Widget";

export class AreaChart1DWidget extends OneDimensionWidget {
  widgetType = Enum_WidgetType.AreaChart1D
  constructor(params: OneDimensionWidgetConstructorProps) {
    // Call the parent constructor with the params
    super({
      ...params  // Allow overriding any properties
    });
  }
}