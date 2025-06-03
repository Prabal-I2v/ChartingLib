// widget-base.ts - Contains the base Widget class
import * as moment from "moment";
import { dashboard } from "./DashboardModel";
import { Enum_WidgetType, WidgetDimension } from "./enums/enums";
import { WidgetDisplayConfig, WidgetFilterConfig, ShowableProperty, OneDimensionDataInputConfig, TwoDimensionDataInputConfig, ThreeDimensionDataInputConfig, WidgetInteractivityConfig } from "./interfaces/interfaces";
import { WidgetTileConf, WidgetConstructorProps } from "./types/types";


// Abstract base widget class
export abstract class Widget {
  id: string;
  dashboardId: string | null;
  dashboard: dashboard | null;
  widgetType: Enum_WidgetType;
  widgetTileConf: WidgetTileConf;
  displayConfig: WidgetDisplayConfig;
  filterConfig: WidgetFilterConfig;

  showableProperties: ShowableProperty[];
  isPreview?: boolean | null;
  allowRefresh?: boolean;
  refreshInterval?: number;
  WidgetInteractivityConfig?: WidgetInteractivityConfig;
  query?: string;
  abstract dimension: WidgetDimension;
  abstract dataInputConfig: OneDimensionDataInputConfig | TwoDimensionDataInputConfig | ThreeDimensionDataInputConfig; // Placeholder for data input configuration

  protected static getCurrentDayStart(): number {
    const now = new Date();
    return moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)).valueOf();
  }

  constructor(props: WidgetConstructorProps) {
    // Core initialization
    this.id = props.id ?? '00000000-0000-0000-0000-000000000000';
    this.dashboardId = props.dashboardId ?? null;
    this.dashboard = props.dashboard ?? null;
    this.widgetType = props.widgetType;
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
    this.WidgetInteractivityConfig = props.WidgetInteractivityConfig ?? null;

    // Showable properties
    this.showableProperties = props.showableProperties ?? [];
    
    // Other properties
    this.isPreview = props.isPreview;
    this.allowRefresh = props.allowRefresh ?? false;
    this.refreshInterval = props.refreshInterval ?? 0;
    this.WidgetInteractivityConfig = props.WidgetInteractivityConfig ?? null;
    this.query = props.query ?? null;
  }
}