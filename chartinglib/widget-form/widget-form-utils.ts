// widget-form-utils.ts - Refactored and optimized

import { EventPropertyType } from "src/app/Models/eventPropertyType.model";
import {
  Enum_Method,
  Enum_Method_Aggregation,
  Enum_Schema,
  Enum_TimePeriod,
  widgetTypeDimensionMap,
  Enum_WidgetType,
  WidgetDimension,
} from "../Models/enums/enums";
import {
  IOneDimensionDataInputConfig,
  IThreeDimensionDataInputConfig,
  ITwoDimensionDataInputConfig,
  IWidgetFieldNameConfig,
} from "../Models/interfaces/interfaces";
import { WidgetTileConf } from "../Models/types/types";
import { AnalyticEventModel } from "src/app/Models/analyticEvent.Model";

// ===== TYPE DEFINITIONS =====
export interface EntityOption {
  value: string;
  label: string;
  schema: Enum_Schema;
}

export interface DropdownOption<T = any> {
  value: T;
  label: string;
}

export interface OperatorConfig {
  [key: number]: string[];
}

export interface ValidationRule {
  validator: (value: any) => ValidationResult;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  errors?: string[];
}

// ===== OPERATOR CONFIGURATIONS =====
export const RuleOperators: OperatorConfig = {
  [EventPropertyType.Float]: [
    "Equal",
    "NotEqual",
    "GreaterThan",
    "SmallerThan",
  ],
  [EventPropertyType.Integer]: [
    "Equal",
    "NotEqual",
    "GreaterThan",
    "SmallerThan",
  ],
  [EventPropertyType.String]: ["Equal", "NotEqual", "Contains", "NotContains"],
  [EventPropertyType.Guid]: ["Equal", "NotEqual", "Contains", "NotContains"],
  [EventPropertyType.SingleSelect]: ["Equal", "NotEqual"],
  [EventPropertyType.Boolean]: ["Equal"],
  [EventPropertyType.Date]: ["Equal", "NotEqual", "GreaterThan", "SmallerThan"],
  [EventPropertyType.MultiSelect]: ["Equal", "NotEqual"],
};

// ===== AGGREGATION METHOD OPTIONS =====
export const singleEntityAggregationMethods: DropdownOption<Enum_Method>[] = [
  { value: Enum_Method.Count, label: "Count" },
  { value: Enum_Method.Sum, label: "Sum" },
  { value: Enum_Method.Average, label: "Average" },
];

export const multipleEntitiesAggregationMethods: DropdownOption<Enum_Method>[] =
  [{ value: Enum_Method.Count, label: "Count" }];

export const fieldsAggregationMethods: DropdownOption<Enum_Method_Aggregation>[] =
  [
    { value: Enum_Method_Aggregation.None, label: "None" },
    { value: Enum_Method_Aggregation.Total, label: "Total" },
    { value: Enum_Method_Aggregation.Least, label: "Least" },
    { value: Enum_Method_Aggregation.Greatest, label: "Greatest" },
  ];

export const seriesAggregationOptions: DropdownOption<Enum_Method_Aggregation>[] =
  [
    { value: Enum_Method_Aggregation.None, label: "None" },
    { value: Enum_Method_Aggregation.Total, label: "Total" },
    { value: Enum_Method_Aggregation.Least, label: "Least" },
    { value: Enum_Method_Aggregation.Greatest, label: "Greatest" },
  ];

// ===== ENTITY TYPE OPTIONS =====
export const entityTypes: DropdownOption<Enum_Schema>[] = [
  { label: "Events", value: Enum_Schema.Events },
  { label: "Resource", value: Enum_Schema.Public },
];

// ===== TIME GROUPING OPTIONS =====
export const timeGroupingOptions: DropdownOption<Enum_TimePeriod>[] = [
  { label: "Hour", value: Enum_TimePeriod.hour },
  { label: "Day", value: Enum_TimePeriod.day },
  { label: "Week", value: Enum_TimePeriod.week },
  { label: "Month", value: Enum_TimePeriod.month },
  { label: "Year", value: Enum_TimePeriod.year },
];

// ===== GROUP BY TYPE OPTIONS =====
export const groupByTypes: DropdownOption<string>[] = [
  { label: "Field", value: "field" },
  { label: "Time", value: "time" },
];

