export class ChartsOutputModel {
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
