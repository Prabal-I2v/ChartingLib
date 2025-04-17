import { Enum_WidgetType, Widget, WidgetConstructorProps } from "../Widget";

export class TableWidget extends Widget {
   constructor(params: WidgetConstructorProps) {
        // Call the parent constructor with the params
        super({
          widgetType: Enum_WidgetType.Table,  // Set default widget type
          ...params  // Allow overriding any properties
        });
      }
}