import { TwoDimensionWidget, TwoDimensionWidgetConstructorProps } from "../Widget";;
import { Enum_WidgetType } from "../enums/enums";


export class PieChart2DWidget extends TwoDimensionWidget {
  widgetType = Enum_WidgetType.PieChart2D
  constructor(params: TwoDimensionWidgetConstructorProps) {
    // Call the parent constructor with the params
    super({
      ...params  // Allow overriding any properties
    });
  }
}