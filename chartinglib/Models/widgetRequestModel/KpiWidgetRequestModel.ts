import { Enum_WidgetType, Widget } from "../WidgetRequestModel";

export class KpiWidget extends Widget {
    constructor() {
        super();
        this.widgetType = Enum_WidgetType.KPI; // Set widget type to KPI
    }
}