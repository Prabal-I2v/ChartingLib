import { OneDimensionWidget, OneDimensionWidgetConstructorProps } from "../Widget";;
import { Enum_WidgetType } from "../enums/enums";

export class BarChart1DWidget extends OneDimensionWidget {
  widgetType = Enum_WidgetType.BarChart1D
    constructor(params: OneDimensionWidgetConstructorProps) {
        // Call the parent constructor with the params
        super({
          ...params  // Allow overriding any properties
        });
      }
}