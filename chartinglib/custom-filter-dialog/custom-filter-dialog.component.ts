import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { I2vChartHeaderComponent } from '../i2v-chart-header/i2v-chart-header.component';

@Component({
  selector: 'app-custom-filter-dialog',
  templateUrl: './custom-filter-dialog.component.html',
  styleUrl: './custom-filter-dialog.component.css'
})
export class CustomFilterDialogComponent {
  dateRange: Date[];
  timeFilterValue: string;
  refreshIntervalValue: number;
  selectedCustomFilterkey: string;
  selectedFilterValues: string[] = [];
  customFilters: any;
  timeFilter: string[];
  refreshInterval: any[];
  customFilterKeys: string[];
  enableCustomTime: boolean = false;
  disableTimeFilter: boolean;
  showTimeDurationFilter: boolean = false;
  private parentComponent: I2vChartHeaderComponent;
  readonly timePeriodOptions = ["Month", "Week", "Year", "Day"];
  constructor(
    public dialogRef: MatDialogRef<CustomFilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.parentComponent = data.event.data.parentComponent;
    Object.assign(this, data.event.data);
  }

  onTimeChange(event: any): void {
    const tempEvent = { value: event.value };
    this.timeFilterValue = event.value;
    this.enableCustomTime = event.value === 'Custom';
  }

  onCustomTimeSelected(): void {
    // Just store the values, don't call parent yet
  }

  setIntervalTime(event: any): void {
    this.refreshIntervalValue = event.value;
  }

  onCustomFilterKeyChange(event: any): void {
    this.selectedCustomFilterkey = event.value;
    if (this.selectedCustomFilterkey in this.customFilters) {
      this.selectedFilterValues = this.customFilters[this.selectedCustomFilterkey]
        .map(x => String(x.returnValue));
    } else {
      this.selectedFilterValues = [];
    }
  }

  onCustomFilterValuesChange(event: any): void {
    this.selectedFilterValues = event?.value || [];
  }

  applyFilters(): void {
    // Apply all changes at once when save is clicked
    this.parentComponent.timeFilterValue = this.timeFilterValue;
    this.parentComponent.enableCustomTime = this.enableCustomTime;
    this.parentComponent.dateRange = this.dateRange;
    this.parentComponent.selectedCustomFilterkey = this.selectedCustomFilterkey;
    this.parentComponent.selectedCustomFilterValue = this.selectedFilterValues;
    
    // Trigger necessary updates in parent
    this.parentComponent.onTimeChange({ value: this.timeFilterValue });
    if (this.enableCustomTime) {
      this.parentComponent.onCustomTimeSelected();
    }
    // this.parentComponent.setIntervalTime({ value: this.refreshIntervalValue });
    this.parentComponent.onCustomFilterKeyChange({ value: this.selectedCustomFilterkey });
    this.parentComponent.onCustomFilterValuesChange({ value: this.selectedFilterValues });
    this.parentComponent.setIntervalTime({ value: this.refreshIntervalValue });

    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  clearFilters(): void {
    this.parentComponent.clearCustomFilters();
    this.dialogRef.close();
  }

  onTimeDurationChange($event: any) {
    this.parentComponent.onTimeDurationChange($event);
  }
}
