import { dashboard } from "./DashboardModel";

export class Widget{
    id: string;
    analyticManagerId?: string;
    dashboardId: string;
    dashboard: dashboard;
    heading : string;
    subHeading? : string;
    isPannable : boolean;
    isZoomable : boolean;
    max : number = 10;
    customFilters? : { [key: string]: string[] };
    disableTimeFilter : boolean = true;
    startTime: number;
    endTime: number;
    widgetType: Enum_WidgetType;
    entity: Enum_Entity;
    joinableEntities : JoinableEntity[] = []
    method: Enum_Method;
    schemaName : Enum_Schema
    baseFilter?: RuleSet;
    getColumnNameWithAggregationMethod : boolean = false;
    fieldName: { [key: string]: RulePropertyType };
    groupBy1: string;
    groupBy2: string;
    groupByOneIsTime: boolean;
    groupByTwoIsTime: boolean;
    showableProperties : string[] = []
    showablePropertiesLabel : string[] = []
    ClubbingTime : boolean = false;
    ClubbingFieldName?: Enum_Method_Aggregation;
    isDistinct: boolean = false;
    isMultiValuedColumn : Boolean = false
    isSelfCount : Boolean = false
    allowRefresh: boolean = false;
    refreshInterval: number = 300;
    propertyFilters?: RuleSet;
    pagination?: boolean;
    pageLimit?: number;
    pageNumber?: number;
    identifierFieldName?: string;
    multiplicationFactor?: number;
    isPreview?: boolean | null;
}

    
export enum Enum_Method_Aggregation{
    Total,
    Greatest,
    Lowest
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
    Human_Crossing_Road
}

export enum Enum_Method {
    Count,
    Sum,
    Average,
    LiveCount
}

export enum Enum_Schema
{
    Public,
    Events
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
    Table
}

export class ICustomFilter {
    [key: string]: string[];
  }

export interface TimeRange {
    startTime: number; // Unix timestamp in milliseconds
    endTime: number; // Unix timestamp in milliseconds
  }

export class RuleSet {
    constructor() {
    }
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

export class JoinableEntity
{
     entity : Enum_Entity
     joinOn : string
     joinWith : string
     schema : Enum_Schema
     properties : JoinableEntityProperty[]
}

export class JoinableEntityProperty{
    name : string
    DisplayName : string
}