// ===== ENTITY DEFINITIONS =====
// const EVENT_ENTITIES: EntityOption[] = [
//   {
//     value: Enum_Entity.Highway_ATCC,
//     label: "Highway_ATCC",
//     schema: Enum_Schema.Events,
//   },
//   {
//     value: Enum_Entity.Vehicle_Stopped,
//     label: "Vehicle_Stopped",
//     schema: Enum_Schema.Events,
//   },
//   { value: Enum_Entity.ANPR, label: "ANPR", schema: Enum_Schema.Events },
//   {
//     value: Enum_Entity.Wrong_Way_Detected,
//     label: "Wrong Way Detected",
//     schema: Enum_Schema.Events,
//   },
//   {
//     value: Enum_Entity.Human_Crossing_Road,
//     label: "Human Crossing Road",
//     schema: Enum_Schema.Events,
//   },
//   {
//     value: Enum_Entity.Reverse_Traffic_Detected,
//     label: "Reverse Traffic Detected",
//     schema: Enum_Schema.Events,
//   },
//   {
//     value: Enum_Entity.Lane_Changed,
//     label: "Lane Changed",
//     schema: Enum_Schema.Events,
//   },
//   {
//     value: Enum_Entity.Illegal_Vehicle,
//     label: "Illegal Vehicle",
//     schema: Enum_Schema.Events,
//   },
//   {
//     value: Enum_Entity.Safe_Distance_Violated,
//     label: "Safe Distance Violated",
//     schema: Enum_Schema.Events,
//   },
//   // { value: Enum_Entity.Safety_Gear_Violation, label: 'Safety Gear Violation', schema: Enum_Schema.Events },
//   {
//     value: Enum_Entity.Intrusion_Detected,
//     label: "Intrusion Detected",
//     schema: Enum_Schema.Events,
//   },
//   {
//     value: Enum_Entity.Human_Detected,
//     label: "Human Detected",
//     schema: Enum_Schema.Events,
//   },
//   {
//     value: Enum_Entity.Deacceleration_Detected,
//     label: "Deacceleration Detected",
//     schema: Enum_Schema.Events,
//   },
//   {
//     value: Enum_Entity.Vehicle_Accelerated,
//     label: "Vehicle Accelerated",
//     schema: Enum_Schema.Events,
//   },
//   {
//     value: Enum_Entity.Vehicle_Occupancy,
//     label: "Vehicle Occupancy",
//     schema: Enum_Schema.Events,
//   },
//   {
//     value: Enum_Entity.Fire_Detected,
//     label: "Fire Detected",
//     schema: Enum_Schema.Events,
//   },
//   {
//     value: Enum_Entity.Smoke_Detected,
//     label: "Smoke Detected",
//     schema: Enum_Schema.Events,
//   },
//   {
//     value: Enum_Entity.Abandoned_Object_Detected,
//     label: "Abandoned Object Detected",
//     schema: Enum_Schema.Events,
//   },
//   {
//     value: Enum_Entity.Face_Recognition,
//     label: "Face Recognition",
//     schema: Enum_Schema.Events,
//   },
//   {
//     value: Enum_Entity.Server_Status,
//     label: "Server Status",
//     schema: Enum_Schema.Events,
//   },
//   {
//     value: Enum_Entity.Pipeline_State,
//     label: "Pipeline State",
//     schema: Enum_Schema.Events,
//   },
//   {
//     value: Enum_Entity.DEVICE_CONNECTED,
//     label: "Device Connected",
//     schema: Enum_Schema.Events,
//   },
//   {
//     value: Enum_Entity.DEVICE_DISCONNECTED,
//     label: "Device Disconnected",
//     schema: Enum_Schema.Events,
//   },
//    {
//     value: Enum_Entity.Object_Entered,
//     label: "Device Disconnected",
//     schema: Enum_Schema.Events,
//   },
//    {
//     value: Enum_Entity.Object_Exit,
//     label: "Device Disconnected",
//     schema: Enum_Schema.Events,
//   },
// ];


export const PUBLIC_ENTITIES: EntityOption[] = [
  {
    value: "VideoSources",
    label: "Video Sources",
    schema: Enum_Schema.Public,
  },
  { value: "Persons", label: "Persons", schema: Enum_Schema.Public },
  {
    value: "FacePoint",
    label: "Face Point",
    schema: Enum_Schema.Public,
  },
];

// ===== WIDGET FORM UTILITIES CLASS =====
export class WidgetFormUtils {

 static createEventEntities(analytics: AnalyticEventModel[]): EntityOption[] {
  return analytics.map((entity: any) => ({
    value: entity.name,
    label: entity.name,
    schema: Enum_Schema.Events
  }));
}


