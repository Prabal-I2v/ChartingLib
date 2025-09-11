// widget-base.ts - Contains the base Widget class
import moment from "moment";
import { dashboard } from "./DashboardModel";
import { Enum_Method, Enum_Method_Aggregation, Enum_WidgetType, WidgetDimension } from "./enums/enums";
import { IWidgetDisplayConfig, IWidgetFilterConfig, IShowableProperty, IOneDimensionDataInputConfig, ITwoDimensionDataInputConfig, IThreeDimensionDataInputConfig, IWidgetInteractivityConfig, IBaseWidgetConstructorProps, IWidgetDataOutputConfig, INoDimensionDataInputConfig } from "./interfaces/interfaces";
import { WidgetTileConf, WidgetConstructorProps } from "./types/types";


// Abstract base widget class
export abstract class Widget {
  id: string;
  dashboardId?: string;
  dashboard?: dashboard;
  widgetType: Enum_WidgetType;
  widgetTileConf: WidgetTileConf;
  displayConfig: IWidgetDisplayConfig;
  filterConfig: IWidgetFilterConfig;

  showableProperties: IShowableProperty[];
  isPreview?: boolean;
  allowRefresh?: boolean;
  refreshInterval?: number;
  widgetInteractivityConfig?: IWidgetInteractivityConfig;
  query?: string;
  widgetSpecificConfig?: string;
  isPredefinedWidget: boolean = false;
  isWidgetPredefinedAndConfigurable?: boolean = false;
  canBeRemoved : boolean = false;
  abstract dimension: WidgetDimension;
  abstract dataInputConfig: IOneDimensionDataInputConfig | ITwoDimensionDataInputConfig | IThreeDimensionDataInputConfig; // Placeholder for data input configuration

  protected static getCurrentDayStart(): number {
    const now = new Date();
    return moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)).valueOf();
  }

  constructor(props: WidgetConstructorProps) {
    // Core initialization
    this.id = props.id
    this.dashboardId = props.dashboardId ?? null;
    this.dashboard = props.dashboard ?? null;
    this.widgetTileConf = props.widgetTileConf;

    // Display configuration
    this.displayConfig = {
      heading: props.displayConfig.heading,
      subHeading: props.displayConfig.subHeading,
      color: props.displayConfig.color ?? '',
      svgIcon: props.displayConfig.svgIcon,
    };

    // Filter configuration with defaults
    this.filterConfig = {
      customFilters: props.filterConfig?.customFilters ?? {},
      baseFilter: props.filterConfig?.baseFilter,
      propertyFilters: props.filterConfig?.propertyFilters,
      disableTimeFilter: props.filterConfig?.disableTimeFilter ?? false,
      startTime: props.filterConfig?.startTime ?? Widget.getCurrentDayStart(),
      endTime: props.filterConfig?.endTime ?? moment(new Date()).valueOf(),
      isDashboardFilterApplied: props.filterConfig?.isDashboardFilterApplied ?? true
    };

    // Widget Interactivity configuration
    this.widgetInteractivityConfig = props.widgetInteractivityConfig ?? null;

    // Showable properties
    this.showableProperties = props.showableProperties ?? [];

    // Other properties
    this.isPreview = props.isPreview;
    this.isPredefinedWidget = props.isPredefinedWidget;
    this.allowRefresh = props.allowRefresh ?? false;
    this.refreshInterval = props.refreshInterval ?? 0;
    this.widgetInteractivityConfig = props.widgetInteractivityConfig ?? null;
    this.query = props.query ?? null;
    this.widgetSpecificConfig = props.widgetSpecificConfig ?? null;
  }
}


// Dimension-specific widget classes
export class OneDimensionWidget extends Widget {
  dimension = WidgetDimension.OneDimensional;
  dataInputConfig: IOneDimensionDataInputConfig;

  constructor(props: OneDimensionWidgetConstructorProps) {
    super(props);
    this.dataInputConfig = {
      isDistinct: props.dataInputConfig?.isDistinct ?? false,
      fieldNames: props.dataInputConfig?.fieldNames ?? [],
      dataConfig: props.dataInputConfig.dataConfig ?? null,
      method: props.dataInputConfig.method ?? Enum_Method.Count,
      DataOutputConfig: props.dataInputConfig?.DataOutputConfig,
      fieldsAggregationType: props.dataInputConfig.fieldsAggregationType ?? Enum_Method_Aggregation.None,
    };
  }
}

export class TwoDimensionWidget extends Widget {
  dimension = WidgetDimension.TwoDimensional;
  dataInputConfig: ITwoDimensionDataInputConfig;

  constructor(props: TwoDimensionWidgetConstructorProps) {
    super(props);
    this.dataInputConfig = {
      isDistinct: props.dataInputConfig?.isDistinct ?? false,
      clubbingTime: props.dataInputConfig?.clubbingTime ?? false,
      fieldNames: props.dataInputConfig?.fieldNames ?? [],
      groupBy1: props.dataInputConfig?.groupBy1 ?? null,
      dataConfig: props.dataInputConfig?.dataConfig ?? [],
      method: props.dataInputConfig?.method ?? Enum_Method.Count,
      DataOutputConfig: props.dataInputConfig?.DataOutputConfig,
      fieldsAggregationType: props.dataInputConfig?.fieldsAggregationType ?? Enum_Method_Aggregation.None
    };
  }
}

