import { DashboardType } from "Analytic/ClientApp/src/app/modules/dashboard/Enums/dashboard-enums"; 
import { Widget } from "./Widget";

export class dashboard {
  id: string;
  // analyticManagerId: string;
  widgets: Widget[];
  priority: number;
  description: string
  name: string;
  Dashboardtype: DashboardType;
  globalFilterConfig?: GlobalFilterConfig | null;
}

export interface GlobalFilterConfig {
  timeRange: ITimeRange;
  refreshInterval: number;
  videoSources: string[];
  applyToAll: boolean;
}

export interface ITimeRange {
  displayName: string;
  startTime: number;
  endTime: number;
}

export interface Filter {
  timeRange: ITimeRange;
  refreshInterval: number;
  videoSources: string[]; // array of videoSource IDs
}