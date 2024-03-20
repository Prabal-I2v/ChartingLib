
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


import { GridComponent } from '@progress/kendo-angular-grid';
import { data } from '../kendo-chart/commit-data';
import { products } from './product';
import { Product } from '../kendo-chart/model';


const dayLabels: { [index: number]: string } = {
  1: "Mon",
  3: "Wed",
  5: "Fri",
};


@Component({
  selector: 'app-kendo-dashboard',
  templateUrl: './kendo-dashboard.component.html',
  styleUrls: ['./kendo-dashboard.component.scss']
})
export class KendoDashoardComponent implements OnInit {
  @ViewChild('chart')
  private chart!: ChartComponent;
  public commitData = data();

  public yAxisLabelContent = (e: { value: string }|any): string => {
    return dayLabels[e.value] || "";
  };

   seriesData: number[] = [1, 2, 3, 5];
   scale=0.8;
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



