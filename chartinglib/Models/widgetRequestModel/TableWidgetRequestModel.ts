import { dashboard } from "../DashboardModel";
import { NoDimensionWidget, NoDimensionWidgetConstructorProps, OneDimensionWidget } from "../dimension-widgets";
import { Enum_WidgetType, WidgetDimension } from "../enums/enums";
import { NoDimensionDataInputConfig, WidgetDisplayConfig, WidgetFilterConfig, WidgetDataOutputConfig, WidgetInteractivityConfig, ShowableProperty } from "../interfaces/interfaces";
import { WidgetTileConf } from "../types/types";


export interface TableConf {
  pagination: boolean;
  pageLimit: number;
  pageNumber: number;
}

export class TableWidgetConstructorProps implements NoDimensionWidgetConstructorProps{
  dataInputConfig: NoDimensionDataInputConfig;
  displayConfig: WidgetDisplayConfig;
  filterConfig?: WidgetFilterConfig;
  dataOutputConfig?: WidgetDataOutputConfig;
  WidgetInteractivityConfig?: WidgetInteractivityConfig;
  showableProperties?: ShowableProperty[];
  widgetTileConf: WidgetTileConf;
  allowRefresh?: boolean;
  refreshInterval?: number;
  widgetType: Enum_WidgetType.Table;
  id?: string;
  dashboardId?: string;
  dashboard?: dashboard;
  isPreview?: boolean;
  query?: string;
  tableConf? : TableConf
}

export class TableWidget extends NoDimensionWidget {
  tableConf: TableConf;
  constructor(params: TableWidgetConstructorProps) {
    // Call the parent constructor with the params
    super({
      widgetType: Enum_WidgetType.Table, // Set default widget type
      ...params // Allow overriding any properties
    });
    this.tableConf = params.tableConf;
  }
}