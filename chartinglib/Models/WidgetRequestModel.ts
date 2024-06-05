import { Signal } from "@angular/core";
import { dashboard } from "./DashboardModel";
import * as moment from "moment";

declare var $: any;
export class Widget {
  id: string;
  color: string;
  analyticManagerId?: string;
  dashboardId: string;
  dashboard: dashboard;
  heading: string;
  subHeading?: string;
  isPannable: boolean = false;
  isZoomable: boolean = false;
  max: number = 10;
  customFilters: { [key: string]: CustomFilterValueModel[] } = {};
  disableTimeFilter: boolean = true;
  startTime: number = moment(
    new Date(
      new Date($.now()).getFullYear(),
      new Date($.now()).getMonth(),
      new Date($.now()).getDate(),
      0,
      0,
      0,
    ),
  ).valueOf();
  endTime: number = moment(new Date($.now())).valueOf();
  widgetType: Enum_WidgetType;
  entity: Enum_Entity;
  joinableEntities: JoinableEntity[] = [];
  method: Enum_Method;
  schemaName: Enum_Schema;
  baseFilter?: RuleSet;
  getColumnNameWithAggregationMethod: boolean = false;
  fieldName: { [key: string]: RulePropertyType } = {};
  groupBy1: string | Enum_TimePeriod = "";
  groupBy2: string = "";
  groupByOneIsTime: boolean = false;
  groupByTwoIsTime: boolean = false;
  showableProperties: string[] = [];
  showablePropertiesLabel: string[] = [];
  ClubbingTime: boolean = false;
  ClubbingFieldName?: Enum_Method_Aggregation;
  isDistinct: boolean = false;
  isMultiValuedColumn: Boolean = false;
  isSelfCount: Boolean = false;
  allowRefresh: boolean = false;
  refreshInterval: number = 240;
  propertyFilters?: RuleSet;
  pagination?: boolean;
  pageLimit?: number;
  pageNumber?: number;
  identifierFieldName?: string;
  multiplicationFactor?: number;
  isPreview?: boolean | null;
  svgIcon?: string;
  FindResultSvgIcon?: boolean;
}

export enum Enum_Method_Aggregation {
  Total,
  Greatest,
  Lowest,
}

export enum Enum_Entity {
  Events,
  VideoSources,
  Person,
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
  date = "date",
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
  type: RulePropertyType;
}

export enum RulePropertyType {
  String,
  Number,
  SingleSelect,
  MultipleSelect,
  ImagePath,
  Boolean,
  NumberArray,
  StringArray,
  Base64Image,
  Integer,
  Float,
  IpAddress,
  DateTime,
  Image,
  Date,
  TimeOfDay,
  DayOfWeek,
  UNIXDateTime,
  FilePath,
  Array,
  Custom,
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
