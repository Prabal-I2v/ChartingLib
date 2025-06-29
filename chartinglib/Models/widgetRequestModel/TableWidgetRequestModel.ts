import { dashboard } from "../DashboardModel";
import { NoDimensionWidget, NoDimensionWidgetConstructorProps, OneDimensionWidget } from "../Widget";;
import { Enum_WidgetType, WidgetDimension } from "../enums/enums";
import { INoDimensionDataInputConfig, IWidgetDisplayConfig, IWidgetFilterConfig, IWidgetDataOutputConfig, IWidgetInteractivityConfig, IShowableProperty } from "../interfaces/interfaces";
import { WidgetTileConf } from "../types/types";


export interface TableConf {
  pagination: boolean;
  pageLimit: number;
  pageNumber: number;
}

export class TableWidgetConstructorProps extends NoDimensionWidgetConstructorProps {
  tableConf?: TableConf
}

export class TableWidget extends NoDimensionWidget {
  widgetType = Enum_WidgetType.Table
  tableConf?: TableConf;
  constructor(params: TableWidgetConstructorProps) {
    super({
      ...params // Allow overriding any properties
    });
    this.tableConf = params.tableConf;
  }
}