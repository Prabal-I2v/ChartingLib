import { EventPropertyType } from "Analytic/ClientApp/src/app/Models/eventPropertyType.model";
import { Enum_WidgetType, WidgetDimension, Enum_Method, Enum_Schema, Enum_Entity } from "./enums/enums";
import { IWidgetDisplayConfig, IWidgetInteractivityConfig, IWidgetFilterConfig, IWidgetDataConfig, IShowableProperty } from "./interfaces/interfaces";
import { groupByConf } from "./types/types";

export class WidgetFormDto {
  // Core widget information
  id: string;
  widgetType: Enum_WidgetType;
  dimension: WidgetDimension;
  
  // Display configuration
  displayConfig: IWidgetDisplayConfig;
  
  // Widget tile configuration
  widgetTileConf: {
    w: number;
    h: number;
    x: number;
    y: number;
  };
  
  // Widget interactivity configuration
  widgetInteractivityConfig?: IWidgetInteractivityConfig;
  
  // Filter configuration
  filterConfig: IWidgetFilterConfig;
  
  // Entity & Configuration approach information
  configurationApproach: 'widgetFirst' | 'propertiesFirst';
  entityConfigType: 'single' | 'multiple';
  
  // Data input configuration
  dataInputConfig: {
    // Common properties for all dimensions
    isDistinct: boolean;
    method: Enum_Method;
    dataConfig: IWidgetDataConfig[];
    
    // For single entity (used internally during form state)
    entityTypeSelect?: Enum_Schema;
    entitySelect?: Enum_Entity;
    
    // For multiple entities (used internally during form state)
    entities?: Enum_Entity[];
    
    // TwoDimensional & ThreeDimensional specific properties
    fieldNames?: Record<string, EventPropertyType>;
    groupBy1?: groupByConf;
    clubbingTime?: boolean;
    getColumnNameWithAggregationMethod?: boolean;
    
    // ThreeDimensional specific properties
    groupBy2?: groupByConf;
    
    // For DataOutput configuration (customizing chart appearance)
    dataOutputConfig?: any;
  };
  
  // Showable properties for the widget
  showableProperties: IShowableProperty[];
  
  // Optional properties
  isPreview?: boolean;
  allowRefresh?: boolean;
  refreshInterval?: number;
  query?: string;
}