import { Enum_Method_Aggregation, Enum_WidgetType, showablePropertyModel, Widget, WidgetConstructorProps, Enum_Entity, Enum_Method,  Enum_Schema} from "../Widget";


export interface KPIConf {
  CountValueColumnName: string,
  DisplayValueColumnName: string,
  seriesAggregation? : Enum_Method_Aggregation,
  showChart?: boolean
}
export class KPIWidgetConstructorProps extends WidgetConstructorProps{
  kpiConf? : KPIConf
}

export class KpiWidget extends Widget {
  kpiConf? : KPIConf
    constructor(params: KPIWidgetConstructorProps) {
        // Call the parent constructor with the params
        super({
          widgetType: Enum_WidgetType.KPI,  // Set default widget type
          ...params  // Allow overriding any properties
        });
        this.kpiConf = params.kpiConf
      }
}