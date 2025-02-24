import { CreateBaseWidget } from "../CreateBaseWidget/CreateBaseWidget";
import {  Enum_Entity, Enum_Method, Enum_Schema} from "../Models/WidgetRequestModel";
import { PieChartWidget } from "../Models/widgetRequestModel/PieChartRequestModel";

export class PieChartCreateBaseWidgetClass extends CreateBaseWidget {

    creatingBaseWidget(heading: string, entity: Enum_Entity, schemaName: Enum_Schema, method: Enum_Method, showableProperties: string[], allowRefresh: boolean): PieChartWidget {
        const widget = new PieChartWidget();
        return this.createBaseWidget(widget, heading, entity, schemaName, method, showableProperties, allowRefresh);
    }
}
