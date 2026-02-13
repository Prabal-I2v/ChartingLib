import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Widget } from "./Models/Widget";

// API Response interface matching your C# model
interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
  metadata?: { [key: string]: any };
}

@Injectable({
  providedIn: "root",
})
export class ChartingDataService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
  }

  /**
   * Get charting data with just the data payload (backward compatible)
   */
  public getChartingData(requestModel: Widget): Observable<any> {
    return this.http
      .post<ApiResponse<any>>("/api/Widget/GetWidgetOutputModel", requestModel)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.error || response.message || 'Failed to get charting data');
          }
          return response.data;
        }),
        catchError(this.handleError)
      );
  }

  exportTableWidget(widgetRequest: Widget): Observable<Blob> {
    return this.http.post(
      `/api/Widget/ExportWidget`,
      widgetRequest,
      { responseType: "blob" }
    );
  }

  /**
   * Enhanced error handler
   */
  private handleError = (error: any): Observable<never> => {
    let errorMessage = 'An error occurred while fetching charting data';
    let errorDetails: any = {};

    if (error.error) {
      // API returned an error response
      if (error.error.message) {
        errorMessage = error.error.message;
      }
      if (error.error.error) {
        errorDetails.serverError = error.error.error;
      }
      if (error.error.statusCode) {
        errorDetails.statusCode = error.error.statusCode;
      }
      errorDetails.timestamp = error.error.timestamp;
    } else if (error.message) {
      // Client-side or network error
      errorMessage = error.message;
    }

    // Log detailed error information
    console.error('ChartingDataService Error:', {
      message: errorMessage,
      details: errorDetails,
      originalError: error,
      timestamp: new Date().toISOString()
    });

    return throwError(() => new Error(errorMessage));
  };


}