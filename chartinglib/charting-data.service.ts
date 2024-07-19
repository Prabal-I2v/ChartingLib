import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Widget } from "./Models/WidgetRequestModel";

@Injectable({
  providedIn: "root",
})
export class ChartingDataService {
  constructor(private http: HttpClient) {}

  public getChartingData(requestModel: Widget): Observable<any> {
    const url = window.location.href;
    let parsedUrl = new URL(url);
    parsedUrl.port = "5012"
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}:${parsedUrl.port}`;

    return this.http.post(
      `${baseUrl}/dashboard/GetWidgetOutputModel`,
      requestModel,
    );
  }
}
