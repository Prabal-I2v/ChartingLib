import { EventPropertyType } from "src/app/Models/eventPropertyType.model";
import { dashboard } from "./DashboardModel";
import { GridStackOptions, GridStackWidget } from "gridstack";
import  moment from "moment";

declare let $: any;

export class WidgetConstructorProps {
  // Heading of widget
  heading: string;
  //Select type of widget
  widgetType: Enum_WidgetType;
  //It is used for selecting table for data to work on
  entity: Enum_Entity;
  //It is used for selecting which type of aggregation you want to apply like Count, Sum, Live Count
  method: Enum_Method;

  //It is used for selecting schema method
  schemaName: Enum_Schema;

  // Optional properties
  id?: string;
  dashboardId?: string;
  dashboard?: dashboard;
  color?: string;
  analyticManagerId?: string;
  // Sub Heading of widget
  subHeading?: string;
  //To make widget scrollable (it work accordindly to type of widget i.e horizontal for column chart)
  isPannable?: boolean;
  //To make widget zoomable
  isZoomable?: boolean;
  //max no. of  entries to be show at initial screen (mainly used for chart which can have long length like column, bar, stacked bar, etc)
  max?: number;
  //It is used for filters for widget, like properties filters basically for ui filters currently used for video sources
  customFilters?: Record<string, CustomFilterValueModel[]>;
  // It is used to disable time filter in widget
  disableTimeFilter?: boolean;
  //It is used for starting time for data
  startTime?: number;
  //It is used for ending time for data
  endTime?: number;
  //It is used for joining two table on basis on column and selecting column name and their display name
  joinableEntities?: JoinableEntity[];
  //It is used for applying base filter like time, it works same as custom filter but it need to be set from code not from ui (base filter is the event of which we want event like FRS, ANPR, ATCC, it is basically used when we have multiple analytic data in same table)
  baseFilter?: RuleSet;
  //Its is used for projection column name along with aggregation like sum(col1+ col2+ col3...) but we also want col1, col2, col3... to be projected in data
  getColumnNameWithAggregationMethod?: boolean;

  // It is used to define columns which will be useed for aggregation purposes
  clubbingFieldNames?: Record<string, EventPropertyType>;
  groupBy1?: groupByConf | null;
  groupBy2?: groupByConf | null;
  //It is used which column will be included in Charting Data Result
  showableProperties?: showablePropertyModel[];
  //It is used for showing label in chart like bar, column, stacked Charts eg. months need to be showed in y-axis

  showablePropertiesLabel?: showablePropertyLabelModel[];
  //It is used for club time like club month for multiple years
  clubbingTime?: boolean;

  //It only includes column to be club if any field name is passed,
  // else it is used for get aggreagtion on client side based on value of isAnyMultiValuedColumn
  ClubbingAggregationType?: Enum_Method_Aggregation;

  //Make it true if you want distinct data only
  isDistinct?: boolean;
  isSelfCount?: boolean;
  //To allow widget to self call for data
  allowRefresh?: boolean;
  //Time interval when you want to call for data
  refreshInterval?: number;
  //It is used for applying _PropertyFilters filter (basically for filter you want to apply for properties)
  propertyFilters?: RuleSet;
  //not used currently
  pagination?: boolean;
  //not used currently
  pageLimit?: number;
  //not used currently
  pageNumber?: number;
  //not used currently
  identifierFieldName?: string;
  //not used currently
  multiplicationFactor?: number;
  //not used currently
  isPreview?: boolean | null;
  //used to show svg based for a particulat widget near heading (currently can be set from Widget model or also from kpi logic)
  svgIcon?: string;
  //used to show svg based on the basis of result like emotion (angry, happy, sad ...)
  findResultSvgIcon?: boolean;
  //used for position of widget
  widgetTileConf: WidgetTileConf;
  //used to check which filter precedence will be followed, dashboard or widget filter
  isDashboardFilterApplied?: boolean;

  ColumnClubInRange?: ColumnClubInRange[]
  //used to hide and unhide widget
  isWidgetHidden?: boolean;

