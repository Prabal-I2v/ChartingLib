import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Widget } from './Models/WidgetRequestModel';

@Injectable({
  providedIn: 'root'
})
export class ChartingDataService {

  constructor(private http: HttpClient) { }

  public getChartingData(requestModel : Widget): Observable<any> {
    return this.http.post("http://localhost:5012/dashboard/GetWidgetOutputModel", requestModel);
  }
}
