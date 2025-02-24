import { Enum_WidgetType, Widget } from "../WidgetRequestModel";

export class StackedColumnCharttWidget extends Widget {
    constructor() {
        super();
        this.widgetType = Enum_WidgetType.StackedColumnChart; // Set widget type to ColumnChart
    }
}