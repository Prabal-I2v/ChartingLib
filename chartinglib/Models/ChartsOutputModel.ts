export class ChartsOutputModel {
    widgetQuery? :string;
    labels: ChartsLabelModel[];
    data: ChartsDataModel[];
}

class ChartsDataModel {
    data: string[];
    label: string;
}

class ChartsLabelModel {
    value: string[];
    key: string;
}
