// types.ts - Contains common interfaces and type definitions
import { GridStackWidget } from "gridstack";
import { EventPropertyType } from "src/app/Models/eventPropertyType.model";
import { Enum_Entity, Enum_Schema, Enum_WidgetType, WidgetDimension } from "../enums/enums";
import { OneDimensionWidgetConstructorProps, TwoDimensionWidgetConstructorProps, ThreeDimensionWidgetConstructorProps } from "../dimension-widgets";


// Filter types
export class ICustomFilter {
  [key: string]: CustomFilterValueModel[];
}

export interface ICustomFilterKeyModel {
  displayName: string;
  returnValue: string;
}

export class CustomFilterValueModel {
  displayName: string;
  returnValue: string | ITimeRange | number | boolean;
}

export interface ITimeRange {
  startTime: number; // Unix timestamp in milliseconds
  endTime: number; // Unix timestamp in milliseconds
}

// Filter output models
export interface ISetIntervalFilterOutputEmittorModel {
  key: string;
  value: number;
}

export interface IDateTimeFilterOutputEmittorModel {
  key: string;
  value: ITimeRange;
}

export interface ICustomFilterOutputEmittorModel {
  key: string;
  value: string[];
}

export interface ICommonFilterOutputEmittorModel {
  [key: string]:
  | ISetIntervalFilterOutputEmittorModel
  | IDateTimeFilterOutputEmittorModel
  | ICustomFilterOutputEmittorModel;
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
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  initialMinH?: number;
  initialMaxH?: number;
  initialMinW?: number;
  initialMaxW?: number;
  autoPosition?: boolean;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  noResize?: boolean;
  noMove?: boolean;
  locked?: boolean;
  id?: string;
  content?: string;
  lazyLoad?: boolean;
  sizeToContent?: boolean | number;
  resizeToContentParent?: string;
  subGridOpts?: any;
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

// Join entities
export class JoinableEntity {
  entity: Enum_Entity;
  joinOn: string;
  joinWith: string;
  schema: Enum_Schema;
  properties: JoinableEntityProperty[];
}

export class JoinableEntityProperty {
  name: string;
  displayName: string;
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
  ThreeDimensionWidgetConstructorProps;