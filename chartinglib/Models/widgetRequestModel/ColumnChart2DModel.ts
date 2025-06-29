import { TwoDimensionWidget, TwoDimensionWidgetConstructorProps } from "../Widget";;
import { Enum_WidgetType } from "../enums/enums";


export class ColumnChart2DWidget extends TwoDimensionWidget {
  widgetType = Enum_WidgetType.ColumnChart2D
   constructor(params: TwoDimensionWidgetConstructorProps) {
        // Call the parent constructor with the params
        super({
          ...params  // Allow overriding any properties
        });
      }
}