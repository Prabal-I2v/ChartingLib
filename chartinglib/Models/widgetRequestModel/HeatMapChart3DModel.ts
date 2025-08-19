import { ThreeDimensionWidget, ThreeDimensionWidgetConstructorProps } from "../Widget";;
import { Enum_WidgetType } from "../enums/enums";


export class HeatMapChart3DWidget extends ThreeDimensionWidget {
  widgetType = Enum_WidgetType.HeatMapChart3D
  constructor(params: ThreeDimensionWidgetConstructorProps) {
    // Call the parent constructor with the params
    super({
      // Set default widget type
      ...params  // Allow overriding any properties
    });
  }
}