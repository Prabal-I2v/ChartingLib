import { OneDimensionWidget, OneDimensionWidgetConstructorProps} from "../Widget";;
import { Enum_Method_Aggregation, Enum_WidgetType } from "../enums/enums";

export interface DonutConf {
  centerLabel: string
  centerLabelAggregation : Enum_Method_Aggregation,
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
