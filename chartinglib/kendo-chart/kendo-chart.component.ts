import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from '@progress/kendo-angular-charts';
import { saveAs } from '@progress/kendo-file-saver';
import { Group, exportPDF } from '@progress/kendo-drawing';
import {
  aggregateBy,
  AggregateDescriptor,
  AggregateResult,
  GroupDescriptor,
} from "@progress/kendo-data-query";
import { Product } from "./model";
// import { SVGIcon, fileExcelIcon } from "@progress/kendo-svg-icons";
import { products } from './product';
import { GridComponent } from '@progress/kendo-angular-grid';



@Component({
  selector: 'app-kendo-chart',
  templateUrl: './kendo-chart.component.html',
  styleUrls: ['./kendo-chart.component.scss']
})
export class KendoChartComponent implements OnInit {
  @ViewChild('chart')
  private chart!: ChartComponent;


   seriesData: number[] = [1, 2, 3, 5];

  constructor() { }

  //  fileExcelIcon: SVGIcon = fileExcelIcon;

   aggregates: AggregateDescriptor[] = [
    { field: "UnitPrice", aggregate: "sum" },
  ];

   products: Product[] = products;

   total: AggregateResult = aggregateBy(this.products, this.aggregates);

   group: GroupDescriptor[] = [
    {
      field: "Discontinued",
      aggregates: this.aggregates,
    },
  ];


  ngOnInit(): void {
  }
  // public exportChart(): void {

  //   const visual = this.chart.exportVisual();
  //   const gridVisual=this.grid.excelExport;


  //   exportPDF(visual, {
  //     paperSize: 'A4',
  //     landscape: true
  //   }).then((dataURI:any) => {
  //     saveAs(dataURI, 'chart.pdf');
  //   });
  // }
}


