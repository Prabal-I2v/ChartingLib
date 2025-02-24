import { CreateBaseWidget } from "../CreateBaseWidget/CreateBaseWidget";
import {  Enum_Entity, Enum_Method, Enum_Schema} from "../Models/WidgetRequestModel";
import { StackedBarCharttWidget } from "../Models/widgetRequestModel/StackedBarChartRequestModel";

export class StackedBarChartCreateBaseWidgetClass extends CreateBaseWidget {

    creatingBaseWidget(heading: string, entity: Enum_Entity, schemaName: Enum_Schema, method: Enum_Method, showableProperties: string[], allowRefresh: boolean): StackedBarCharttWidget {
        const widget = new StackedBarCharttWidget();
        return this.createBaseWidget(widget, heading, entity, schemaName, method, showableProperties, allowRefresh);
    }
}
