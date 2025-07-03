// widget-factory.ts - Refactored to create widget-specific configurations first
import { WidgetDimension, Enum_WidgetType, widgetTypeDimensionMap } from "./enums/enums";
import { IThreeDimensionDataInputConfig, IOneDimensionDataInputConfig, ITwoDimensionDataInputConfig, INoDimensionDataInputConfig, IShowableProperty } from "./interfaces/interfaces";
import { Widget } from "./Widget";

import { TableConf, TableWidget } from "./widgetRequestModel/TableWidgetRequestModel";
import { StackedBarChartWidget } from "./widgetRequestModel/StackedBarChartRequestModel";
import { StackedColumnChartWidget } from "./widgetRequestModel/StackedColumnChartRequestModel";
import { WidgetConstructorProps } from "./types/types";
import { Kpi1DWidget, KPI1DWidgetConstructorProps } from "./widgetRequestModel/KpiWidget1DModel";
import { Kpi2DWidget, KPI2DWidgetConstructorProps, KPIConf } from "./widgetRequestModel/KpiWidget2DModel";
import { AreaChart2DWidget } from "./widgetRequestModel/AreaChart2DModel";
import { DonutConf, DonutChart2DWidget, Donut2DWidgetConstructorProps } from "./widgetRequestModel/DonutChart2DModel";
import { DonutChart1DWidget, Donut1DWidgetConstructorProps } from "./widgetRequestModel/DonutChart1DModel";
import { BarChart1DWidget } from "./widgetRequestModel/BarChart1DModel";
import { BarChart2DWidget } from "./widgetRequestModel/BarChart2DModel";
import { ColumnChart1DWidget } from "./widgetRequestModel/ColumnChart1DModel";
import { LineChart1DWidget } from "./widgetRequestModel/LineChart1DModel";
import { PieChart1DWidget } from "./widgetRequestModel/PieChart1DModel";
import { AreaChart1DWidget } from "./widgetRequestModel/AreaChart1DModel";
import { HeatMapChart1DWidget } from "./widgetRequestModel/HeatMapChart1DModel";
import { ColumnChart2DWidget } from "./widgetRequestModel/ColumnChart2DModel";
import { LineChart2DWidget } from "./widgetRequestModel/LineChart2DModel";
import { PieChart2DWidget } from "./widgetRequestModel/PieChart2DModel";
import { HeatMapChart2DWidget } from "./widgetRequestModel/HeatMapChart2DModel";
import { HeatMapChart3DWidget } from "./widgetRequestModel/HeatMapChart3DModel";

// Factory for creating specific widget types
export class WidgetFactory {
  // Create a widget based on its type and base properties
  static createWidget(baseProps: WidgetConstructorProps, type: Enum_WidgetType): Widget {
    const widgetType = type;

    switch (widgetType) {
      case Enum_WidgetType.KPI1D:
        return this.createKpi1DWidget(baseProps);

      case Enum_WidgetType.KPI2D:
        return this.createKpi2DWidget(baseProps);

      case Enum_WidgetType.BarChart1D:
        return this.createBarChart1DWidget(baseProps);

      case Enum_WidgetType.BarChart2D:
        return this.createBarChart2DWidget(baseProps);

      case Enum_WidgetType.ColumnChart1D:
        return this.createColumnChart1DWidget(baseProps);

      case Enum_WidgetType.ColumnChart2D:
        return this.createColumnChart2DWidget(baseProps);

      case Enum_WidgetType.LineChart1D:
        return this.createLineChart1DWidget(baseProps);

      case Enum_WidgetType.LineChart2D:
        return this.createLineChart2DWidget(baseProps);

      case Enum_WidgetType.PieChart1D:
        return this.createPieChart1DWidget(baseProps);

      case Enum_WidgetType.PieChart2D:
        return this.createPieChart2DWidget(baseProps);

      case Enum_WidgetType.Donut1D:
        return this.createDonutChart1DWidget(baseProps);

      case Enum_WidgetType.Donut2D:
        return this.createDonutChart2DWidget(baseProps);

      case Enum_WidgetType.AreaChart1D:
        return this.createAreaChart1DWidget(baseProps);

      case Enum_WidgetType.AreaChart2D:
        return this.createAreaChart2DWidget(baseProps);

      case Enum_WidgetType.HeatMapChart1D:
        return this.createHeatMapChart1DWidget(baseProps);

      case Enum_WidgetType.HeatMapChart2D:
        return this.createHeatMapChart2DWidget(baseProps);

      case Enum_WidgetType.HeatMapChart3D:
        return this.createHeatMapChart3DWidget(baseProps);

      case Enum_WidgetType.Table:
        return this.createTableWidget(baseProps);

      case Enum_WidgetType.StackedBarChart:
        return this.createStackedBarChartWidget(baseProps);

      case Enum_WidgetType.StackedColumnChart:
        return this.createStackedColumnChartWidget(baseProps);

      default:
        // Fall back to a dimension-based widget
        throw new Error("Invalid Widget Type")
    }
  }