export class ThreeDimensionWidget extends Widget {
  dimension = WidgetDimension.ThreeDimensional;
  dataInputConfig: IThreeDimensionDataInputConfig;

  constructor(props: ThreeDimensionWidgetConstructorProps) {
    super(props);
    this.dataInputConfig = {
      isDistinct: props.dataInputConfig?.isDistinct ?? false,
      clubbingTime: props.dataInputConfig?.clubbingTime ?? false,
      fieldNames: props.dataInputConfig?.fieldNames ?? [],
      groupBy1: props.dataInputConfig?.groupBy1 ?? null,
      groupBy2: props.dataInputConfig?.groupBy2 ?? null,
      dataConfig: props.dataInputConfig?.dataConfig ?? [],
      method: props.dataInputConfig?.method ?? Enum_Method.Count,
      DataOutputConfig: props.dataInputConfig?.DataOutputConfig,
      fieldsAggregationType: props.dataInputConfig?.fieldsAggregationType ?? Enum_Method_Aggregation.None
    };
  }
}
export class NoDimensionWidget extends Widget {
  dimension = WidgetDimension.NoDimension;
  dataInputConfig: INoDimensionDataInputConfig;

  constructor(props: NoDimensionWidgetConstructorProps) {
    super(props);
    this.dataInputConfig = {
      isDistinct: props.dataInputConfig?.isDistinct ?? false,
      dataConfig: props.dataInputConfig?.dataConfig ?? null,
      fieldNames: props.dataInputConfig?.fieldNames ?? [],
      DataOutputConfig: props.dataInputConfig?.DataOutputConfig,
      method: props.dataInputConfig?.method ?? Enum_Method.Count,
      fieldsAggregationType: props.dataInputConfig?.fieldsAggregationType ?? Enum_Method_Aggregation.None,
    };
  }
}


// Dimension-specific Widget Constructor Props
export class OneDimensionWidgetConstructorProps implements IBaseWidgetConstructorProps {
  displayConfig: IWidgetDisplayConfig;
  filterConfig?: IWidgetFilterConfig;
  dataOutputConfig?: IWidgetDataOutputConfig;
  widgetInteractivityConfig: IWidgetInteractivityConfig;
  showableProperties: IShowableProperty[];
  widgetTileConf: WidgetTileConf;
  id?: string;
  dashboardId?: string;
  dashboard?: dashboard;
  isPreview?: boolean;
  isPredefinedWidget: boolean;
  canBeRemoved: boolean;
  allowRefresh: boolean;
  refreshInterval: number;
  query?: string;
  dataInputConfig: IOneDimensionDataInputConfig;
  widgetSpecificConfig?: string;
  isWidgetPredefinedAndConfigurable?: boolean;
}

export class TwoDimensionWidgetConstructorProps implements IBaseWidgetConstructorProps {
  displayConfig: IWidgetDisplayConfig;
  filterConfig?: IWidgetFilterConfig;
  dataOutputConfig?: IWidgetDataOutputConfig;
  widgetInteractivityConfig: IWidgetInteractivityConfig;
  showableProperties: IShowableProperty[];
  widgetTileConf: WidgetTileConf;
  id?: string;
  dashboardId?: string;
  dashboard?: dashboard;
  isPreview?: boolean;
  isPredefinedWidget: boolean;
  canBeRemoved: boolean;
  allowRefresh: boolean;
  refreshInterval: number;
  query?: string;
  dataInputConfig: ITwoDimensionDataInputConfig;
  widgetSpecificConfig?: string;
  isWidgetPredefinedAndConfigurable?: boolean;
}

export class ThreeDimensionWidgetConstructorProps implements IBaseWidgetConstructorProps {
  displayConfig: IWidgetDisplayConfig;
  filterConfig?: IWidgetFilterConfig;
  dataOutputConfig?: IWidgetDataOutputConfig;
  widgetInteractivityConfig: IWidgetInteractivityConfig;
  showableProperties: IShowableProperty[];
  widgetTileConf: WidgetTileConf;
  id?: string;
  dashboardId?: string;
  dashboard?: dashboard;
  isPreview?: boolean;
  isPredefinedWidget: boolean;
  canBeRemoved: boolean;
  allowRefresh: boolean;
  refreshInterval: number;
  query?: string;
  dataInputConfig: IThreeDimensionDataInputConfig;
  widgetSpecificConfig?: string;
  isWidgetPredefinedAndConfigurable?: boolean;
}
export class NoDimensionWidgetConstructorProps implements IBaseWidgetConstructorProps {
  displayConfig: IWidgetDisplayConfig;
  filterConfig?: IWidgetFilterConfig;
  dataOutputConfig?: IWidgetDataOutputConfig;
  widgetInteractivityConfig: IWidgetInteractivityConfig;
  showableProperties: IShowableProperty[];
  widgetTileConf: WidgetTileConf;
  id?: string;
  dashboardId?: string;
  dashboard?: dashboard;
  isPreview?: boolean;
  isPredefinedWidget: boolean;
  canBeRemoved: boolean;
  allowRefresh: boolean;
  refreshInterval: number;
  query?: string;
  dataInputConfig: INoDimensionDataInputConfig;
  widgetSpecificConfig?: string;
  isWidgetPredefinedAndConfigurable?: boolean;
}