  /**
   * Get operators for a specific property type
   */
  static getOperatorsByType(type: EventPropertyType): string[] {
    return RuleOperators[type] || ["Equal", "NotEqual"];
  }

  /**
   * Process default values for property types
   */
  static processDefaultValues(
    propertyName: string,
    options: string | any[],
    type: EventPropertyType
  ): string[] | null {
    // Handle string options
    if (typeof options === "string") {
      return options.includes(",")
        ? options.split(",").map((value) => value.trim())
        : [options.trim()];
    }

    // Handle boolean type
    if (type === EventPropertyType.Boolean) {
      return ["true", "false"];
    }

    // Handle array options
    if (Array.isArray(options)) {
      return options;
    }

    return null;
  }

  /**
   * Validate aggregation method compatibility with entity type
   */
  static isValidAggregationMethod(
    method: Enum_Method,
    entityConfigType: "single" | "multiple"
  ): boolean {
    if (entityConfigType === "multiple") {
      return multipleEntitiesAggregationMethods.some((m) => m.value === method);
    }
    return singleEntityAggregationMethods.some((m) => m.value === method);
  }

  /**
   * Get compatible properties for aggregation method
   */
  static getCompatibleProperties(
    properties: any[],
    method: Enum_Method
  ): any[] {
    if (this.isNumericAggregationMethod(method)) {
      return properties.filter(
        (prop) =>
          (prop.type === EventPropertyType.Float || prop.type === EventPropertyType.Boolean ||
            prop.type === EventPropertyType.Integer) &&
          prop.filterable
      );
    }

    // For Count or other methods, return string properties
    return properties.filter(
      (prop) =>
        (prop.type === EventPropertyType.String ||
          prop.type === EventPropertyType.Guid) &&
        prop.filterable
    );
  }

  /**
   * Check if aggregation method requires numeric properties
   */
  static isNumericAggregationMethod(method: Enum_Method): boolean {
    return [Enum_Method.Sum, Enum_Method.Average].includes(method);
  }

  /**
   * Check if property is time-based
   */
  static isTimeProperty(property: any): boolean {
    return (
      property?.type === EventPropertyType.Date ||
      property?.type === EventPropertyType.DateTime
    );
  }

  /**
   * Check if property type is numeric
   */
  static isNumericProperty(type: EventPropertyType): boolean {
    return (
      type === EventPropertyType.Float || type === EventPropertyType.Integer
    );
  }

  /**
   * Check if property type is string-based
   */
  static isStringProperty(type: EventPropertyType): boolean {
    return type === EventPropertyType.String;
  }

  /**
   * Generate a simple UUID
   */
  static generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  /**
   * Capitalize first letter of a string
   */
  static capitalizeFirst(str: string): string {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
  }

  /**
   * Convert string to title case
   */
  static toTitleCase(str: string): string {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  /**
   * Get current day start timestamp
   */
  static getCurrentDayStart(): number {
    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0
    ).getTime();
  }

