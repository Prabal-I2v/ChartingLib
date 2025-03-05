import { EventPropertyType } from "src/app/Models/eventPropertyType.model";
import { dashboard } from "./DashboardModel";
import * as moment from "moment";

declare let $: any;

export interface WidgetConstructorProps {
  // Required properties
  heading: string;
  widgetType: Enum_WidgetType;
  entity: Enum_Entity;
  method: Enum_Method;
  schemaName: Enum_Schema;
  
  // Optional properties
  id?: string;
  dashboardId?: string;
  dashboard?: dashboard;
  color?: string;
  analyticManagerId?: string;
  subHeading?: string;
  isPannable?: boolean;
  isZoomable?: boolean;
  max?: number;
  customFilters?: Record<string, CustomFilterValueModel[]>;
  disableTimeFilter?: boolean;
  startTime?: number;
  endTime?: number;
  joinableEntities?: JoinableEntity[];
  baseFilter?: RuleSet;
  getColumnNameWithAggregationMethod?: boolean;
  fieldName?: Record<string, EventPropertyType>;
  groupBy1?: string | Enum_TimePeriod;
  groupBy2?: string;
  groupByOneIsTime?: boolean;
  groupByTwoIsTime?: boolean;
  showableProperties?: string[];
  showablePropertiesLabel?: string[];
  clubbingTime?: boolean;
  clubbingFieldName?: Enum_Method_Aggregation;
  isDistinct?: boolean;
  isMultiValuedColumn?: boolean;
  isSelfCount?: boolean;
  allowRefresh?: boolean;
  refreshInterval?: number;
  propertyFilters?: RuleSet;
  pagination?: boolean;
  pageLimit?: number;
  pageNumber?: number;
  identifierFieldName?: string;
  multiplicationFactor?: number;
  isPreview?: boolean | null;
  svgIcon?: string;
  findResultSvgIcon?: boolean;
}

export abstract class Widget {
  // Required properties
  heading: string;
  widgetType: Enum_WidgetType;
  entity: Enum_Entity;
  method: Enum_Method;
  schemaName: Enum_Schema;

  // Optional properties with defaults
  id: string | null;
  dashboardId: string | null;
  dashboard: dashboard | null;
  color: string;
  analyticManagerId?: string;
  subHeading?: string;
  isPannable: boolean;
  isZoomable: boolean;
  max: number;
  customFilters: Record<string, CustomFilterValueModel[]>;
  disableTimeFilter: boolean;
  startTime: number;
  endTime: number;
  //It is use to join entities of two different tables
  joinableEntities: JoinableEntity[];
  //filter used in base query (basically with time part)
  baseFilter?: RuleSet;
  //It is used if we want column value along with aggregation method like bus, car, truck also apart from Greatest(Bus+ car+truck) ...
  getColumnNameAlsoWithAggregationMethod: boolean;
  fieldName: Record<string, EventPropertyType>;
  groupBy1: string | Enum_TimePeriod;
  groupBy2: string;
  groupByOneIsTime: boolean;
  groupByTwoIsTime: boolean;
  showableProperties: string[];
  showablePropertiesLabel: string[];
  clubbingTime: boolean;
  clubbingFieldName?: Enum_Method_Aggregation;
  isDistinct: boolean;
  isMultiValuedColumn: boolean;
  isSelfCount: boolean;
  allowRefresh: boolean;
  refreshInterval: number;
  propertyFilters?: RuleSet;
  pagination?: boolean;
  pageLimit?: number;
  pageNumber?: number;
  identifierFieldName?: string;
  multiplicationFactor?: number;
  isPreview?: boolean | null;
  svgIcon?: string;
  findResultSvgIcon: boolean;

