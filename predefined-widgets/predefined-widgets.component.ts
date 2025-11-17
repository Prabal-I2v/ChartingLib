import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Entity } from '@i2v-systems/i2v-utility';
import { DashboardService } from 'Analytic/ClientApp/src/app/modules/dashboard/dashboardService.service';
import { Enum_WidgetType } from '../chartinglib/Models/enums/enums';
import { Widget } from '../chartinglib/Models/Widget';
import { GridDataResult, PageChangeEvent, RowClassArgs } from '@progress/kendo-angular-grid';

export interface IPredefinedWidgetTableModel {
    name: string;
    description: string;
    widgetType: string;
}

@Component({
  selector: 'app-predefined-widgets',
  templateUrl: './predefined-widgets.component.html',
  styleUrls: ['./predefined-widgets.component.css'] 
})
export class PredefinedWidgetsComponent implements OnInit {

  widgetTypes: Entity[] = [];
  predefinedWidgets: Widget[] = [];
  selectedWidgets: Widget[] = [];
  predefinedWidgetTableColumns: any[] = [];
  isAllSelected: boolean = true;
  predefinedWidgetGridData: IPredefinedWidgetTableModel[] = [];

  constructor(
    private dashboardService: DashboardService,
    public dialogRef?: MatDialogRef<PredefinedWidgetsComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData?: any,
   
  ) {}

  ngOnInit(): void {
    this.dashboardService.getAllPredefineWidgets().subscribe({
      next: (res) => {
        this.predefinedWidgets = res;
        this.createWidgetTypeEntities();  
        this.setTableColumns();
        // default = all widgets
        this.predefinedWidgetGridData = this.mapWidgets(this.predefinedWidgets);
      }      
    });
  }

  onSubmit(): void {
    // Return the actual widget objects, not just the table models
    const selectedWidgetObjects = this.predefinedWidgets.filter(widget => 
      this.selectedWidgets.some(selected => selected.id === widget.id)
    );
    this.dialogRef?.close(selectedWidgetObjects);
  }

  onCancel(): void {
    this.dialogRef?.close();
  }

  // Handle selection from child lib-entityselector
  selectWidgetType(selectedEntity: Entity) {
    this.isAllSelected = selectedEntity.title === 'All';
    this.widgetTypes.forEach(widget => widget.isSelected = (widget === selectedEntity));
    if (this.isAllSelected) {
      // Show ALL widgets
      this.predefinedWidgetGridData = this.mapWidgets(this.predefinedWidgets);
    } else {
      // FILTER widgets based on selected category
      this.predefinedWidgetGridData = this.mapWidgets(
        this.predefinedWidgets.filter(
          w => Enum_WidgetType[w.widgetType] === selectedEntity.title
        )
      );
    }
  }
  

  private mapWidgets(widgets: Widget[]): IPredefinedWidgetTableModel[] {
    return widgets.map(widget => ({
      id: widget.id,
      name: widget.displayConfig.heading,
      description: "",
      widgetType: Enum_WidgetType[widget.widgetType]
    }));
  }

  setTableColumns() {
    this.predefinedWidgetTableColumns = [
      {
        headerName: 'Widget name',
        field: 'name',
        type: 'text',
      },
      // {
      //   headerName: 'Widget description',
      //   field: 'description',
      //   type: 'text',
      // },
      {
        headerName: 'Widget type',
        field: 'widgetType',
        type: 'text',
        hide: !this.isAllSelected
      }
    ];
  }

  createWidgetTypeEntities(): void {
    const widgetTypeCounts = new Map<Enum_WidgetType, number>();

    this.predefinedWidgets.forEach(widget => {
      widgetTypeCounts.set(widget.widgetType, (widgetTypeCounts.get(widget.widgetType) || 0) + 1);
    });

    const allEntity = {
      svgIcon: 'assets/Outline/plus.svg',
      rightValue: this.predefinedWidgets.length.toString(),
      isSelected: true,
      title: 'All'
    };

    const sortedWidgetTypes = Array.from(widgetTypeCounts.entries()).sort((a, b) => b[1] - a[1]);

    this.widgetTypes = [allEntity, ...sortedWidgetTypes.map(([widgetType, count]) => ({
      svgIcon: 'assets/Outline/' + Enum_WidgetType[widgetType] + '.svg',
      rightValue: count.toString(),
      isSelected: false,
      title: Enum_WidgetType[widgetType]
    }))];
  }

  public onGridSelectionChange(selection: any): void {
    // Store the actual widget objects
    this.selectedWidgets = selection.selectedRows.map((item) => 
      this.predefinedWidgets.find(w => w.id === item.dataItem.id)
    ).filter(Boolean);
  }

  public rowCallback(context: RowClassArgs) {
    return {};
  }
}
