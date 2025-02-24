import { Enum_WidgetType, Widget } from "../WidgetRequestModel";

export class HeatMapCharttWidget extends Widget {
    constructor() {
        super();
        this.widgetType = Enum_WidgetType.HeatMapChart; // Set widget type to ColumnChart
    }
}