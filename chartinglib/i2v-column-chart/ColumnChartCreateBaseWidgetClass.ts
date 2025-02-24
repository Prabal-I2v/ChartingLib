import { CreateBaseWidget } from "../CreateBaseWidget/CreateBaseWidget";
import { ColumnChartWidget } from "../Models/widgetRequestModel/ColumnChartRequestModel";
import { CustomFilterValueModel, Enum_Entity, Enum_Method, Enum_Schema, Enum_TimePeriod, Enum_WidgetType, JoinableEntity, RulePropertyType, RuleSet, Widget } from "../Models/WidgetRequestModel";

export class ColumnChartCreateBaseWidgetClass extends CreateBaseWidget {
    creatingBaseWidget(heading: string, entity: Enum_Entity, schemaName: Enum_Schema, method: Enum_Method, showableProperties: string[], allowRefresh: boolean): ColumnChartWidget {
        const widget = new ColumnChartWidget();
        widget.widgetType = Enum_WidgetType.ColumnChart;
        return this.createBaseWidget(widget, heading, entity, schemaName, method, showableProperties, allowRefresh);
    }
}
