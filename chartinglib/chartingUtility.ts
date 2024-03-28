export interface IChartDataModel {
    xAxisData: string[],
    seriesData: number[][],
    seriesLabels: string[]
}

export enum ChartType {
    None = "none",
    Line = "line",
    Bar = "bar",
    Pie = "pie",
    Scatter = "scatter",
    GEO_Map = "geo/map",
    Candlestick = "candlestick",
    Radar = "radar",
    Boxplot = "boxplot",
    Heatmap = "heatmap",
    Graph = "graph",
    Lines = "lines",
    Tree = "tree",
    Treemap = "treemap",
    Sunburst = "sunburst",
    Parallel = "parallel",
    Sankey = "sankey",
    Funnel = "funnel",
    Gauge = "gauge",
    PictorialBar = "pictorialbar",
    ThemeRiver = "themeriver",
    Calendar = "calendar",
    Custom = "custom",
    Dataset = "dataset",
    DataZoom = "datazoom",
    Graphic = "graphic",
    RichText = "rich text"
}
