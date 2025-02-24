import { CustomFilterValueModel, Enum_Entity, Enum_Method, Enum_Schema, Enum_TimePeriod, JoinableEntity, RulePropertyType, RuleSet, Widget } from "../Models/WidgetRequestModel";


export abstract class CreateBaseWidget {
    protected createBaseWidget<T extends Widget>(
        widget: T,
        heading: string,
        entity: Enum_Entity,
        schemaName: Enum_Schema,
        method: Enum_Method,
        showableProperties: string[],
        allowRefresh: boolean
    ): T {
        widget.heading = heading;
        widget.entity = entity;
        widget.schemaName = schemaName;
        widget.method = method;
        widget.showableProperties = showableProperties;
        widget.allowRefresh = allowRefresh;
        return widget;
    }


    abstract creatingBaseWidget(heading: string, entity: Enum_Entity, schemaName: Enum_Schema, method: Enum_Method, showableProperties: string[], allowRefresh: boolean): Widget;
}
