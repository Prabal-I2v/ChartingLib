export class WidgetRequestModel {
    id: number;
    startTime: number;
    endTime: number;
    widgetType: Enum_WidgetType;
    entity: Enum_Entity;
    method: Enum_Method;
    schemaName : Enum_Schema
    baseFilter: RuleSet;
    fieldName: { [key: string]: PropertyType };
    groupBy1: string;
    groupByOneIsTime: boolean;
    groupByTwoIsTime: boolean;
    groupBy2: string;
    isDistinct: boolean;
    ClubbingFieldName: string;
    pagination: boolean;
    pageLimit: number;
    pageNumber: number;
    ClubbingTime : boolean;
    identifierFieldName: string;
    multiplicationFactor: number;
    propertyFilters: RuleSet;
    refreshInterval: number;
    isPreview?: boolean | null;
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
    Wrong_Way_Detected
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
    type: PropertyType;
}

export enum PropertyType {
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
