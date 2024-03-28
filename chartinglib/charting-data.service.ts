import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WidgetRequestModel } from './Models/WidgetRequestModel';
import { ChartType } from './chartingUtility';

@Injectable({
  providedIn: 'root'
})
export class ChartingDataService {

  constructor(private http: HttpClient) { }

  public  getChartingData(requestModel : WidgetRequestModel): Observable<any> {
    return this.http.post("http://localhost:5012/dashboard/GetWidgetOutputModel", requestModel);
  }

  public tranformData(data){
    var chartData=[];
    if(data.widgetType==ChartType.Pie){
     data.Labels.array.forEach((element,i) => {
       chartData.push({element:data.Data[0][i]})
     });
    }
    if(data.widgetType==ChartType.Bar){
      chartData.push({"Labels":data.Labels});
      chartData.push({"data":data.Data});
     }

    return chartData;
  }
}
