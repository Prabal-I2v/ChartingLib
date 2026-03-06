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
  Frs,
  Shared
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
  OneDimension = 'OneDimension',
  TwoDimension = 'TwoDimension',
  ThreeDimension = 'ThreeDimension',
  Zero = 'Zero',
}

// Map widget types to their dimension
export const widgetTypeDimensionMap: Record<Enum_WidgetType, WidgetDimension> = {
  [Enum_WidgetType.Empty] : WidgetDimension.Zero,
  [Enum_WidgetType.BarChart1D]: WidgetDimension.OneDimension,
  [Enum_WidgetType.BarChart2D]: WidgetDimension.TwoDimension,
  [Enum_WidgetType.ColumnChart1D]: WidgetDimension.OneDimension,
  [Enum_WidgetType.ColumnChart2D]: WidgetDimension.TwoDimension,
  [Enum_WidgetType.PieChart1D]: WidgetDimension.OneDimension,
  [Enum_WidgetType.PieChart2D]: WidgetDimension.TwoDimension,
  [Enum_WidgetType.Donut1D]: WidgetDimension.OneDimension,
  [Enum_WidgetType.Donut2D]: WidgetDimension.TwoDimension,
  [Enum_WidgetType.HeatMapChart1D]: WidgetDimension.OneDimension,
  [Enum_WidgetType.HeatMapChart2D]: WidgetDimension.TwoDimension,
  [Enum_WidgetType.HeatMapChart3D]: WidgetDimension.ThreeDimension,
  [Enum_WidgetType.LineChart1D]: WidgetDimension.OneDimension,
  [Enum_WidgetType.LineChart2D]: WidgetDimension.TwoDimension,
  [Enum_WidgetType.AreaChart1D]: WidgetDimension.OneDimension,
  [Enum_WidgetType.AreaChart2D]: WidgetDimension.TwoDimension,
  [Enum_WidgetType.KPI1D]: WidgetDimension.OneDimension,
  [Enum_WidgetType.KPI2D]: WidgetDimension.TwoDimension,
  [Enum_WidgetType.StackedBarChart]: WidgetDimension.ThreeDimension,
  [Enum_WidgetType.StackedColumnChart]: WidgetDimension.ThreeDimension,
  [Enum_WidgetType.Table]: WidgetDimension.Zero,
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

