import { CreateBaseWidget } from "../CreateBaseWidget/CreateBaseWidget";
import { KpiWidget } from "../Models/widgetRequestModel/KpiWidgetRequestModel";
import { CustomFilterValueModel, Enum_Entity, Enum_Method, Enum_Schema, Enum_TimePeriod, Enum_WidgetType, JoinableEntity, RulePropertyType, RuleSet, Widget } from "../Models/WidgetRequestModel";

export class KpiCreateBaseWidgetClass extends CreateBaseWidget {
  

    creatingBaseWidget(heading: string, entity: Enum_Entity, schemaName: Enum_Schema, method: Enum_Method, showableProperties: string[], allowRefresh: boolean): KpiWidget {
        const widget = new KpiWidget();
        widget.widgetType = Enum_WidgetType.KPI;
        return this.createBaseWidget(widget, heading, entity, schemaName, method, showableProperties, allowRefresh);
    }
}
