import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ExportProgress, ExportStatus } from '../../../../services/export-status.model';
import { ChartingDataService } from '../charting-data.service';
import { I2vChartsComponent } from '../i2v-charts/i2v-charts.component';
import moment from 'moment';
import { ColumnModel } from 'Analytic/ClientApp/src/app/Models/columns.model';
import { GridInputFormat } from 'Analytic/ClientApp/src/app/Models/GridInputFormat.model';
import { KendoGridComponent } from 'Analytic/ClientApp/src/app/kendo-grid/kendo-grid.component';
import { firstValueFrom, ReplaySubject, Subscription } from 'rxjs';
import { TableOutputModel } from '../Models/TableOutputModel';
import { TranslateService } from '@ngx-translate/core';
import { exportReportModel, SignalRService } from 'Analytic/ClientApp/src/app/services/signalR.service';
import { CommonService } from 'Analytic/ClientApp/src/app/services/common.service';
import { EventService } from 'Analytic/ClientApp/src/app/services/event.service';
import { MatDialog } from '@angular/material/dialog';
import { LogServices } from 'Shared.Client/ClientApp/src/Services/log.service';
import { PopUpComponent } from '@i2v-systems/i2v-utility';

@Component({
  selector: 'i2v-table-grid',
  templateUrl: './i2v-grid.component.html',
  styleUrl: './i2v-grid.component.scss'
})
export class I2vGridComponent extends I2vChartsComponent {


  tableData: TableOutputModel;

  @Input() videoSources = []
  pageLimit = 300;
  @ViewChild('Grid') Grid: KendoGridComponent;
  columnToSelected: ColumnModel[] = [];
  configuration: GridInputFormat = new GridInputFormat();
  public SelectColumnFilteredList: ReplaySubject<any[]> = new ReplaySubject<
    any[]
  >(1);
  selectedColumnDefs: ColumnModel[] = [];
  columnDefs: ColumnModel[] = [];
  isExporting = false;
  exportSubjectSubscription: Subscription;
  progressNotifier: exportReportModel;
  /** Bound to the progress notifier's status line while the export is in flight. */
  exportStatusMessage: string | null = null;

  constructor(
    public cd: ChangeDetectorRef,
    chartingDataService: ChartingDataService,
    elementRef: ElementRef,
    private translate: TranslateService,
    private signalRService: SignalRService,
    private commonService: CommonService,
    private eventService: EventService,
    private logService: LogServices,
    private dialog: MatDialog
  ) {
    super(cd, chartingDataService, elementRef);
    this.configuration.columnDefs = this.columnDefs;
    this.configuration.isSpecific = true;
    this.configuration.noHeader = true;
    this.configuration.pageLimit = this.pageLimit;
    this.configuration.pagination = true;
    this.configuration.length = 0;
    if (this.Grid) {
      this.Grid.skip = 0;
    }
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.signalRService.$CancelExportSubject.subscribe(() => {
      this.isExporting = false;
      localStorage.setItem('isExportInProgress', 'false');
    });
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
    { label: '300', value: 300 },
    { label: '500', value: 500 }
  ];



