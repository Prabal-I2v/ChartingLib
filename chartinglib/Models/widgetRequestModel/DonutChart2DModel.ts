import { TwoDimensionWidget, TwoDimensionWidgetConstructorProps } from "../Widget";
import { Enum_WidgetType } from "../enums/enums";
import { DonutConf } from "./DonutChart1DModel";

export class Donut2DWidgetConstructorProps extends TwoDimensionWidgetConstructorProps {
  donutConf? : DonutConf
}
export class DonutChart2DWidget extends TwoDimensionWidget {
  widgetType = Enum_WidgetType.Donut2D
  donutConf? : DonutConf
    constructor(params: Donut2DWidgetConstructorProps) {
        // Call the parent constructor with the params
        super({
          ...params  // Allow overriding any properties
        });
        this.donutConf = params.donutConf
      }
}
