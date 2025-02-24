import { Enum_WidgetType, Widget } from "../WidgetRequestModel";

export class StackedBarCharttWidget extends Widget {
    constructor() {
        super();
        this.widgetType = Enum_WidgetType.StackedBarChart; // Set widget type to ColumnChart
    }
}