  /**
   * Get current day end timestamp
   */
  static getCurrentDayEnd(): number {
    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    ).getTime();
  }

  /**
   * Validate form field value
   */
  static validateField(value: any, rules: ValidationRule[]): ValidationResult {
    const errors: string[] = [];

    for (const rule of rules) {
      const result = rule.validator(value);
      if (!result.isValid) {
        errors.push(result.message || "Validation failed");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get nested object property safely
   */
  static getNestedProperty(obj: any, path: string): any {
    return path.split(".").reduce((current, prop) => current?.[prop], obj);
  }

  /**
   * Set nested object property safely
   */
  static setNestedProperty(obj: any, path: string, value: any): void {
    const keys = path.split(".");
    const lastKey = keys.pop();

    if (!lastKey) return;

    const target = keys.reduce((current, key) => {
      if (!current[key] || typeof current[key] !== "object") {
        current[key] = {};
      }
      return current[key];
    }, obj);

    target[lastKey] = value;
  }

  /**
   * Check if value is empty (null, undefined, empty string, empty array)
   */
  static isEmpty(value: any): boolean {
    return (
      value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === "object" && Object.keys(value).length === 0)
    );
  }

  /**
   * Remove empty values from object
   */
  static removeEmptyValues(obj: any): any {
    const cleaned: any = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key) && !this.isEmpty(obj[key])) {
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
          const nestedCleaned = this.removeEmptyValues(obj[key]);
          if (!this.isEmpty(nestedCleaned)) {
            cleaned[key] = nestedCleaned;
          }
        } else {
          cleaned[key] = obj[key];
        }
      }
    }

    return cleaned;
  }

  /**
   * Create a safe property accessor function
   */
  static createPropertyAccessor(path: string): (obj: any) => any {
    const keys = path.split(".");
    return (obj: any) => {
      let current = obj;
      for (const key of keys) {
        if (current == null) return undefined;
        current = current[key];
      }
      return current;
    };
  }

  /**
   * Compare two objects for equality (shallow)
   */
  static isEqual(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) return true;
    if (obj1 == null || obj2 == null) return false;
    if (typeof obj1 !== typeof obj2) return false;

    if (typeof obj1 === "object") {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);

      if (keys1.length !== keys2.length) return false;

      for (const key of keys1) {
        if (!keys2.includes(key) || obj1[key] !== obj2[key]) {
          return false;
        }
      }

      return true;
    }

    return obj1 === obj2;
  }

  /**
   * Sort array of objects by property
   */
  static sortByProperty<T>(
    array: T[],
    property: keyof T,
    ascending: boolean = true
  ): T[] {
    return [...array].sort((a, b) => {
      const aVal = a[property];
      const bVal = b[property];

      if (aVal < bVal) return ascending ? -1 : 1;
      if (aVal > bVal) return ascending ? 1 : -1;
      return 0;
    });
  }

  /**
   * Group array of objects by property
   */
  static groupByProperty<T>(
    array: T[],
    property: keyof T
  ): { [key: string]: T[] } {
    return array.reduce((groups, item) => {
      const key = String(item[property]);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {} as { [key: string]: T[] });
  }

  /**
   * Filter array by multiple criteria
   */
  static filterByCriteria<T>(
    array: T[],
    criteria: { [key in keyof T]?: any }
  ): T[] {
    return array.filter((item) => {
      return Object.entries(criteria).every(([key, value]) => {
        if (value == null) return true;
        return item[key as keyof T] === value;
      });
    });
  }
}

// ===== VALIDATION RULES CLASS =====
export class ValidationRules {
  static required(message: string = "This field is required"): ValidationRule {
    return {
      validator: (value: any) => ({
        isValid: !WidgetFormUtils.isEmpty(value),
        message,
      }),
    };
  }

  static minLength(min: number, message?: string): ValidationRule {
    return {
      validator: (value: string) => ({
        isValid: !value || value.length >= min,
        message: message || `Minimum length is ${min} characters`,
      }),
    };
  }

  static maxLength(max: number, message?: string): ValidationRule {
    return {
      validator: (value: string) => ({
        isValid: !value || value.length <= max,
        message: message || `Maximum length is ${max} characters`,
      }),
    };
  }

  static pattern(
    regex: RegExp,
    message: string = "Invalid format"
  ): ValidationRule {
    return {
      validator: (value: string) => ({
        isValid: !value || regex.test(value),
        message,
      }),
    };
  }

  static email(message: string = "Invalid email format"): ValidationRule {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return this.pattern(emailRegex, message);
  }

  static numeric(message: string = "Must be a number"): ValidationRule {
    return {
      validator: (value: any) => ({
        isValid: value === "" || value === null || !isNaN(Number(value)),
        message,
      }),
    };
  }

  static range(min: number, max: number, message?: string): ValidationRule {
    return {
      validator: (value: number) => {
        const num = Number(value);
        return {
          isValid: isNaN(num) || (num >= min && num <= max),
          message: message || `Value must be between ${min} and ${max}`,
        };
      },
    };
  }

  static minValue(min: number, message?: string): ValidationRule {
    return {
      validator: (value: number) => {
        const num = Number(value);
        return {
          isValid: isNaN(num) || num >= min,
          message: message || `Value must be at least ${min}`,
        };
      },
    };
  }

  static maxValue(max: number, message?: string): ValidationRule {
    return {
      validator: (value: number) => {
        const num = Number(value);
        return {
          isValid: isNaN(num) || num <= max,
          message: message || `Value must be at most ${max}`,
        };
      },
    };
  }

  static arrayMinLength(min: number, message?: string): ValidationRule {
    return {
      validator: (value: any[]) => ({
        isValid: !Array.isArray(value) || value.length >= min,
        message: message || `Must select at least ${min} item(s)`,
      }),
    };
  }

