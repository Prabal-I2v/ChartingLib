import { CreateBaseWidget } from "../CreateBaseWidget/CreateBaseWidget";
import {  Enum_Entity, Enum_Method, Enum_Schema} from "../Models/WidgetRequestModel";
import { HeatMapCharttWidget } from "../Models/widgetRequestModel/HeatMapChartRequestModel";

export class StackedBarChartCreateBaseWidgetClass extends CreateBaseWidget {

    creatingBaseWidget(heading: string, entity: Enum_Entity, schemaName: Enum_Schema, method: Enum_Method, showableProperties: string[], allowRefresh: boolean): HeatMapCharttWidget {
        const widget = new HeatMapCharttWidget();
        return this.createBaseWidget(widget, heading, entity, schemaName, method, showableProperties, allowRefresh);
    }
}
