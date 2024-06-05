import { Component, Input } from "@angular/core";

interface Query {
  measures?: string[];
  dimensions?: string[];
  order?: object;
  filters?: object[];
  limit?: number;
}

@Component({
  selector: "charting-lib",
  templateUrl: "./chartinglib.component.html",
  styleUrls: ["./chartinglib.component.scss"],
})
export class ChartingComponent {
  title = "charting";
}
