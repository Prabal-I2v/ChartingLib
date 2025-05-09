import { dashboard } from "../DashboardModel";
import { TwoDimensionWidget, TwoDimensionWidgetConstructorProps } from "../dimension-widgets";
import { Enum_Method_Aggregation, Enum_WidgetType } from "../enums/enums";
import { TwoDimensionDataInputConfig, WidgetDisplayConfig, WidgetFilterConfig, WidgetDataOutputConfig, WidgetPaginationConfig, ShowableProperty } from "../interfaces/interfaces";
import { WidgetTileConf } from "../types/types";

export interface DonutConf {
  resultLabel: string
  seriesAggregation : Enum_Method_Aggregation,
  showSeriesLabelValue : boolean;
}

export class DonutWidgetConstructorProps implements TwoDimensionWidgetConstructorProps {
  dataInputConfig: TwoDimensionDataInputConfig;
  widgetType: Enum_WidgetType;
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
  donutConf? : DonutConf
}
export class DonutChartWidget extends TwoDimensionWidget {
  donutConf : DonutConf
    constructor(params: DonutWidgetConstructorProps) {
        // Call the parent constructor with the params
        super({
          widgetType: Enum_WidgetType.ColumnChart,  // Set default widget type
          ...params  // Allow overriding any properties
        });
        this.donutConf = params.donutConf
      }
}