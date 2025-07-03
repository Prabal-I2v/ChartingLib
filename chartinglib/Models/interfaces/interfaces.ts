
import { EventPropertyType } from "src/app/Models/eventPropertyType.model";
import { dashboard } from "../DashboardModel";
import { Enum_Entity, Enum_Method, Enum_Method_Aggregation, Enum_Schema } from "../enums/enums";
import { ColumnClubInRange, CustomFilterValueModel, groupByConf, Rule, RuleSet, WidgetTileConf } from "../types/types";

// Base Configuration Interfaces
export interface IWidgetDisplayConfig {
  heading: string;
  subHeading?: string;
  color?: string;
  svgIcon?: string;
}

// Join entities
export interface IJoinableEntity {
  entity: Enum_Entity;
  joinOn: string;
  joinWith: string;
  schema: Enum_Schema;
  properties: IJoinableEntityProperty[];
}

export interface IJoinableEntityProperty {
  name: string;
  displayName: string;
}

export interface IWidgetDataConfig {
  entity: Enum_Entity;
  schemaName: Enum_Schema;
  joinableEntities?: IJoinableEntity[];
}

export interface IWidgetInteractivityConfig {
  max?: number;
  isPannable?: boolean;
  isZoomable?: boolean;
  isWidgetHidden: boolean;
}

export interface IWidgetFilterConfig {
  customFilters?: Record<string, CustomFilterValueModel[]>;
  baseFilter?: RuleSet;
  propertyFilters?: RuleSet;
  disableTimeFilter?: boolean;
  startTime?: number;
  endTime?: number;
  isDashboardFilterApplied?: boolean;
}

export interface IWidgetDataOutputConfig {
  columnClubInRange?: ColumnClubInRange[];
  // clubbingAggregationType?: Enum_Method_Aggregation;
}

export interface IWidgetFieldNameConfig {
  name: string;
  type: EventPropertyType;
  rule?: Rule;
}

export interface IShowableProperty {
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
export interface IOneDimensionDataInputConfig {
  isDistinct?: boolean;
  method: Enum_Method;
  dataConfig: IWidgetDataConfig[];
  DataOutputConfig?: IWidgetDataOutputConfig;
  fieldNames?: IWidgetFieldNameConfig[];
  fieldsAggregationType?: Enum_Method_Aggregation;
}


export interface ITwoDimensionDataInputConfig extends IOneDimensionDataInputConfig {
  groupBy1?: groupByConf; // Required for 2D widgets
  clubbingTime?: boolean;
}

export interface IThreeDimensionDataInputConfig extends ITwoDimensionDataInputConfig {
  groupBy2?: groupByConf; // Required for 3D widgets
}

export interface INoDimensionDataInputConfig extends IOneDimensionDataInputConfig {

}

// Base widget constructor props
export interface IBaseWidgetConstructorProps {
  id?: string;
  dashboardId?: string;
  dashboard?: dashboard;
  displayConfig: IWidgetDisplayConfig;
  filterConfig?: IWidgetFilterConfig;
  dataOutputConfig?: IWidgetDataOutputConfig;
  widgetInteractivityConfig?: IWidgetInteractivityConfig;
  showableProperties?: IShowableProperty[];
  widgetTileConf: WidgetTileConf;
  isPreview?: boolean | null;
  allowRefresh: boolean;
  refreshInterval: number;
  query?: string;
  widgetSpecificConfig?: string;
}

// Filter output models
export interface ISetIntervalFilterOutputEmittorModel {
  key: string;
  value: number;
}

export interface IDateTimeFilterOutputEmittorModel {
  key: string;
  value: ITimeRange;
}

export interface ICustomFilterOutputEmittorModel {
  key: string;
  value: string[];
}

export interface ICommonFilterOutputEmittorModel {
  [key: string]:
  | ISetIntervalFilterOutputEmittorModel
  | IDateTimeFilterOutputEmittorModel
  | ICustomFilterOutputEmittorModel;
}

// Filter types
export class ICustomFilter {
  [key: string]: CustomFilterValueModel[];
}

export interface ICustomFilterKeyModel {
  displayName: string;
  returnValue: string;
}

export interface ITimeRange {
  startTime: number; // Unix timestamp in milliseconds
  endTime: number; // Unix timestamp in milliseconds
}

