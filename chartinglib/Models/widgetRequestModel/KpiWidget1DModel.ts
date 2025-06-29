
import { Enum_WidgetType } from "../enums/enums";
import { OneDimensionWidget, OneDimensionWidgetConstructorProps } from "../Widget";
import { KPIConf } from "./KpiWidget2DModel";


export class KPI1DWidgetConstructorProps extends OneDimensionWidgetConstructorProps {
  kpiConf?: KPIConf
}

export class Kpi1DWidget extends OneDimensionWidget {

  widgetType = Enum_WidgetType.KPI1D
  kpiConf?: KPIConf
  constructor(params: KPI1DWidgetConstructorProps) {
    // Call the parent constructor with the params
    super({
      ...params  // Allow overriding any properties
    });
    this.kpiConf = params.kpiConf
  }
}