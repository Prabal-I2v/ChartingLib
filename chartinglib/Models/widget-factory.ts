// widget-factory.ts - Refactored to create widget-specific configurations first
import { OneDimensionWidget, TwoDimensionWidget, ThreeDimensionWidget } from "./dimension-widgets";
import { WidgetDimension, Enum_WidgetType, Enum_Method_Aggregation, widgetTypeDimensionMap } from "./enums/enums";
import { ThreeDimensionDataInputConfig, OneDimensionDataInputConfig, TwoDimensionDataInputConfig } from "./interfaces/interfaces";
import { Widget } from "./Widget";
import { KpiWidget, KPIWidgetConstructorProps, KPIConf } from "./widgetRequestModel/KpiWidgetRequestModel";
import { BarChartWidget } from "./widgetRequestModel/BarChartRequestModel";
import { ColumnChartWidget } from "./widgetRequestModel/ColumnChartRequestModel";
import { LineChartWidget } from "./widgetRequestModel/LineChartRequestModel";
import { PieChartWidget } from "./widgetRequestModel/PieChartRequestModel";
import { DonutChartWidget, DonutWidgetConstructorProps, DonutConf } from "./widgetRequestModel/DonutChartRequestModel";
import { AreaChartWidget } from "./widgetRequestModel/AreaChartRequestModel";
import { HeatMapChartWidget } from "./widgetRequestModel/HeatMapChartRequestModel";
import { TableWidget } from "./widgetRequestModel/TableWidgetRequestModel";
import { StackedBarChartWidget } from "./widgetRequestModel/StackedBarChartRequestModel";
import { StackedColumnChartWidget } from "./widgetRequestModel/StackedColumnChartRequestModel";
import { WidgetConstructorProps } from "./types/types";

// Factory for creating specific widget types
export class WidgetFactory {
  // Create a widget based on its type and base properties
  static createWidget(baseProps: WidgetConstructorProps): Widget {
    const widgetType = baseProps.widgetType;
    
    switch (widgetType) {
      case Enum_WidgetType.KPI:
        return this.createKpiWidget(baseProps);
        
      case Enum_WidgetType.BarChart:
        return this.createBarChartWidget(baseProps);
        
      case Enum_WidgetType.ColumnChart:
        return this.createColumnChartWidget(baseProps);
        
      case Enum_WidgetType.LineChart:
        return this.createLineChartWidget(baseProps);
        
      case Enum_WidgetType.PieChart:
        return this.createPieChartWidget(baseProps);
        
      case Enum_WidgetType.Donut:
        return this.createDonutChartWidget(baseProps);
        
      case Enum_WidgetType.AreaChart:
        return this.createAreaChartWidget(baseProps);
        
      case Enum_WidgetType.HeatMapChart:
        return this.createHeatMapChartWidget(baseProps);
        
      case Enum_WidgetType.Table:
        return this.createTableWidget(baseProps);
        
      case Enum_WidgetType.StackedBarChart:
        return this.createStackedBarChartWidget(baseProps);
        
      case Enum_WidgetType.StackedColumnChart:
        return this.createStackedColumnChartWidget(baseProps);
        
      default:
        // Fall back to a dimension-based widget
        return this.createDimensionWidget(baseProps);
    }
  }
  
  // Helper methods for each widget type
  private static createKpiWidget(baseProps: WidgetConstructorProps): KpiWidget {
    // Create KPI-specific configuration
    const kpiConf: KPIConf = {
      CountValueColumnName: 'count',
      DisplayValueColumnName: 'value',
      showChart: false
    };
    
    // Create proper constructor props
    const kpiProps: KPIWidgetConstructorProps = {
      ...baseProps,
      widgetType: Enum_WidgetType.KPI,
      dataInputConfig: baseProps.dataInputConfig as TwoDimensionDataInputConfig,
      kpiConf: kpiConf
    };
    
    return new KpiWidget(kpiProps);
  }
  
  private static createDonutChartWidget(baseProps: WidgetConstructorProps): DonutChartWidget {   
    // Create proper constructor props
    const donutProps: DonutWidgetConstructorProps = {
      ...baseProps,
      widgetType: Enum_WidgetType.Donut,
      dataInputConfig: baseProps.dataInputConfig as TwoDimensionDataInputConfig,
    };
    
    return new DonutChartWidget(donutProps);
  }
  
  private static createBarChartWidget(baseProps: WidgetConstructorProps): BarChartWidget {
    return new BarChartWidget({
      ...baseProps,
      widgetType: Enum_WidgetType.BarChart,
      dataInputConfig: baseProps.dataInputConfig as TwoDimensionDataInputConfig
    });
  }
  
  private static createColumnChartWidget(baseProps: WidgetConstructorProps): ColumnChartWidget {
    return new ColumnChartWidget({
      ...baseProps,
      widgetType: Enum_WidgetType.ColumnChart,
      dataInputConfig: baseProps.dataInputConfig as TwoDimensionDataInputConfig
    });
  }
  