  static arrayMaxLength(max: number, message?: string): ValidationRule {
    return {
      validator: (value: any[]) => ({
        isValid: !Array.isArray(value) || value.length <= max,
        message: message || `Cannot select more than ${max} item(s)`,
      }),
    };
  }

  static custom(
    validator: (value: any) => boolean,
    message: string
  ): ValidationRule {
    return {
      validator: (value: any) => ({
        isValid: validator(value),
        message,
      }),
    };
  }
}

// ===== CONSTANTS =====
export const WIDGET_FORM_CONSTANTS = {
  DEFAULT_COLORS: [
    "#0d6efd",
    "#6c757d",
    "#198754",
    "#dc3545",
    "#ffc107",
    "#0dcaf0",
    "#6f42c1",
    "#fd7e14",
    "#20c997",
    "#e83e8c",
    "#6610f2",
    "#fd6c9e",
  ],

  DEFAULT_DIMENSIONS: {
    w: 4,
    h: 4,
    x: 0,
    y: 0,
    minW: 4,
    minH: 4,
    initialMinHeight: 4,
    initialMinWidth: 4
  } as WidgetTileConf,

  STEP_VALIDATION_DEBOUNCE: 300,
  FORM_FIELD_DEBOUNCE: 500,

  MIN_WIDGET_TITLE_LENGTH: 1,
  MAX_WIDGET_TITLE_LENGTH: 100,

  MIN_PAGE_LIMIT: 1,
  MAX_PAGE_LIMIT: 100,
  DEFAULT_PAGE_LIMIT: 10,

  MAX_ENTITY_SELECTION: 10,
  MAX_PROPERTY_SELECTION: 20,

  DEBOUNCE_DELAYS: {
    SEARCH: 300,
    VALIDATION: 500,
    AUTO_SAVE: 2000,
  },
} as const;

// ===== ERROR MESSAGES =====
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: "This field is required",
  INVALID_WIDGET_TYPE: "Please select a valid widget type",
  INVALID_ENTITY: "Please select at least one entity",
  INVALID_PROPERTIES: "Please select at least one property",
  INVALID_TITLE: "Widget title is required",
  INVALID_PAGE_LIMIT: "Page limit must be between 1 and 100",
  INVALID_AGGREGATION: "Selected aggregation method is not compatible",
  FORM_VALIDATION_FAILED:
    "Please complete all required fields before submitting",
  WIDGET_CREATION_FAILED:
    "Failed to create widget. Please check your configuration.",
  CONFIGURATION_INVALID: "Widget configuration is invalid",
  NETWORK_ERROR: "Network error occurred. Please try again.",
  PERMISSION_DENIED: "You do not have permission to perform this action",
  DATA_LOAD_FAILED: "Failed to load data. Please refresh and try again.",
  UNSUPPORTED_BROWSER:
    "This browser is not supported. Please use a modern browser.",
  SESSION_EXPIRED: "Your session has expired. Please log in again.",
} as const;

// ===== SUCCESS MESSAGES =====
export const SUCCESS_MESSAGES = {
  WIDGET_CREATED: "Widget created successfully!",
  WIDGET_UPDATED: "Widget updated successfully!",
  WIDGET_DELETED: "Widget deleted successfully!",
  FORM_RESET: "Form has been reset to default values",
  CONFIGURATION_SAVED: "Configuration saved successfully",
  DATA_LOADED: "Data loaded successfully",
  VALIDATION_PASSED: "All validations passed",
} as const;

// ===== INFO MESSAGES =====
export const INFO_MESSAGES = {
  LOADING_DATA: "Loading data...",
  SAVING_CONFIGURATION: "Saving configuration...",
  VALIDATING_FORM: "Validating form...",
  PROCESSING_REQUEST: "Processing request...",
  GROUP_BY_DISABLED:
    "Group By 2 is automatically disabled when multiple fields are selected",
  ADVANCED_MODE_INFO: "Advanced mode provides additional configuration options",
  SIMPLE_MODE_INFO: "Simple mode hides advanced configuration options",
} as const;

// ===== HELPER FUNCTIONS =====

/**
 * Get aggregation methods based on entity type
 */
export function getAggregationMethodsByEntityType(
  entityConfigType: "single" | "multiple"
): DropdownOption<Enum_Method>[] {
  return entityConfigType === "single"
    ? singleEntityAggregationMethods
    : multipleEntitiesAggregationMethods;
}

/**
 * Check if widget type supports specific configuration
 */
