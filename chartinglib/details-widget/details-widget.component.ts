// details-widget.component.ts
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-details-widget',
  templateUrl: './details-widget.component.html',
  styleUrls: ['./details-widget.component.scss']
})
export class DetailsWidgetComponent implements OnInit {
  @Input() commonWidgetCustomFilter: { [key: string]: any };
  resourceLength: number = 0;
  ngOnInit() {
    this.resourceLength = this.commonWidgetCustomFilter['Video Sources'].length
  }
}