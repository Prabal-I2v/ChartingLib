import { OneDimensionWidget } from "../dimension-widgets";
import { Enum_WidgetType, WidgetDimension } from "../enums/enums";
import { WidgetConstructorProps } from "../types/types";


export class TableWidget extends OneDimensionWidget {
  dimension: WidgetDimension = WidgetDimension.nthDimesnion;
  widgetType = Enum_WidgetType.Table;
  constructor(params: WidgetConstructorProps) {
    // Call the parent constructor with the params
    super({
      widgetType: Enum_WidgetType.Table,  // Set default widget type
      ...params  // Allow overriding any properties
    });
  }
}