  private static createLineChartWidget(baseProps: WidgetConstructorProps): LineChartWidget {
    return new LineChartWidget({
      ...baseProps,
      widgetType: Enum_WidgetType.LineChart,
      dataInputConfig: baseProps.dataInputConfig as TwoDimensionDataInputConfig
    });
  }
  
  private static createPieChartWidget(baseProps: WidgetConstructorProps): PieChartWidget {
    return new PieChartWidget({
      ...baseProps,
      widgetType: Enum_WidgetType.PieChart,
      dataInputConfig: baseProps.dataInputConfig as TwoDimensionDataInputConfig
    });
  }
  
  private static createAreaChartWidget(baseProps: WidgetConstructorProps): AreaChartWidget {
    return new AreaChartWidget({
      ...baseProps,
      widgetType: Enum_WidgetType.AreaChart,
      dataInputConfig: baseProps.dataInputConfig as TwoDimensionDataInputConfig
    });
  }
  
  private static createHeatMapChartWidget(baseProps: WidgetConstructorProps): HeatMapChartWidget {
    return new HeatMapChartWidget({
      ...baseProps,
      widgetType: Enum_WidgetType.HeatMapChart,
      dataInputConfig: baseProps.dataInputConfig as ThreeDimensionDataInputConfig
    });
  }
  
  private static createTableWidget(baseProps: WidgetConstructorProps): TableWidget {
    return new TableWidget({
      ...baseProps,
      widgetType: Enum_WidgetType.Table
    });
  }
  
  private static createStackedBarChartWidget(baseProps: WidgetConstructorProps): StackedBarChartWidget {
    return new StackedBarChartWidget({
      ...baseProps,
      widgetType: Enum_WidgetType.StackedBarChart,
      dataInputConfig: baseProps.dataInputConfig as ThreeDimensionDataInputConfig
    });
  }
  
  private static createStackedColumnChartWidget(baseProps: WidgetConstructorProps): StackedColumnChartWidget {
    return new StackedColumnChartWidget({
      ...baseProps,
      widgetType: Enum_WidgetType.StackedColumnChart,
      dataInputConfig: baseProps.dataInputConfig as ThreeDimensionDataInputConfig
    });
  }
  
  private static createDimensionWidget(props: WidgetConstructorProps): Widget {
    const dimension = widgetTypeDimensionMap[props.widgetType];
    
    switch (dimension) {
      case WidgetDimension.OneDimensional:
        return new OneDimensionWidget(props);
      case WidgetDimension.TwoDimensional:
        return new TwoDimensionWidget(props as any);
      case WidgetDimension.ThreeDimensional:
        return new ThreeDimensionWidget(props as any);
      default:
        throw new Error(`Unknown widget dimension for type: ${props.widgetType}`);
    }
  }
  
  public static validateWidgetConfiguration(
    widgetType: Enum_WidgetType,
    dataConfig: any
  ): { isValid: boolean; errors: string[] } {
    const targetDimension = widgetTypeDimensionMap[widgetType];
    const errors: string[] = [];
    
    // Determine the actual dimension of the provided data configuration
    let actualDimension = WidgetDimension.OneDimensional;
    if (dataConfig.groupBy1 && dataConfig.groupBy2) {
      actualDimension = WidgetDimension.ThreeDimensional;
    } else if (dataConfig.groupBy1) {
      actualDimension = WidgetDimension.TwoDimensional;
    }
    
    // Check if the provided dimension is compatible with the widget type
    // Higher dimension widgets can use lower dimension data, but not vice versa
    if (actualDimension > targetDimension) {
      errors.push(`${Enum_WidgetType[widgetType]} (${targetDimension}D) cannot use ${actualDimension}D data configuration. Remove excess groupBy fields.`);
    }
    
    // Widget-specific validations
    switch (widgetType) {
      case Enum_WidgetType.KPI:
        // KPI widgets only need 1D data, but can work with higher dimensions
        break;
        
      case Enum_WidgetType.Table:
        // Table widgets can work with any data configuration
        break;
        
      case Enum_WidgetType.BarChart:
      case Enum_WidgetType.ColumnChart:
      case Enum_WidgetType.LineChart:
      case Enum_WidgetType.PieChart:
      case Enum_WidgetType.Donut:
      case Enum_WidgetType.AreaChart:        
      case Enum_WidgetType.HeatMapChart:
      case Enum_WidgetType.StackedBarChart:
      case Enum_WidgetType.StackedColumnChart:
        // These are 3D widgets and need both groupBy1 and groupBy2
        if (targetDimension === WidgetDimension.ThreeDimensional) {
          // if (!dataConfig.groupBy1) {
          //   errors.push(`${Enum_WidgetType[widgetType]} requires groupBy1 field`);
          // }
          // if (!dataConfig.groupBy2) {
          //   errors.push(`${Enum_WidgetType[widgetType]} requires groupBy2 field`);
          // }
        }
        break;
    }
    
    // Check data configuration
    if (!dataConfig.dataConfig || dataConfig.dataConfig.length === 0) {
      errors.push('Widget must have at least one data source configured');
    }
    
    // Validate method field is present
    if (dataConfig.method === undefined) {
      errors.push('Method must be specified in data configuration');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}