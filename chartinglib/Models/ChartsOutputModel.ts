export class ChartsOutputModel {
  widgetQuery?: string;
  labels: ChartsLabelModel;
  seriesData: ChartsDataModel[];
}

class ChartsDataModel {
  data: string[];
  label: string;
}

class ChartsLabelModel {
  xAxisLabel: string;
  xAxisFields: string[];
  yAxisLabel: string;
  yAxisFields: string[];
  categories : string [];
  useXAxisFieldValue: boolean = false;
}