  onPageLimitChange(event) {
    this.configuration.pageLimit = event.value
    this.configuration = JSON.parse(JSON.stringify(this.configuration));
    if (this.Grid && this.Grid.kendoGrid) {
      this.Grid.kendoGrid.skip = 0;
      // Extract fixed number of events without modifying the original array
      var limitedEvents = this.tableData.rows.events.slice(0, this.configuration.pageLimit);
      this.Grid.gridView.data = limitedEvents
    }
    this.cd.detectChanges();
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
        translatedHeader: colDef.headerName // Set initial value
      };
    });
    this.addTranslatedFilterValue();
    this.SelectColumnFilteredList.next(this.columnToSelected);
  }

  private addTranslatedFilterValue() {
    this.columnToSelected.forEach(column => {
      this.translate.get(column.headerName).subscribe(translatedData => {
        column.translatedHeader = translatedData || column.headerName; // Fallback to original
        // Trigger an update of the ReplaySubject after translation
        this.SelectColumnFilteredList.next(this.columnToSelected);
      });
    });
  }
  public transformChartData(data: TableOutputModel) {
    const tableData = new TableOutputModel();
    tableData.columns = [...data.columns];
    tableData.rows = data.rows;
    this.columnDefs = tableData.columns
    this.selectedColumnDefs = this.columnDefs;
    this.updateColumnSelection()
    this.configuration.length = tableData.rows.events.length;
    this.updateColumns()
    this.tableData = tableData;
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

  async exportKendo() {
    this.subscribeForNotifier();
    console.log(this.widgetRequestModel);
    this.chartingDataService.exportTableWidget(this.widgetRequestModel).subscribe(() => {
      this.progressNotifier = new exportReportModel();
    });
  }

  private async IsExportInProgress() {
    const data = await firstValueFrom(this.eventService.getExportStatus("widgetExport"));
    if (data.inProgress) {
      this.isExporting = true;
      localStorage.setItem('isExportInProgress', 'true');
      this.subscribeForNotifier();
      return true;
    } else {
      this.isExporting = false;
      localStorage.setItem('isExportInProgress', 'false');
      this.unsubscribeForNotifier();
      return false;
    }
  }

  async subscribeForNotifier() {
    // An earlier subscription may still be attached (reattached on load, or a rapid
    // second click). Assigning over the field would orphan it and leave two live
    // handlers reacting to the same export.
    this.exportSubjectSubscription?.unsubscribe();
    this.isExporting = true;
    this.exportSubjectSubscription = this.signalRService.$WidgetExportSubject.subscribe((data: exportReportModel) => {
      if (data) {
        switch (data.status) {
          case ExportStatus.Completed:
            window.open(data.filePath, '_blank');
            this.commonService.showSuccessToastr('Export file present in User logs.');
            this.finishExport();
            break;

          case ExportStatus.Cancelled:
            this.commonService.showWarningToastr('Export cancelled by the user.');
            this.finishExport();
            break;

          case ExportStatus.Failed:
            this.commonService.showErrorToastr(data.errorMessage);
            this.finishExport();
            break;

          case ExportStatus.Starting:
          case ExportStatus.Preparing:
          case ExportStatus.InProgress:
          case ExportStatus.Finalizing:
          case ExportStatus.Cancelling: {
            // Non-terminal: the export is still running, so do not tear down the subscription.
            // Shown on the progress notifier's status line rather than as a toast: these
            // transitions fire several times per export and toasts would stack up.
            this.exportStatusMessage = ExportProgress.message(data);
            break;
          }

          default: {
            // Every status is cased above, so this is unreachable. A newly added status narrows to
            // something other than never here and fails the build until it is handled explicitly.
            const exhaustiveCheck: never = data.status;
            break;
          }
        }
        this.progressNotifier = data;
      }
    }, () => {
      this.isExporting = false;
    });
  }

  /**
   * Tears down export UI state once the export reaches a terminal status.
   */
  private finishExport(): void {
    this.exportStatusMessage = null;
    this.isExporting = false;
    // this.logService.removeExportsFromDirectory().subscribe();
    this.unsubscribeForNotifier();
  }

  private unsubscribeForNotifier() {
    if (this.exportSubjectSubscription) {
      this.isExporting = false;
      this.exportSubjectSubscription.unsubscribe();
    }
  }

  cancelCallback = (): void => {
    this.showPopUp();
  };

  showPopUp() {
    this.dialog.closeAll();
    const modelData = {
      headerLeftSvg: 'assets/Outline/alert.svg',
      heading: 'Are you sure you want to stop exporting?',
      headerRightSvg: 'assets/Outline/x.svg',
      footerLeftButton: {
        name: 'Yes',
        class: 'i2v-btn medium primary-danger',
        Callback: () => {
          this.cancelExport();
        }
      },
      footerRightButton: {
        name: 'No',
        Callback: () => {
          this.dialog.closeAll();
        },
      }
    };
    const popComponentDialog = this.dialog.open(PopUpComponent, {
      data: modelData,
      panelClass: 'custom-dialog-container',
    });
  }

  cancelExport() {
    this.eventService.cancelExport("widgetExport").subscribe(() => {
      // Deliberately no teardown here: cancellation has only been *requested*. The export
      // keeps running until it unwinds, and its terminal Cancelled notification is what
      // closes the notifier. Tearing down now would hide the progress UI and drop the
      // subscription before that notification arrives.
    });
    this.dialog.closeAll();
  }
}
