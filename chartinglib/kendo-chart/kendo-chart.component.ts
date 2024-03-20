import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent, SeriesLabelsContentArgs } from '@progress/kendo-angular-charts';
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
import { employees, employees2, employees3, employees4 } from './employees';
import  { images }  from './images';
import { data, data2, data3, data4 } from "./commit-data";

const dayLabels: { [index: number]: string } = {
  0: "Sun",
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
  // @ViewChild('chart');
  @ViewChild('pdf') pdf;
  private chart!: ChartComponent;
  public breakParagraphs = false;
  public get keepTogether(): string {
    return this.breakParagraphs ? "" : "p";
  }
  
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  public gridData: unknown[] = employees;
  public gridView: unknown[];

  public mySelection: string[] = [];
  public pdfSVG: SVGIcon = filePdfIcon;
  public excelSVG: SVGIcon = fileExcelIcon;


 

  seriesData: number[] = [];

  constructor(private cdr : ChangeDetectorRef) {
    // setInterval(() => {
    //   // Clone the array
    //   const data = this.seriesData.slice(0);

    //   // Produce one random value each 100ms
    //   data.push(Math.random());

    //   if (data.length > 10) {
    //       // Keep only 10 items in the array
    //       data.shift();
    //   }

    //   // Replace with the new array instance
    //   this.seriesData = data;
    //   this.cdr.detectChanges();
  // }, 100);
   }

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

  public ngOnInit(): void {
    this.gridView = this.gridData;
    setInterval(()=> {
      // Update your data here
      this.updateData();
      // console.log("pie Data : " + this.pieData)
      // console.log("bar and line Data : " + this.barandLineData)
    }, 1000);
    
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

  public saveAs()
  {
    this.pdf.saveAs('Graphical Report.pdf');
  }

  //Bar&LineChart Data
  public barandLineData =   [200, 450, 300, 125]
  public barandLineCategories = ['Jan', 'Feb', 'Mar', 'Apr'];


  //pieData
  public pieData = [
    { category: "0-14", value: 0.2545 },
    { category: "15-24", value: 0.1552 },
    { category: "25-54", value: 0.4059 },
    { category: "55-64", value: 0.0911 },
    { category: "65+", value: 0.0933 },
  ];

  public newpieData = []

  public labelContent(args: SeriesLabelsContentArgs): string {
    return `${args.dataItem.category} years old`;
  }

  //heat Map
  public commitData = data();

  public heatMapData = [data(), data2(), data3(), data4()]

  public gridDataArray = [employees, employees2, employees3, employees4]

  public yAxisLabelContent = (e: { value: string }): string => {
    return dayLabels[e.value] || "";
  };



  // Function to update data
  updateData() {
    // Update bar and line chart data with random values
    this.barandLineData = this.generateRandomValues(4, 100, 500);
    
    // Update pie chart data with random values
    this.newpieData = this.pieData.map(item => {
      return {
        category: item.category,
        value: Math.random()
      };
    });

    var heaprandomIndex = Math.floor(Math.random() * this.heatMapData.length);

    // Call the randomly selected function to get the data
    this.commitData  = this.heatMapData[heaprandomIndex];

    // Update other data arrays similarly if needed
    var gridrandomIndex = Math.floor(Math.random() * this.gridDataArray.length);

    // Call the randomly selected function to get the data
    this.gridView   = this.gridDataArray[gridrandomIndex];
  }

  // Function to generate random values array
  generateRandomValues(length: number, min: number, max: number): number[] {
    var randomValues = [];
    for (let i = 0; i < length; i++) {
      randomValues.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return randomValues;
  }


}


