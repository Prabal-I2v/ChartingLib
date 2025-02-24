import { CreateBaseWidget } from "../CreateBaseWidget/CreateBaseWidget";
import {  Enum_Entity, Enum_Method, Enum_Schema,  Enum_WidgetType} from "../Models/WidgetRequestModel";
import { StackedColumnCharttWidget } from "../Models/widgetRequestModel/StackedColumnChartRequestModel";

export class StackColumnChartCreateBaseWidgetClass extends CreateBaseWidget {

    creatingBaseWidget(heading: string, entity: Enum_Entity, schemaName: Enum_Schema, method: Enum_Method, showableProperties: string[], allowRefresh: boolean): StackedColumnCharttWidget {
        const widget = new StackedColumnCharttWidget();
        return this.createBaseWidget(widget, heading, entity, schemaName, method, showableProperties, allowRefresh);
    }
}
