import { Enum_WidgetType, Widget } from "../WidgetRequestModel";

export class AreaCharttWidget extends Widget {
    constructor() {
        super();
        this.widgetType = Enum_WidgetType.AreaChart; // Set widget type to ColumnChart
    }
}