import { DashboardType } from "Analytic/ClientApp/src/app/modules/dashboard/Enums/dashboard-enums"; 
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
