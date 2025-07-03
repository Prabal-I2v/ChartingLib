import { Enum_Method_Aggregation, Enum_WidgetType } from "../enums/enums";
import { TwoDimensionWidgetConstructorProps, TwoDimensionWidget } from "../Widget";


export interface KPIConf {
  CountValueColumnName?: string,
  DisplayValueColumnName?: string,
  ImageColumnName?: string,
  showChart?: boolean
  hideLabel?: boolean
}

export class KPI2DWidgetConstructorProps extends TwoDimensionWidgetConstructorProps{
  kpiConf? : KPIConf
}

export class Kpi2DWidget extends TwoDimensionWidget {
  widgetType: Enum_WidgetType = Enum_WidgetType.KPI2D;
  kpiConf? : KPIConf
    constructor(params: KPI2DWidgetConstructorProps) {
        super({
          ...params  // Allow overriding any properties
        });
        this.kpiConf = params.kpiConf
      }
}