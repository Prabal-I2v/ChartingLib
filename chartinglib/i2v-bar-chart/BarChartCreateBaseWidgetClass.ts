import { CreateBaseWidget } from "../CreateBaseWidget/CreateBaseWidget";
import {  Enum_Entity, Enum_Method, Enum_Schema,  Enum_WidgetType} from "../Models/WidgetRequestModel";
import { BarChartWidget } from "../Models/widgetRequestModel/BarChartRequestModel";

export class BarChartCreateBaseWidgetClass extends CreateBaseWidget {

    creatingBaseWidget(heading: string, entity: Enum_Entity, schemaName: Enum_Schema, method: Enum_Method, showableProperties: string[], allowRefresh: boolean): BarChartWidget {
        const widget = new BarChartWidget();
        return this.createBaseWidget(widget, heading, entity, schemaName, method, showableProperties, allowRefresh);
    }
}