  query? : string;
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
  joinableEntities: JoinableEntity[];
  baseFilter?: RuleSet;
  getColumnNameAlsoWithAggregationMethod: boolean;
  clubbingFieldNames: Record<string, EventPropertyType>;
  groupBy1: groupByConf | null;
  groupBy2: groupByConf | null;
  showableProperties: showablePropertyModel[];
  showablePropertiesLabel: showablePropertyLabelModel[];
  clubbingTime: boolean;
  clubbingAggregationType?: Enum_Method_Aggregation;
  isDistinct: boolean;
  isSelfCount: boolean;
  allowRefresh: boolean
  refreshInterval: number;
  propertyFilters?: RuleSet;
  pagination?: boolean;
  pageLimit?: number;
  pageNumber?: number;
  identifierFieldName?: string;
  multiplicationFactor?: number;
  isPreview?: boolean | null;
  svgIcon?: string;
  findResultSvgIcon?: boolean;
  widgetTileConf: WidgetTileConf;
  isDashboardFilterApplied?: boolean;
  ColumnClubInRange?: ColumnClubInRange[]
  isWidgetHidden:boolean;
  query? : string;

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
    this.widgetTileConf = props.widgetTileConf;

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
    this.disableTimeFilter = props.disableTimeFilter ?? false;
    this.startTime = props.startTime ?? Widget.getCurrentDayStart();
    this.endTime = props.endTime ?? moment(new Date()).valueOf();
    this.joinableEntities = props.joinableEntities ?? [];
    this.baseFilter = props.baseFilter;
    this.getColumnNameAlsoWithAggregationMethod = props.getColumnNameWithAggregationMethod ?? false;
    this.clubbingFieldNames = props.clubbingFieldNames ?? {};
    this.groupBy1 = props.groupBy1 ?? null;
    this.groupBy2 = props.groupBy2 ?? null;
    this.showableProperties = props.showableProperties ?? [];
    this.showablePropertiesLabel = props.showablePropertiesLabel ?? [];
    this.clubbingTime = props.clubbingTime ?? false;
    this.clubbingAggregationType = props.ClubbingAggregationType;
    this.isDistinct = props.isDistinct ?? false;
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
    this.isDashboardFilterApplied = props.isDashboardFilterApplied ?? true;
    this.ColumnClubInRange = props.ColumnClubInRange ?? null
    this.isWidgetHidden = props.isWidgetHidden ?? false;
    this.query = props.query ?? null
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
  FacePoint,
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
  Face_Recognition,
  Server_Status,
  Pipeline_State,
  DEVICE_CONNECTED,
  DEVICE_DISCONNECTED
}

export enum Enum_Method {
  Count,
  Sum,
  Average,
  LiveCount,
  NoAggregation
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
  Donut,
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
  returnValue: string | ITimeRange | number | boolean;
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
  constructor() { }
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
  displayName: string;
}

export class showablePropertyModel {
  name: string;
  displayName: string;
  multiValued?: multivaluedColumn;
}

export class multivaluedColumn {

  //column should present in showPropertiesLabel and name should match DisplayName
  dependentOnColumn?: string;

  //column should present in showPropertiesLabel
  valueBasedOnColumn: string
}

export class showablePropertyLabelModel {
  name: string
  displayName: string
  isMultiValued?: Boolean = false;
}

export class groupByConf {
  mainColumn: string;
  type: EventPropertyType;
  subColumn?: string;
  projectionName?: string;
  isTime?: boolean = false;
}

export class WidgetTileConf implements GridStackWidget {
   /** widget position x (default?: 0) */
   x?: number;
   /** widget position y (default?: 0) */
   y?: number;
   /** widget dimension width (default?: 1) */
   w?: number;
   /** widget dimension height (default?: 1) */
   h?: number;
   initialMinH? : number;
   initialMaxH? : number;
   initialMinW? : number;
   initialMaxW? : number;
  /** if true then x, y parameters will be ignored and widget will be places on the first available position (default?: false) */
  autoPosition?: boolean;
  /** minimum width allowed during resize/creation (default?: undefined = un-constrained) */
  minW?: number;
  /** maximum width allowed during resize/creation (default?: undefined = un-constrained) */
  maxW?: number;
  /** minimum height allowed during resize/creation (default?: undefined = un-constrained) */
  minH?: number;
  /** maximum height allowed during resize/creation (default?: undefined = un-constrained) */
  maxH?: number;
  /** prevent direct resizing by the user (default?: undefined = un-constrained) */
  noResize?: boolean;
  /** prevents direct moving by the user (default?: undefined = un-constrained) */
  noMove?: boolean;
  /** same as noMove+noResize but also prevents being pushed by other widgets or api (default?: undefined = un-constrained) */
  locked?: boolean;
  /** value for `gs-id` stored on the widget (default?: undefined) */
  id?: string;
  /** html to append inside as content */
  content?: string;
  /** true when widgets are only created when they scroll into view (visible) */
  lazyLoad?: boolean;
  /** local (vs grid) override - see GridStackOptions.
   * Note: This also allow you to set a maximum h value (but user changeable during normal resizing) to prevent unlimited content from taking too much space (get scrollbar) */
  sizeToContent?: boolean | number;
  /** local override of GridStack.resizeToContentParent that specify the class to use for the parent (actual) vs child (wanted) height */
  resizeToContentParent?: string;
  /** optional nested grid options and list of children, which then turns into actual instance at runtime to get options from */
  subGridOpts?: GridStackOptions;
}

export class ColumnClubInRange {
  columnNameForRange: string;
  range: ColumnRange[]
}

export class ColumnRange {
  rangeName: string;
  condition: ColumnRangeCondition
}

export class ColumnRangeCondition {
  greaterThan: string;
  lessThan: string;
  type: EventPropertyType;
}
