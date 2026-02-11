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
  selectedIds = new Set<string>();
  skip = 0;


  constructor(
    private dashboardService: DashboardService,
    public dialogRef: MatDialogRef<PredefinedWidgetsComponent>
  ) {}

  ngOnInit(): void {
    this.dashboardService.getAllPredefineWidgets().subscribe({
      next: (res) => {
        this.predefinedWidgets = res.filter(w => w.isCopied === false);
        this.createWidgetTypeEntities();  
        this.setTableColumns();
        this.predefinedWidgetGridData = this.mapWidgets(this.predefinedWidgets);
      }      
    });
  }

  onSubmit(): void {
    // Take the actual selected widget objects
    const selectedWidgetObjects = this.predefinedWidgets.filter(widget =>
      this.selectedWidgets.some(selected => selected.id === widget.id)
    );
  
    // Mutate properties before returning
    selectedWidgetObjects.forEach(w => {
      w.isCopied = true;
      w.isPredefinedWidget = false;
      w.canBeRemoved = true;
    });
  
    // Return updated widgets
    this.dialogRef.close(selectedWidgetObjects);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // Handle selection from child lib-entityselector
  selectWidgetType(selectedEntity: Entity) {
    this.skip = 0; 
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
    return widgets
      .filter(w => w && w.id)
      .map(widget => ({
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

  public onGridSelectionChange(e: any): void {
    // Add newly selected rows
    e.selectedRows.forEach((r: any) => {
      this.selectedIds.add(r.dataItem.id);
    });
  
    // Remove unselected rows
    e.deselectedRows.forEach((r: any) => {
      this.selectedIds.delete(r.dataItem.id);
    });
  
    // Map selected IDs → actual widget objects
    this.selectedWidgets = this.predefinedWidgets.filter(w =>
      this.selectedIds.has(w.id)
    );
  }

  public rowCallback(context: RowClassArgs) {
    return {};
  }
}
