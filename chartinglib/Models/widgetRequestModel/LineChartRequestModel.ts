import { Enum_WidgetType, Widget } from "../WidgetRequestModel";

export class LineChartWidget extends Widget {
    constructor() {
        super();
        this.widgetType = Enum_WidgetType.LineChart; // Set widget type to ColumnChart
    }
}