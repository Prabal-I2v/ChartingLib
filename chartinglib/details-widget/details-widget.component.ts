// details-widget.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-details-widget',
  templateUrl: './details-widget.component.html',
  styleUrls: ['./details-widget.component.scss']
})
export class DetailsWidgetComponent {
  @Input() commonWidgetCustomFilter: { [key: string]: any };
}