  private static createKpi1DWidget(baseProps: WidgetConstructorProps): Kpi1DWidget {
    // Create proper constructor props
    const kpiProps: KPI1DWidgetConstructorProps = {
      ...baseProps,
      dataInputConfig: baseProps.dataInputConfig as IOneDimensionDataInputConfig,
      kpiConf: baseProps['kpiConf'] as KPIConf,
    };

    return new Kpi1DWidget(kpiProps);
  }

  private static createKpi2DWidget(baseProps: WidgetConstructorProps): Kpi2DWidget {
    // Create proper constructor props
    const kpiProps: KPI2DWidgetConstructorProps = {
      ...baseProps,
      dataInputConfig: baseProps.dataInputConfig as ITwoDimensionDataInputConfig,
      kpiConf: baseProps['kpiConf'] as KPIConf,
    };

    return new Kpi2DWidget(kpiProps);
  }


  private static createDonutChart1DWidget(baseProps: WidgetConstructorProps): DonutChart1DWidget {
    // Create proper constructor props
    const donutProps: Donut1DWidgetConstructorProps = {
      ...baseProps,
      dataInputConfig: baseProps.dataInputConfig as IOneDimensionDataInputConfig,
      donutConf: baseProps['donutConf'] as DonutConf
    };

    return new DonutChart1DWidget(donutProps);
  }

  private static createDonutChart2DWidget(baseProps: WidgetConstructorProps): DonutChart2DWidget {
    // Create proper constructor props
    const donutProps: Donut2DWidgetConstructorProps = {
      ...baseProps,
      dataInputConfig: baseProps.dataInputConfig as ITwoDimensionDataInputConfig,
      donutConf: baseProps['donutConf'] as DonutConf
    };

    return new DonutChart2DWidget(donutProps);
  }

  private static createBarChart1DWidget(baseProps: WidgetConstructorProps): BarChart1DWidget {
    return new BarChart1DWidget({
      ...baseProps,
      dataInputConfig: baseProps.dataInputConfig as IOneDimensionDataInputConfig
    });
  }

  private static createBarChart2DWidget(baseProps: WidgetConstructorProps): BarChart2DWidget {
    return new BarChart2DWidget({
      ...baseProps,
      dataInputConfig: baseProps.dataInputConfig as ITwoDimensionDataInputConfig
    });
  }

  private static createColumnChart1DWidget(baseProps: WidgetConstructorProps): ColumnChart1DWidget {
    return new ColumnChart1DWidget({
      ...baseProps,
      dataInputConfig: baseProps.dataInputConfig as IOneDimensionDataInputConfig
    });
  }

  private static createColumnChart2DWidget(baseProps: WidgetConstructorProps): ColumnChart2DWidget {
    return new ColumnChart2DWidget({
      ...baseProps,
      dataInputConfig: baseProps.dataInputConfig as ITwoDimensionDataInputConfig
    });
  }

  private static createLineChart1DWidget(baseProps: WidgetConstructorProps): LineChart1DWidget {
    return new LineChart1DWidget({
      ...baseProps,
      dataInputConfig: baseProps.dataInputConfig as IOneDimensionDataInputConfig
    });
  }

  private static createLineChart2DWidget(baseProps: WidgetConstructorProps): LineChart2DWidget {
    return new LineChart2DWidget({
      ...baseProps,
      dataInputConfig: baseProps.dataInputConfig as ITwoDimensionDataInputConfig
    });
  }

  private static createPieChart1DWidget(baseProps: WidgetConstructorProps): PieChart1DWidget {
    return new PieChart1DWidget({
      ...baseProps,
      dataInputConfig: baseProps.dataInputConfig as IOneDimensionDataInputConfig
    });
  }

  private static createPieChart2DWidget(baseProps: WidgetConstructorProps): PieChart2DWidget {
    return new PieChart2DWidget({
      ...baseProps,
      dataInputConfig: baseProps.dataInputConfig as ITwoDimensionDataInputConfig
    });
  }

  private static createAreaChart1DWidget(baseProps: WidgetConstructorProps): AreaChart1DWidget {
    return new AreaChart1DWidget({
      ...baseProps,
      dataInputConfig: baseProps.dataInputConfig as IOneDimensionDataInputConfig
    });
  }

  private static createAreaChart2DWidget(baseProps: WidgetConstructorProps): AreaChart2DWidget {
    return new AreaChart2DWidget({
      ...baseProps,
      dataInputConfig: baseProps.dataInputConfig as ITwoDimensionDataInputConfig
    });
  }

