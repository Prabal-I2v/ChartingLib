import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ChartingDataService } from '../charting-data.service';
import { I2vChartsComponent } from '../i2v-charts/i2v-charts.component';
import moment from 'moment';
import { ColumnModel } from 'src/app/Models/columns.model';
import { GridInputFormat } from 'src/app/Models/GridInputFormat.model';
import { KendoGridComponent } from 'src/app/kendo-grid/kendo-grid.component';
import { ReplaySubject } from 'rxjs';
import { TableOutputModel } from '../Models/TableOutputModel';

@Component({
  selector: 'i2v-table-grid',
  templateUrl: './i2v-grid.component.html',
  styleUrl: './i2v-grid.component.scss'
})
export class I2vGridComponent extends I2vChartsComponent {

  pageLimit = 100;
  @ViewChild('Grid') Grid: KendoGridComponent;
  columnToSelected: ColumnModel[] = [];
  configuration: GridInputFormat = new GridInputFormat();
  public SelectColumnFilteredList: ReplaySubject<any[]> = new ReplaySubject<
    any[]
  >(1);
  selectedColumnDefs: ColumnModel[] = [];
  columnDefs: ColumnModel[] = [];


  constructor(
    chartingDataService: ChartingDataService,
    public cd: ChangeDetectorRef,
    elementRef: ElementRef
  ) {
    super(cd, chartingDataService, elementRef);
    this.configuration.columnDefs = this.columnDefs;
    this.configuration.isSpecific = true;
    this.configuration.noHeader = true;
    this.configuration.pageLimit = this.pageLimit;
    this.configuration.pagination = true;
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  UnixToDateConverter(unix) {
    if (unix == null || unix == undefined) {
      return "";
    }
    if (moment(unix).isValid) {
      return moment(unix).format("Do MMMM YYYY, h:mm:ss a");
    } else return "";
    //var date = new Date(unix);
    //return date.toLocaleString();
  }
  GetImageFieldValue(row, field) {
    let value;
    try {
      if (value == null) {
        return value;
      }
      atob(value);

      return "data:image/png;base64," + value;
    } catch (e) {
      return value;
    }

  }

  public pageLimitOptions: any[] = [
    { label: '50', value: 50 },
    { label: '100', value: 100 },
    { label: '200', value: 200 },
    { label: '300', value: 300},
    { label: '500', value: 500 }
  ];
  


  onPageLimitChange(event)
  {
    this.configuration.pageLimit = event.target.value
  }

  sortColumns() {
    this.SelectColumnFilteredList.subscribe((list) => {
      const indexMap = new Map(list.map((item, index) => [item.headerName, index]));
      this.selectedColumnDefs = this.selectedColumnDefs.sort((a, b) => indexMap.get(a.headerName) - indexMap.get(b.headerName));
    });
  }

  columnChanged(data) {
    const columnList: any[] = [];
    if (data.value) {
      data.value.forEach((item) => {
        columnList.push(item);
      });

      // if (data.customColumns) {
      // }
    }
  }

  updateColumns() {
    this.updateKendoColumn();
    this.cd.detectChanges();
  }

  private updateColumnSelection() {
    this.columnToSelected = this.columnDefs.map((colDef) => {
      const isSelected = this.selectedColumnDefs.some(
        (selectedCol) => selectedCol.field === colDef.field
      );
      return {
        ...colDef,
        checked: isSelected,
      };
    });
    this.SelectColumnFilteredList.next(this.columnToSelected);
  }

  public transformTableData(data: TableOutputModel): TableOutputModel {
    var data  = super.transformTableData(data);
    this.columnDefs = data.columns
    this.selectedColumnDefs = this.columnDefs;
    this.updateColumnSelection()
    this.configuration.length = data.rows.events.length;
    this.updateColumns()
    return data;
  }

  updateKendoColumn() {
    this.Grid?.changeColumns(this.selectedColumnDefs, [], []);
    this.configuration.columnDefs = this.selectedColumnDefs;
  }

  onImgError(event) {
    event.target.src = "assets/no-image.jpg";
  }

  dateRenderer(unix) {
    if (moment(unix).isValid) {
      return moment(unix).format("Do MMMM YYYY");
    } else {
      return "";
    }
  }

  GetFieldValue(row, field) {
    let value;
    if (field.includes(".")) {
      const temp = field.split(".");
      value = row;
      temp.forEach((item) => {
        if (value) {
          value = value[item];
        }
      });
    } else {
      value = row[field];
    }
    return value;
  }
}
