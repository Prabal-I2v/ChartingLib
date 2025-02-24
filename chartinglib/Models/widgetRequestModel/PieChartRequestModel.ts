import { Enum_WidgetType, Widget } from "../WidgetRequestModel";

export class PieChartWidget extends Widget {
    constructor() {
        super();
        this.widgetType = Enum_WidgetType.PieChart; // Set widget type to ColumnChart
    }
}