import { Enum_Method_Aggregation, Enum_WidgetType } from "../enums/enums";
import {
  OneDimensionWidget,
  OneDimensionWidgetConstructorProps,
} from "../Widget";

export interface KPIConf {
  CountValueColumnName?: string;
  DisplayValueColumnName?: string;
  ImageColumnName?: string;
  showAggregation?: boolean;
  dataAggregationMethod?: Enum_Method_Aggregation;
  showChart?: boolean;
  hideLabel?: boolean;
}

export class KPI1DWidgetConstructorProps extends OneDimensionWidgetConstructorProps {
  kpiConf?: KPIConf;
}

export class Kpi1DWidget extends OneDimensionWidget {
  widgetType = Enum_WidgetType.KPI1D;
  kpiConf?: KPIConf;
  constructor(params: KPI1DWidgetConstructorProps) {
    // Call the parent constructor with the params
    super({
      ...params, // Allow overriding any properties
    });
    this.kpiConf = params.kpiConf;
  }
}
