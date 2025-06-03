// dimension-widgets.ts - Contains dimension-specific widget classes
import { WidgetDimension, Enum_Method, Enum_WidgetType } from "./enums/enums";
import { OneDimensionDataInputConfig, TwoDimensionDataInputConfig, ThreeDimensionDataInputConfig, BaseWidgetConstructorProps, NoDimensionDataInputConfig } from "./interfaces/interfaces";
import { Widget } from "./Widget";


// Dimension-specific widget classes
export class OneDimensionWidget extends Widget {
  dimension = WidgetDimension.OneDimensional;
  dataInputConfig: OneDimensionDataInputConfig;

  constructor(props: OneDimensionWidgetConstructorProps) {
    super(props);
    
    this.dataInputConfig = {
      isDistinct: props.dataInputConfig?.isDistinct ?? false,
      dataConfig: props.dataInputConfig?.dataConfig ?? null,
      method: props.dataInputConfig?.method ?? Enum_Method.Count
    };
  }
}

export class TwoDimensionWidget extends Widget {
  dimension = WidgetDimension.TwoDimensional;
  dataInputConfig: TwoDimensionDataInputConfig;

  constructor(props: TwoDimensionWidgetConstructorProps) {
    super(props);
    
    this.dataInputConfig = {
      isDistinct: props.dataInputConfig?.isDistinct ?? false,
      clubbingTime: props.dataInputConfig?.clubbingTime ?? false,
      fieldNames: props.dataInputConfig?.fieldNames ?? [],
      getColumnNameWithAggregationMethod: props.dataInputConfig?.getColumnNameWithAggregationMethod ?? false,
      groupBy1: props.dataInputConfig?.groupBy1 ?? null,
      dataConfig: props.dataInputConfig?.dataConfig ?? [],
      method: props.dataInputConfig?.method ?? Enum_Method.Count,
      DataOutputConfig: props.dataInputConfig?.DataOutputConfig
    };
  }
}

export class ThreeDimensionWidget extends Widget {
  dimension = WidgetDimension.ThreeDimensional;
  dataInputConfig: ThreeDimensionDataInputConfig;

  constructor(props: ThreeDimensionWidgetConstructorProps) {
    super(props);
    
    this.dataInputConfig = {
      isDistinct: props.dataInputConfig?.isDistinct ?? false,
      clubbingTime: props.dataInputConfig?.clubbingTime ?? false,
      fieldNames: props.dataInputConfig?.fieldNames ?? [],
      getColumnNameWithAggregationMethod: props.dataInputConfig?.getColumnNameWithAggregationMethod ?? false,
      groupBy1: props.dataInputConfig?.groupBy1 ?? null,
      groupBy2: props.dataInputConfig?.groupBy2 ?? null,
      dataConfig: props.dataInputConfig?.dataConfig ?? [],
      method: props.dataInputConfig?.method ?? Enum_Method.Count,
      DataOutputConfig: props.dataInputConfig?.DataOutputConfig
    };
  }
}
export class NoDimensionWidget extends Widget {
  dimension = WidgetDimension.NoDimension;
  dataInputConfig: NoDimensionDataInputConfig;

  constructor(props: ThreeDimensionWidgetConstructorProps) {
    super(props);
    
    this.dataInputConfig = {
      isDistinct: props.dataInputConfig?.isDistinct ?? false,
      dataConfig: props.dataInputConfig?.dataConfig ?? null,
      method: props.dataInputConfig?.method ?? Enum_Method.Count
    };
  }
}



// Dimension-specific Widget Constructor Props
export interface OneDimensionWidgetConstructorProps extends BaseWidgetConstructorProps {
  dataInputConfig?: OneDimensionDataInputConfig;
}

export interface TwoDimensionWidgetConstructorProps extends BaseWidgetConstructorProps {
  dataInputConfig: TwoDimensionDataInputConfig;
}

export interface ThreeDimensionWidgetConstructorProps extends BaseWidgetConstructorProps {
  dataInputConfig: ThreeDimensionDataInputConfig;
}
export interface NoDimensionWidgetConstructorProps extends BaseWidgetConstructorProps {
  dataInputConfig: NoDimensionDataInputConfig;
}
