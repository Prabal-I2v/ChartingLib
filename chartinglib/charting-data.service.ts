import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Widget } from "./Models/Widget";

@Injectable({
  providedIn: "root",
})
export class ChartingDataService {
  constructor(private http: HttpClient) {}

  public getChartingData(requestModel: Widget): Observable<any> {
    const url = window.location.href;
    const parsedUrl = new URL(url);
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}:${parsedUrl.port}`;

    return this.http.post(
      `${baseUrl}/api/dashboard/GetWidgetOutputModel`,
      requestModel,
    );
  }
}