  private static createHeatMapChart1DWidget(baseProps: WidgetConstructorProps): HeatMapChart1DWidget {
    return new HeatMapChart1DWidget({
      ...baseProps,
      dataInputConfig: baseProps.dataInputConfig as IOneDimensionDataInputConfig
    });
  }

  private static createHeatMapChart2DWidget(baseProps: WidgetConstructorProps): HeatMapChart2DWidget {
    return new HeatMapChart2DWidget({
      ...baseProps,
      dataInputConfig: baseProps.dataInputConfig as ITwoDimensionDataInputConfig
    });
  }

  private static createHeatMapChart3DWidget(baseProps: WidgetConstructorProps): HeatMapChart3DWidget {
    return new HeatMapChart3DWidget({
      ...baseProps,
      dataInputConfig: baseProps.dataInputConfig as IThreeDimensionDataInputConfig
    });
  }

  private static createTableWidget(baseProps: WidgetConstructorProps): TableWidget {
    // Create KPI-specific configuration
    const tableConf: TableConf = {
      pagination: false,
      pageLimit: 0,
      pageNumber: 0
    };

    return new TableWidget({
      ...baseProps,
      dataInputConfig: baseProps.dataInputConfig as INoDimensionDataInputConfig,
      tableConf: tableConf
    });
  }

  private static createStackedBarChartWidget(baseProps: WidgetConstructorProps): StackedBarChartWidget {
    return new StackedBarChartWidget({
      ...baseProps,
      dataInputConfig: baseProps.dataInputConfig as IThreeDimensionDataInputConfig
    });
  }

  private static createStackedColumnChartWidget(baseProps: WidgetConstructorProps): StackedColumnChartWidget {
    return new StackedColumnChartWidget({
      ...baseProps,
      dataInputConfig: baseProps.dataInputConfig as IThreeDimensionDataInputConfig
    });
  }

  public static validateWidgetConfiguration(
    widgetType: Enum_WidgetType,
    dataConfig: any,
    showablePropertiesArray: string[]
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (dataConfig.fieldNames.length > 0 && showablePropertiesArray.length == 0) {
      errors.push("Please select atleast one showable property")
      return;
    }
    const targetDimension = widgetTypeDimensionMap[widgetType];


    // Determine the actual dimension of the provided data configuration
    let actualDimension = WidgetDimension.OneDimensional;
    if (dataConfig.groupBy1 && dataConfig.groupBy2) {
      actualDimension = WidgetDimension.ThreeDimensional;
    } else if (dataConfig.groupBy1) {
      actualDimension = WidgetDimension.TwoDimensional;
    }

    // Check if the provided dimension is compatible with the widget type
    if (actualDimension > targetDimension) {
      errors.push(`${Enum_WidgetType[widgetType]} (${targetDimension + 1} Dimensional) cannot use ${actualDimension + 1} Dimensional data configuration. Remove excess groupBy fields.`);
    }

    // Widget-specific validations
    switch (widgetType) {
      case Enum_WidgetType.KPI1D:
      case Enum_WidgetType.AreaChart1D:
      case Enum_WidgetType.BarChart1D:
      case Enum_WidgetType.ColumnChart1D:
      case Enum_WidgetType.LineChart1D:
      case Enum_WidgetType.PieChart1D:
      case Enum_WidgetType.Donut1D:
      case Enum_WidgetType.HeatMapChart1D:
        if (targetDimension !== WidgetDimension.OneDimensional) {
          errors.push(`${Enum_WidgetType[widgetType]} requires no group by fields`);
        }
        break;

      case Enum_WidgetType.Table:
        // Table widgets can work with any data configuration
        break;

      case Enum_WidgetType.BarChart2D:
      case Enum_WidgetType.ColumnChart2D:
      case Enum_WidgetType.LineChart2D:
      case Enum_WidgetType.PieChart2D:
      case Enum_WidgetType.KPI2D:
      case Enum_WidgetType.Donut2D:
      case Enum_WidgetType.AreaChart2D:
      case Enum_WidgetType.HeatMapChart2D:
        if (targetDimension !== WidgetDimension.TwoDimensional) {
          errors.push(`${Enum_WidgetType[widgetType]} requires only 1 group by field`);
        }

        if (widgetType === Enum_WidgetType.PieChart2D || widgetType === Enum_WidgetType.Donut2D || widgetType === Enum_WidgetType.KPI2D) {
          if (showablePropertiesArray && showablePropertiesArray.length > 1) {
            errors.push(`Either select a single showable property or choose a different chart`);
          }
        }
        break;

      case Enum_WidgetType.HeatMapChart3D:
      case Enum_WidgetType.StackedBarChart:
      case Enum_WidgetType.StackedColumnChart:
        if (targetDimension !== WidgetDimension.ThreeDimensional) {
          errors.push(`${Enum_WidgetType[widgetType]} requires 2 group by fields`);
        }
        break;

      default:
        // Optional: Handle unknown widget types
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