export function supportsWidgetSpecificConfig(widgetType: any): boolean {
  const supportedTypes = ["KPI1D", "KPI2D", "Donut1D", "Donut2D", "Table"];

  return supportedTypes.some((type) => widgetType?.toString().includes(type));
}

/**
 * Get default configuration for widget type
 */
export function getDefaultWidgetConfig(widgetType: any): any {
  const defaults: { [key: string]: any } = {
    KPI1D: {
      CountValueColumnName: "count",
      DisplayValueColumnName: "displayValue",
      ImageColumnName: "",
      seriesAggregation: Enum_Method_Aggregation.None,
      showChart: false,
    },
    KPI2D: {
      CountValueColumnName: "count",
      DisplayValueColumnName: "displayValue",
      ImageColumnName: "",
      seriesAggregation: Enum_Method_Aggregation.None,
      showChart: false,
    },
    Donut1D: {
      resultLabel: "Result",
      seriesAggregation: Enum_Method_Aggregation.Greatest,
      showSeriesLabelValue: true,
    },
    Donut2D: {
      resultLabel: "Result",
      seriesAggregation: Enum_Method_Aggregation.Greatest,
      showSeriesLabelValue: true,
    },
    Table: {
      pagination: true,
      pageLimit: WIDGET_FORM_CONSTANTS.DEFAULT_PAGE_LIMIT,
      pageNumber: 1,
    },
  };

  for (const [key, config] of Object.entries(defaults)) {
    if (widgetType?.toString().includes(key)) {
      return config;
    }
  }

  return {};
}

/**
 * Validate widget configuration compatibility
 */
export function validateWidgetCompatibility(
  widgetType: Enum_WidgetType,
  dataInputConfig:
    | IOneDimensionDataInputConfig
    | ITwoDimensionDataInputConfig
    | IThreeDimensionDataInputConfig
): ValidationResult {
  const errors: string[] = [];
  const dimension = widgetTypeDimensionMap[widgetType];

  //three dimension validations
  if (dimension == WidgetDimension.ThreeDimensional) {
    if (!(dataInputConfig as IThreeDimensionDataInputConfig).groupBy2)
      errors.push("3D widgets require both Group By 1 and Group By 2");

    if (
      (dataInputConfig as IThreeDimensionDataInputConfig).fieldNames?.length >
      1 &&
      (dataInputConfig as IThreeDimensionDataInputConfig)
        .fieldsAggregationType == null
    )
      errors.push(
        "With Both group by's select either one field or use field Aggregation Type"
      );
  }

  if (dimension == WidgetDimension.TwoDimensional) {
    if (!(dataInputConfig as ITwoDimensionDataInputConfig).groupBy1)
      errors.push("2D widgets require at least Group By 1");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Create form validation summary
 */
export function createValidationSummary(validationResults: {
  [key: string]: ValidationResult;
}): ValidationResult {
  const allErrors: string[] = [];
  let isValid = true;

  for (const [field, result] of Object.entries(validationResults)) {
    if (!result.isValid) {
      isValid = false;
      if (result.errors) {
        allErrors.push(...result.errors.map((error) => `${field}: ${error}`));
      } else if (result.message) {
        allErrors.push(`${field}: ${result.message}`);
      }
    }
  }

  return {
    isValid,
    errors: allErrors,
  };
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: string[]): string {
  if (errors.length === 0) return "";
  if (errors.length === 1) return errors[0];

  return `Multiple errors found:\n${errors
    .map((error, index) => `${index + 1}. ${error}`)
    .join("\n")}`;
}

/**
 * Check if form data has unsaved changes
 */
export function hasUnsavedChanges(
  currentData: any,
  originalData: any
): boolean {
  return !WidgetFormUtils.isEqual(
    WidgetFormUtils.removeEmptyValues(currentData),
    WidgetFormUtils.removeEmptyValues(originalData)
  );
}

/**
 * Generate form field ID
 */
export function generateFieldId(prefix: string, fieldName: string): string {
  return `${prefix}_${fieldName.replace(/[^a-zA-Z0-9]/g, "_")}`;
}

/**
 * Create form field configuration
 */
export function createFieldConfig(
  type: string,
  label: string,
  options: Partial<{
    required: boolean;
    placeholder: string;
    helpText: string;
    validation: ValidationRule[];
    disabled: boolean;
  }> = {}
): any {
  return {
    type,
    label,
    required: options.required || false,
    placeholder: options.placeholder || "",
    helpText: options.helpText || "",
    validation: options.validation || [],
    disabled: options.disabled || false,
  };
}
