import { dashboard } from "../DashboardModel";
import { OneDimensionWidget, OneDimensionWidgetConstructorProps, TwoDimensionWidget, TwoDimensionWidgetConstructorProps } from "../dimension-widgets";
import { Enum_Method_Aggregation, Enum_WidgetType } from "../enums/enums";
import { OneDimensionDataInputConfig, ShowableProperty, TwoDimensionDataInputConfig, WidgetDataOutputConfig, WidgetDisplayConfig, WidgetFilterConfig, WidgetPaginationConfig } from "../interfaces/interfaces";
import { WidgetTileConf } from "../types/types";

export interface KPIConf {
  CountValueColumnName: string,
  DisplayValueColumnName: string,
  ImageColumnName?: string,
  seriesAggregation? : Enum_Method_Aggregation,
  showChart?: boolean
}

export class KPIWidgetConstructorProps implements TwoDimensionWidgetConstructorProps{
  widgetType: Enum_WidgetType.KPI;
  dataInputConfig: TwoDimensionDataInputConfig;
  displayConfig: WidgetDisplayConfig;
  filterConfig?: WidgetFilterConfig;
  dataOutputConfig?: WidgetDataOutputConfig;
  paginationConfig?: WidgetPaginationConfig;
  showableProperties?: ShowableProperty[];
  widgetTileConf: WidgetTileConf;
  id?: string;
  dashboardId?: string;
  dashboard?: dashboard;
  isPreview?: boolean;
  query?: string;
  kpiConf? : KPIConf
}

export class KpiWidget extends TwoDimensionWidget {
  kpiConf? : KPIConf
    constructor(params: KPIWidgetConstructorProps) {
        // Call the parent constructor with the params
        super({
          widgetType: Enum_WidgetType.KPI,
          ...params  // Allow overriding any properties
        });
        this.kpiConf = params.kpiConf
      }
}