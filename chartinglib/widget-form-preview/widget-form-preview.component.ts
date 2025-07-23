import { AfterViewInit, Component, Inject } from '@angular/core';
import { Widget } from '../Models/Widget';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Enum_WidgetType } from '../Models/enums/enums';
import { Subject } from 'rxjs';

export interface IWidgetFormPreviewDataRequestModel {
  widget: Widget
}

@Component({
  selector: 'app-widget-form-preview',
  templateUrl: './widget-form-preview.component.html',
  styleUrl: './widget-form-preview.component.css'
})

export class WidgetFormPreviewComponent implements AfterViewInit {
  widget: Widget;
  protected refreshCallSubject = new Subject<any>();
  public readonly Enum_WidgetType = Enum_WidgetType
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WidgetFormPreviewComponent>) {
    this.widget = this.data.event.data
  }

  ngAfterViewInit()
  {
      this.refreshCallSubject.next(null);
  }
  
  Close() {
    this.dialogRef.close();
  }

}
