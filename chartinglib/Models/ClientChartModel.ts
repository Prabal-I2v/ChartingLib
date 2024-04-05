export class ClientChartModel{
    series : ChartSeries[]
    chartCategories : string[]
    x_label : string
    y_label : string
}

export class ChartSeries{
    name : string
    data : any[]
    color? : string

    constructor(name: string, data: any[], color: string = null) {
        this.name = name;
        this.data = data;
        if(color)
        {
            this.color = color
        }
    }
}