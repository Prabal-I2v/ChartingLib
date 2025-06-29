import { dashboard } from "../DashboardModel";
import { OneDimensionWidget, OneDimensionWidgetConstructorProps} from "../Widget";;
import { Enum_Method_Aggregation, Enum_WidgetType, WidgetDimension } from "../enums/enums";
import { ITwoDimensionDataInputConfig, IWidgetDisplayConfig, IWidgetFilterConfig, IWidgetDataOutputConfig, IShowableProperty, IWidgetInteractivityConfig, IOneDimensionDataInputConfig } from "../interfaces/interfaces";
import { WidgetTileConf } from "../types/types";

export interface DonutConf {
  resultLabel: string
  seriesAggregation : Enum_Method_Aggregation,
  showSeriesLabelValue : boolean;
}

export class Donut1DWidgetConstructorProps extends OneDimensionWidgetConstructorProps {
  donutConf? : DonutConf
}
export class DonutChart1DWidget extends OneDimensionWidget {
  widgetType = Enum_WidgetType.Donut1D
  donutConf? : DonutConf
    constructor(params: Donut1DWidgetConstructorProps) {
        // Call the parent constructor with the params
        super({
          ...params  // Allow overriding any properties
        });
        this.donutConf = params.donutConf
      }
}