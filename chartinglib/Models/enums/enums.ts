// enums.ts - Contains all enum definitions

export enum Enum_Method_Aggregation {
  Total,
  Greatest,
  Lowest
}

export enum Enum_Entity {
  VideoSources,
  Persons,
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


export enum Enum_Entity_With_Labels {
  VideoSources = "VideoSources",
  Persons = "Persons",
  FacePoint = "FacePoint",
  Highway_ATCC = "Highway_ATCC",
  VIDS = "VIDS",
  Vehicle_Stopped = "Vehicle_Stopped",
  ANPR = "ANPR",
  Wrong_Way_Detected = "Wrong_Way_Detected",
  Human_Crossing_Road = "Human_Crossing_Road",
  Reverse_Traffic_Detected = "Reverse_Traffic_Detected",
  Lane_Changed = "Lane_Changed",
  Illegal_Vehicle = "Illegal_Vehicle",
  Safe_Distance_Violated = "Safe_Distance_Violated",
  Intrusion_Detected = "Intrusion_Detected",
  Human_Detected = "Human_Detected",
  Deacceleration_Detected = "Deacceleration_Detected",
  Vehicle_Accelerated = "Vehicle_Accelerated",
  Vehicle_Occupancy = "Vehicle_Occupancy",
  Fire_Detected = "Fire_Detected",
  Smoke_Detected = "Smoke_Detected",
  Abandoned_Object_Detected = "Abandoned_Object_Detected",
  Face_Recognition = "Face_Recognition",
  Server_Status = "Server_Status",
  Pipeline_State = "Pipeline_State",
  DEVICE_CONNECTED = "DEVICE_CONNECTED",
  DEVICE_DISCONNECTED = "DEVICE_DISCONNECTED",
}

export enum Enum_Method {
  Count,
  Sum,
  Average,
  LiveCount,
  NoAggregation,
  Max,
  Min,
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

// Dimension-based Widget Types
export enum WidgetDimension {
  OneDimensional,
  TwoDimensional,
  ThreeDimensional,
  NoDimension,
}

// Map widget types to their dimension
export const widgetTypeDimensionMap: Record<Enum_WidgetType, WidgetDimension> = {
  [Enum_WidgetType.KPI]: WidgetDimension.TwoDimensional,
  [Enum_WidgetType.BarChart]: WidgetDimension.TwoDimensional,
  [Enum_WidgetType.ColumnChart]: WidgetDimension.TwoDimensional,
  [Enum_WidgetType.PieChart]: WidgetDimension.TwoDimensional,
  [Enum_WidgetType.Donut]: WidgetDimension.TwoDimensional,
  [Enum_WidgetType.LineChart]: WidgetDimension.TwoDimensional,
  [Enum_WidgetType.AreaChart]: WidgetDimension.TwoDimensional,
  [Enum_WidgetType.StackedBarChart]: WidgetDimension.ThreeDimensional,
  [Enum_WidgetType.StackedColumnChart]: WidgetDimension.ThreeDimensional,
  [Enum_WidgetType.HeatMapChart]: WidgetDimension.ThreeDimensional,
  [Enum_WidgetType.Table]: WidgetDimension.NoDimension,
};

  // Lists for dropdowns
export const allWidgetTypes = [
    { value: Enum_WidgetType.KPI, label: 'KPI Card' },
    { value: Enum_WidgetType.BarChart, label: 'Bar Chart' },
    { value: Enum_WidgetType.ColumnChart, label: 'Column Chart' },
    { value: Enum_WidgetType.LineChart, label: 'Line Chart' },
    { value: Enum_WidgetType.AreaChart, label: 'Area Chart' },
    { value: Enum_WidgetType.PieChart, label: 'Pie Chart' },
    { value: Enum_WidgetType.Donut, label: 'Donut Chart' },
    { value: Enum_WidgetType.StackedBarChart, label: 'Stacked Bar Chart' },
    { value: Enum_WidgetType.StackedColumnChart, label: 'Stacked Column Chart' },
    { value: Enum_WidgetType.HeatMapChart, label: 'Heat Map Chart' },
    { value: Enum_WidgetType.Table, label: 'Table' },

  ];

// Reuse original function for internal filtering
export function getWidgetTypesByDimension(dimension: WidgetDimension): Enum_WidgetType[] {
  return Object.entries(widgetTypeDimensionMap)
    .filter(([, dim]) => dim === dimension)
    .map(([type]) => Number(type) as Enum_WidgetType);
}

  // Utility to get dropdown items by dimension
  export function getWidgetDropdownItemsByDimension(dimension: WidgetDimension) {
    const types = getWidgetTypesByDimension(dimension);
    return allWidgetTypes.filter(item => types.includes(item.value));
  }
  
