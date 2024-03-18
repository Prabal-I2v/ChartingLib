import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from '@progress/kendo-angular-charts';
import { process } from "@progress/kendo-data-query";
import {
  aggregateBy,
  AggregateDescriptor,
  AggregateResult,
  GroupDescriptor,
} from "@progress/kendo-data-query";
import { Product } from "./model";
// import { SVGIcon, fileExcelIcon } from "@progress/kendo-svg-icons";
import { products } from './product';
import { DataBindingDirective, GridComponent } from '@progress/kendo-angular-grid';
import { SVGIcon, filePdfIcon, fileExcelIcon } from "@progress/kendo-svg-icons"
import { employees } from './employees';
import  { images }  from './images';
import { data } from "./commit-data";

const dayLabels: { [index: number]: string } = {
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thur",
  5: "Fri",
  6:  "Sat"
};


@Component({
  selector: 'app-kendo-chart',
  templateUrl: './kendo-chart.component.html',
  styleUrls: ['./kendo-chart.component.scss']
})
export class KendoChartComponent implements OnInit {
  @ViewChild('chart')
  private chart!: ChartComponent;

  public commitData = data();

  public yAxisLabelContent = (e: { value: string }): string => {
    return dayLabels[e.value] || "";
  };


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

  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  public gridData: unknown[] = employees;
  public gridView: unknown[];

  public mySelection: string[] = [];
  public pdfSVG: SVGIcon = filePdfIcon;
  public excelSVG: SVGIcon = fileExcelIcon;

  public ngOnInit(): void {
    this.gridView = this.gridData;
  }

  public onFilter(value: Event): void {
    const inputValue = value;

    this.gridView = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: "full_name",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "job_title",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "budget",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "phone",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "address",
            operator: "contains",
            value: inputValue,
          },
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }

  public photoURL(dataItem: { img_id: string; gender: string }): string {
    const code: string = dataItem.img_id + dataItem.gender;
    const image: { [Key: string]: string } = images;

    return image[code];
  }

  public flagURL(dataItem: { country: string }): string {
    const code: string = dataItem.country;
    const image: { [Key: string]: string } = images;

    return image[code];
  }
}


