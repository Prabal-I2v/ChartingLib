import { Enum_WidgetType, Widget } from "../WidgetRequestModel";

export class BarChartWidget extends Widget {
    constructor() {
        super();
        this.widgetType = Enum_WidgetType.BarChart; // Set widget type to ColumnChart
    }
}