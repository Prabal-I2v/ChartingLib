// enums.ts - Contains all enum definitions

export enum Enum_Method_Aggregation {
  None,
  Total,
  Greatest,
  Least
}

export const Enum_Method_Aggregation_With_Labels : Record<Enum_Method_Aggregation, string> = {
  [Enum_Method_Aggregation.None] : "None",
  [Enum_Method_Aggregation.Total] : "Total",
  [Enum_Method_Aggregation.Greatest] : "Greatest",
  [Enum_Method_Aggregation.Least] : "Least"
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


export const Enum_Entity_With_Labels: Record<Enum_Entity, string> = {
  [Enum_Entity.VideoSources]: 'VideoSources',
  [Enum_Entity.Persons]: 'Persons',
  [Enum_Entity.FacePoint]: 'FacePoint',
  [Enum_Entity.Highway_ATCC]: 'Highway_ATCC',
  [Enum_Entity.VIDS]: 'VIDS',
  [Enum_Entity.Vehicle_Stopped]: 'Vehicle_Stopped',
  [Enum_Entity.ANPR]: 'ANPR',
  [Enum_Entity.Wrong_Way_Detected]: 'Wrong_Way_Detected',
  [Enum_Entity.Human_Crossing_Road]: 'Human_Crossing_Road',
  [Enum_Entity.Reverse_Traffic_Detected]: 'Reverse_Traffic_Detected',
  [Enum_Entity.Lane_Changed]: 'Lane_Changed',
  [Enum_Entity.Illegal_Vehicle]: 'Illegal_Vehicle',
  [Enum_Entity.Safe_Distance_Violated]: 'Safe_Distance_Violated',
  [Enum_Entity.Intrusion_Detected]: 'Intrusion_Detected',
  [Enum_Entity.Human_Detected]: 'Human_Detected',
  [Enum_Entity.Deacceleration_Detected]: 'Deacceleration_Detected',
  [Enum_Entity.Vehicle_Accelerated]: 'Vehicle_Accelerated',
  [Enum_Entity.Vehicle_Occupancy]: 'Vehicle_Occupancy',
  [Enum_Entity.Fire_Detected]: 'Fire_Detected',
  [Enum_Entity.Smoke_Detected]: 'Smoke_Detected',
  [Enum_Entity.Abandoned_Object_Detected]: 'Abandoned_Object_Detected',
  [Enum_Entity.Face_Recognition]: 'Face_Recognition',
  [Enum_Entity.Server_Status]: 'Server_Status',
  [Enum_Entity.Pipeline_State]: 'Pipeline_State',
  [Enum_Entity.DEVICE_CONNECTED]: 'DEVICE_CONNECTED',
  [Enum_Entity.DEVICE_DISCONNECTED]: 'DEVICE_DISCONNECTED'
};


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
  Empty,
  AreaChart1D,
  AreaChart2D,
  BarChart1D,
  BarChart2D,
  ColumnChart1D,
  ColumnChart2D,
  HeatMapChart1D,
  HeatMapChart2D,
  HeatMapChart3D,
  LineChart1D,
  LineChart2D,
  PieChart1D,
  PieChart2D,
  Donut1D,
  Donut2D,
  StackedBarChart,
  StackedColumnChart,
  KPI1D,
  KPI2D,
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
  [Enum_WidgetType.Empty] : WidgetDimension.NoDimension,
  [Enum_WidgetType.BarChart1D]: WidgetDimension.OneDimensional,
  [Enum_WidgetType.BarChart2D]: WidgetDimension.TwoDimensional,
  [Enum_WidgetType.ColumnChart1D]: WidgetDimension.OneDimensional,
  [Enum_WidgetType.ColumnChart2D]: WidgetDimension.TwoDimensional,
  [Enum_WidgetType.PieChart1D]: WidgetDimension.OneDimensional,
  [Enum_WidgetType.PieChart2D]: WidgetDimension.TwoDimensional,
  [Enum_WidgetType.Donut1D]: WidgetDimension.OneDimensional,
  [Enum_WidgetType.Donut2D]: WidgetDimension.TwoDimensional,
  [Enum_WidgetType.HeatMapChart1D]: WidgetDimension.OneDimensional,
  [Enum_WidgetType.HeatMapChart2D]: WidgetDimension.TwoDimensional,
  [Enum_WidgetType.HeatMapChart3D]: WidgetDimension.ThreeDimensional,
  [Enum_WidgetType.LineChart1D]: WidgetDimension.OneDimensional,
  [Enum_WidgetType.LineChart2D]: WidgetDimension.TwoDimensional,
  [Enum_WidgetType.AreaChart1D]: WidgetDimension.OneDimensional,
  [Enum_WidgetType.AreaChart2D]: WidgetDimension.TwoDimensional,
  [Enum_WidgetType.KPI1D]: WidgetDimension.OneDimensional,
  [Enum_WidgetType.KPI2D]: WidgetDimension.TwoDimensional,
  [Enum_WidgetType.StackedBarChart]: WidgetDimension.ThreeDimensional,
  [Enum_WidgetType.StackedColumnChart]: WidgetDimension.ThreeDimensional,
  [Enum_WidgetType.Table]: WidgetDimension.NoDimension,
};

// Lists for dropdowns
export const allWidgetTypes = [
  { value: Enum_WidgetType.KPI1D, label: 'KPI Card (1D)' },
  { value: Enum_WidgetType.KPI2D, label: 'KPI Card (2D)' },
  { value: Enum_WidgetType.BarChart1D, label: 'Bar Chart (1D)' },
  { value: Enum_WidgetType.BarChart2D, label: 'Bar Chart (2D)' },
  { value: Enum_WidgetType.ColumnChart1D, label: 'Column Chart (1D)' },
  { value: Enum_WidgetType.ColumnChart2D, label: 'Column Chart (2D)' },
  { value: Enum_WidgetType.LineChart1D, label: 'Line Chart (1D)' },
  { value: Enum_WidgetType.LineChart2D, label: 'Line Chart (2D)' },
  { value: Enum_WidgetType.AreaChart1D, label: 'Area Chart (1D)' },
  { value: Enum_WidgetType.AreaChart2D, label: 'Area Chart (2D)' },
  { value: Enum_WidgetType.PieChart1D, label: 'Pie Chart (1D)' },
  { value: Enum_WidgetType.PieChart2D, label: 'Pie Chart (2D)' },
  { value: Enum_WidgetType.Donut1D, label: 'Donut Chart (1D)' },
  { value: Enum_WidgetType.Donut2D, label: 'Donut Chart (2D)' },
  { value: Enum_WidgetType.StackedBarChart, label: 'Stacked Bar Chart' },
  { value: Enum_WidgetType.StackedColumnChart, label: 'Stacked Column Chart' },
  { value: Enum_WidgetType.HeatMapChart1D, label: 'Heat Map Chart (1D)' },
  { value: Enum_WidgetType.HeatMapChart2D, label: 'Heat Map Chart (2D)' },
  { value: Enum_WidgetType.HeatMapChart3D, label: 'Heat Map Chart (3D)' },
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

