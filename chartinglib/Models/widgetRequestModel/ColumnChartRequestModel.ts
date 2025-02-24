import { Enum_WidgetType, Widget } from "../WidgetRequestModel";

export class ColumnChartWidget extends Widget {
    constructor() {
        super();
        this.widgetType = Enum_WidgetType.ColumnChart; // Set widget type to ColumnChart
    }
}