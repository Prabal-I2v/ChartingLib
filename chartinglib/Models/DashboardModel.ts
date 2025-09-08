import { DashboardType } from "src/app/modules/dashboard/Models/dashboard.model";
import { Widget } from "./Widget";

export class dashboard {
  id: string;
  // analyticManagerId: string;
  widgets: Widget[];
  priority: number;
  description: string
  name: string;
  Dashboardtype: DashboardType
}
