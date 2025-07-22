import { OneDimensionWidget, OneDimensionWidgetConstructorProps } from "../Widget";;
import { Enum_WidgetType } from "../enums/enums";


export class HeatMapChart1DWidget extends OneDimensionWidget {
  widgetType = Enum_WidgetType.HeatMapChart1D
  constructor(params: OneDimensionWidgetConstructorProps) {
    // Call the parent constructor with the params
    super({
      ...params  // Allow overriding any properties
    });
  }
}