  private static getCurrentDayStart(): number {
    const now = new Date();
    return moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)).valueOf();
  }

  constructor(props: WidgetConstructorProps) {
    // Required properties
    this.heading = props.heading;
    this.widgetType = props.widgetType;
    this.entity = props.entity;
    this.method = props.method;
    this.schemaName = props.schemaName;

    // Optional properties with defaults
    this.id = props.id ?? '00000000-0000-0000-0000-000000000000';
    this.dashboardId = props.dashboardId ?? null;
    this.dashboard = props.dashboard ?? null;
    this.color = props.color ?? '';
    this.analyticManagerId = props.analyticManagerId;
    this.subHeading = props.subHeading;
    this.isPannable = props.isPannable ?? false;
    this.isZoomable = props.isZoomable ?? false;
    this.max = props.max ?? 10;
    this.customFilters = props.customFilters ?? {};
    this.disableTimeFilter = props.disableTimeFilter ?? true;
    this.startTime = props.startTime ?? Widget.getCurrentDayStart();
    this.endTime = props.endTime ?? moment(new Date()).valueOf();
    this.joinableEntities = props.joinableEntities ?? [];
    this.baseFilter = props.baseFilter;
    this.getColumnNameAlsoWithAggregationMethod = props.getColumnNameWithAggregationMethod ?? false;
    this.fieldName = props.fieldName ?? {};
    this.groupBy1 = props.groupBy1 ?? '';
    this.groupBy2 = props.groupBy2 ?? '';
    this.groupByOneIsTime = props.groupByOneIsTime ?? false;
    this.groupByTwoIsTime = props.groupByTwoIsTime ?? false;
    this.showableProperties = props.showableProperties ?? [];
    this.showablePropertiesLabel = props.showablePropertiesLabel ?? [];
    this.clubbingTime = props.clubbingTime ?? false;
    this.clubbingFieldName = props.clubbingFieldName;
    this.isDistinct = props.isDistinct ?? false;
    this.isMultiValuedColumn = props.isMultiValuedColumn ?? false;
    this.isSelfCount = props.isSelfCount ?? false;
    this.allowRefresh = props.allowRefresh ?? false;
    this.refreshInterval = props.refreshInterval ?? 240;
    this.propertyFilters = props.propertyFilters;
    this.pagination = props.pagination;
    this.pageLimit = props.pageLimit;
    this.pageNumber = props.pageNumber;
    this.identifierFieldName = props.identifierFieldName;
    this.multiplicationFactor = props.multiplicationFactor;
    this.isPreview = props.isPreview;
    this.svgIcon = props.svgIcon;
    this.findResultSvgIcon = props.findResultSvgIcon ?? false;
  }
}

export enum Enum_Method_Aggregation {
  Total,
  Greatest,
  Lowest,
}

export enum Enum_Entity {
  Events,
  VideoSources,
  Persons,
  EnrolledPersonsEvent,
  Facepoint,
  Highway_ATCC,
  VIDS,
  Vehicle_Stopped,
  ANPR,
  Wrong_Way_Detected,
  Human_Crossing_Road,
  Reverse_Traffic_Detected,
  Lane_Changed,
  Illegal_Vehicle,
  Safe_Distance_Violated,
  Intrusion_Detected,
  Human_Detected,
  Deacceleration_Detected,
  Vehicle_Accelerated,
  Vehicle_Occupancy,
  Fire_Detected,
  Smoke_Detected,
  Abandoned_Object_Detected,
  Face_Recognition
}

export enum Enum_Method {
  Count,
  Sum,
  Average,
  LiveCount,
}

export enum Enum_Schema {
  Public,
  Events,
}

export enum Enum_TimePeriod {
  hour = "hour",
  day = "day",
  month = "month",
  year = "year",
  week = "week",
}

export enum Enum_WidgetType {
  AreaChart,
  BarChart,
  ColumnChart,
  HeatMapChart,
  LineChart,
  PieChart,
  StackedBarChart,
  StackedColumnChart,
  KPI,
  Table,
}

export class ICustomFilter {
  [key: string]: CustomFilterValueModel[];
}

export interface ICustomFilterKeyModel {
  displayName: string;
  returnValue: string;
}

export class CustomFilterValueModel {
  displayName: string;
  returnValue: string | ITimeRange | number;
}

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

export interface ITimeRange {
  startTime: number; // Unix timestamp in milliseconds
  endTime: number; // Unix timestamp in milliseconds
}

export class RuleSet {
  constructor() {}
  condition: string = "";
  rules: Array<Rule> = new Array<Rule>();
  ruleSet: Array<RuleSet> = new Array<RuleSet>();
}

export class Rule {
  field: string;
  operator: string;
  value: string;
  type: EventPropertyType;
}

export class JoinableEntity {
  entity: Enum_Entity;
  joinOn: string;
  joinWith: string;
  schema: Enum_Schema;
  properties: JoinableEntityProperty[];
}

export class JoinableEntityProperty {
  name: string;
  DisplayName: string;
}
