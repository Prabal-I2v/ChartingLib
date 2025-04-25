import { ColumnModel } from "src/app/Models/columns.model";

export class TableOutputModel {
    columns: ColumnModel[];
    rows: TableRow;
}

export class TableRow {
  events: any[]; // Using 'any' to match C# 'object'
}
