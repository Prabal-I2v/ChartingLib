// types.ts - Contains common interfaces and type definitions
import { GridStackWidget } from "gridstack";
import { EventPropertyType } from "src/app/Models/eventPropertyType.model";
import { Enum_Entity, Enum_Schema } from "../enums/enums";
import { OneDimensionWidgetConstructorProps, TwoDimensionWidgetConstructorProps, ThreeDimensionWidgetConstructorProps, NoDimensionWidgetConstructorProps } from "../Widget";
import { ITimeRange } from "../interfaces/interfaces";

export class CustomFilterValueModel {
  displayName: string;
  returnValue: string | ITimeRange | number | boolean;
}


// Rules and conditions
export class RuleSet {
  constructor() { }
  condition: string = "";
  rules: Array<Rule> = new Array<Rule>();
  ruleSet: Array<RuleSet> = new Array<RuleSet>();
}

export class Rule {
  field: string;
  operator: string;
  value: string;
  type: EventPropertyType;
}

// Widget tile configuration
export class WidgetTileConf implements GridStackWidget {
  id?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  initialMinHeight?: number;
  initialMaxHeight?: number;
  initialMinWidth?: number;
  initialMaxWidth?: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  noResize?: boolean;
  noMove?: boolean;
  locked?: boolean;
  content?: string;
  lazyLoad?: boolean;
  sizeToContent?: boolean | number;
  resizeToContentParent?: string;
  subGridOpts?: any;
  autoPosition?: boolean;
}

// Columns and range configurations
export class ColumnClubInRange {
  columnNameForRange: string;
  range: ColumnRange[]
}

export class ColumnRange {
  rangeName: string;
  condition: ColumnRangeCondition
}

export class ColumnRangeCondition {
  greaterThan: string;
  lessThan: string;
  type: EventPropertyType;
}

export class groupByConf {
  name: string;
  type: EventPropertyType;
  projectionName?: string;
  subColumnName?: string;
  isTime?: boolean = false;
}

// Union type for all widget constructor props
export type WidgetConstructorProps =
  OneDimensionWidgetConstructorProps |
  TwoDimensionWidgetConstructorProps |
  ThreeDimensionWidgetConstructorProps | NoDimensionWidgetConstructorProps;
