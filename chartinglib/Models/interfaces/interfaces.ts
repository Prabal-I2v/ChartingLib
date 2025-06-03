
import { EventPropertyType } from "src/app/Models/eventPropertyType.model";
import { dashboard } from "../DashboardModel";
import { Enum_Entity, Enum_Method, Enum_Method_Aggregation, Enum_Schema, Enum_WidgetType } from "../enums/enums";
import { ColumnClubInRange, CustomFilterValueModel, groupByConf, JoinableEntity, Rule, RuleSet, WidgetTileConf } from "../types/types";

// Base Configuration Interfaces
export interface WidgetDisplayConfig {
  heading: string;
  subHeading?: string;
  color?: string;
  svgIcon?: string;
}

export interface WidgetDataConfig {
  entity: Enum_Entity;
  schemaName: Enum_Schema;
  joinableEntities?: JoinableEntity[];
}

export interface WidgetInteractivityConfig {
  max?: number;
  isPannable?: boolean;
  isZoomable?: boolean;
  isWidgetHidden: boolean;
}

export interface WidgetFilterConfig {
  customFilters?: Record<string, CustomFilterValueModel[]>;
  baseFilter?: RuleSet;
  propertyFilters?: RuleSet;
  disableTimeFilter?: boolean;
  startTime?: number;
  endTime?: number;
  isDashboardFilterApplied?: boolean;
}

export interface WidgetDataOutputConfig {
  columnClubInRange?: ColumnClubInRange[];
  // clubbingAggregationType?: Enum_Method_Aggregation;
}

export interface WidgetFieldNameConfig{
  name : string;
  type : EventPropertyType;
  rule?: Rule;
}

export interface ShowableProperty {
  name: string;
  displayName: string;
  isMultiValued?: boolean;
  isLabel?: boolean;
  multiValuedConfig?: {
    dependentOnColumn?: string;
    valueBasedOnColumn: string;
  };
}

// Dimension-specific Data Input Configurations
export interface OneDimensionDataInputConfig{
  isDistinct?: boolean;
  method: Enum_Method;
  dataConfig: WidgetDataConfig[];
  DataOutputConfig?: WidgetDataOutputConfig;
  fieldNames?: WidgetFieldNameConfig[];
  getColumnNameWithAggregationMethod?: boolean;
  clubbingAggregationType? : Enum_Method_Aggregation;
}


export interface TwoDimensionDataInputConfig extends OneDimensionDataInputConfig {
  groupBy1?: groupByConf; // Required for 2D widgets
  clubbingTime?: boolean;
}

export interface ThreeDimensionDataInputConfig extends TwoDimensionDataInputConfig {
  groupBy2?: groupByConf; // Required for 3D widgets
}

export interface NoDimensionDataInputConfig extends OneDimensionDataInputConfig {

}

// Base widget constructor props
export interface BaseWidgetConstructorProps {
  widgetType: Enum_WidgetType;
  displayConfig: WidgetDisplayConfig;
  filterConfig?: WidgetFilterConfig;
  dataOutputConfig?: WidgetDataOutputConfig;
  WidgetInteractivityConfig?: WidgetInteractivityConfig;
  showableProperties?: ShowableProperty[];
  widgetTileConf: WidgetTileConf;
  id?: string;
  dashboardId?: string;
  dashboard?: dashboard;
  isPreview?: boolean | null;
  allowRefresh?: boolean;
  refreshInterval?: number;
  query?: string;
}
