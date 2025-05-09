// widget-form.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import * as moment from 'moment';
import { Enum_WidgetType, Enum_Method, Enum_Entity, Enum_Schema, WidgetDimension, Enum_TimePeriod, Enum_Entity_With_Labels, getWidgetTypesByDimension, getWidgetDropdownItemsByDimension, allWidgetTypes } from '../Models/enums/enums';
import {
  BaseWidgetConstructorProps,
  ShowableProperty,
  WidgetDataConfig
} from '../Models/interfaces/interfaces';
import { EventPropertyType } from 'src/app/Models/eventPropertyType.model';
import { groupByConf, RuleSet } from '../Models/types/types';
import { Property } from 'src/app/Models/property.model';
import { AnalyticService } from 'src/app/services/analytic.service';
import { Operators, RuleType } from '@i2v-systems/common-components';
import { forkJoin } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { QueryBuilderConfig } from '@i2v-systems/i2v-query-builder';
import { VideoSourceClientManager } from 'src/app/Managers/VideoSourceClientManager';
import { WidgetFactory } from '../Models/widget-factory';
import { Widget } from '../Models/Widget';

export const OperatorsLabelKey: Record<Operators, any> = {
  [Operators.EQUAL]: { label: 'Equal', value: Operators.EQUAL },
  [Operators.NOTEQUAL]: { label: 'Not Equal', value: Operators.NOTEQUAL },
  [Operators.GREATERTHAN]: { label: 'Greater Than', value: Operators.GREATERTHAN },
  [Operators.GREATERTHANOREQUAL]: { label: 'Greater Than or Equal', value: Operators.GREATERTHANOREQUAL },
  [Operators.SMALLERTHAN]: { label: 'Smaller Than', value: Operators.SMALLERTHAN },
  [Operators.CONTAINS]: { label: 'Contains', value: Operators.CONTAINS },
  [Operators.NOTCONTAINS]: { label: 'Not Contains', value: Operators.NOTCONTAINS },
  [Operators.SMALLERTHANOREQUAL]: { label: 'Smaller Than or Equal', value: Operators.SMALLERTHANOREQUAL },
}

// Define RuleOperators with type safety and reduced redundancy
export const RuleOperators = {
  [EventPropertyType.Float]: ["Equal", "NotEqual", "GreaterThan", "LessThan"],
  [EventPropertyType.Integer]: ["Equal", "NotEqual", "GreaterThan", "LessThan"],
  [EventPropertyType.String]: ["Equal", "NotEqual", "Contains", "NotContains"],
  [EventPropertyType.Guid]: ["Equal", "NotEqual", "Contains", "NotContains"],
  [EventPropertyType.SingleSelect]: ["Equal", "NotEqual"],
  [EventPropertyType.Boolean]: ["Equal"],
  [EventPropertyType.Date]: ["Equal", "NotEqual", "GreaterThan", "LessThan"],
  [EventPropertyType.MultiSelect]: ["Equal", "NotEqual"]
};

@Component({
  selector: 'app-widget-form',
  templateUrl: './widget-form.component.html',
  styleUrls: ['./widget-form.component.scss']
})
export class WidgetFormComponent implements OnInit {
  @Input() finalWidget : Widget;
  @Output() finalWidgetChange = new EventEmitter<Widget>();
  widgetForm: FormGroup;
  columnArray: any = {
    fields: {}
  };

  ruleData: RuleSet = new RuleSet();

  config: QueryBuilderConfig;
  Enum_method = Enum_Method;

  // Accordion step control
  currentStep = 1;
  stepsCompleted = { 1: false, 2: false, 3: false, 4: false };
  widgetTypes = allWidgetTypes;

  // Dynamic step labels method instead of static array
  getStepLabels(): string[] {
    // Base steps that are always the same
    const labels = [
      'Choose Approach',
      'Display Config',
      'Data Config & Filters'
    ];

    // Add "Widget Type" step only for propertiesFirst approach
    if (this.widgetForm.get('configurationApproach').value === 'propertiesFirst') {
      labels.push('Widget Type');
    }

    // Add "Review & Submit" as the final step
    labels.push('Review & Submit');

    return labels;
  }




  singleEntityAggregationMethods = [
    { value: Enum_Method.Count, label: 'Count' },
    { value: Enum_Method.Sum, label: 'Sum' },
    { value: Enum_Method.Average, label: 'Average' },
    { value: Enum_Method.Min, label: 'Minimum' },
    { value: Enum_Method.Max, label: 'Maximum' },
    { value: Enum_Method.NoAggregation, label: 'No Aggregation' }
  ];

  multipleEntitiesAggregationMethods = [
    { value: Enum_Method.Count, label: 'Count' },
  ];

  entityTypes = [
    { label: 'Events', value: Enum_Schema.Events },
    { label: 'Resource', value: Enum_Schema.Public }
  ];

  selectedEntites = [];

  entities = [
    { value: Enum_Entity_With_Labels.Highway_ATCC, label: 'Highway ATCC', schema: Enum_Schema.Events },
    { value: Enum_Entity_With_Labels.VIDS, label: 'VIDS', schema: Enum_Schema.Events },
    { value: Enum_Entity_With_Labels.Vehicle_Stopped, label: 'Vehicle Stopped', schema: Enum_Schema.Events },
    { value: Enum_Entity_With_Labels.ANPR, label: 'ANPR', schema: Enum_Schema.Events },
    { value: Enum_Entity_With_Labels.Wrong_Way_Detected, label: 'Wrong Way Detected', schema: Enum_Schema.Events },
    { value: Enum_Entity_With_Labels.Human_Crossing_Road, label: 'Human Crossing Road', schema: Enum_Schema.Events },
    { value: Enum_Entity_With_Labels.Reverse_Traffic_Detected, label: 'Reverse Traffic Detected', schema: Enum_Schema.Events },
    { value: Enum_Entity_With_Labels.Lane_Changed, label: 'Lane Changed', schema: Enum_Schema.Events },
    { value: Enum_Entity_With_Labels.Illegal_Vehicle, label: 'Illegal Vehicle', schema: Enum_Schema.Events },
    { value: Enum_Entity_With_Labels.Safe_Distance_Violated, label: 'Safe Distance Violated', schema: Enum_Schema.Events },
    { value: Enum_Entity_With_Labels.Intrusion_Detected, label: 'Intrusion Detected', schema: Enum_Schema.Events },
    { value: Enum_Entity_With_Labels.Human_Detected, label: 'Human Detected', schema: Enum_Schema.Events },
    { value: Enum_Entity_With_Labels.Deacceleration_Detected, label: 'Deacceleration Detected', schema: Enum_Schema.Events },
    { value: Enum_Entity_With_Labels.Vehicle_Accelerated, label: 'Vehicle Accelerated', schema: Enum_Schema.Events },
    { value: Enum_Entity_With_Labels.Vehicle_Occupancy, label: 'Vehicle Occupancy', schema: Enum_Schema.Events },
    { value: Enum_Entity_With_Labels.Fire_Detected, label: 'Fire Detected', schema: Enum_Schema.Events },
    { value: Enum_Entity_With_Labels.Smoke_Detected, label: 'Smoke Detected', schema: Enum_Schema.Events },
    { value: Enum_Entity_With_Labels.Abandoned_Object_Detected, label: 'Abandoned Object Detected', schema: Enum_Schema.Events },
    { value: Enum_Entity_With_Labels.Face_Recognition, label: 'Face Recognition', schema: Enum_Schema.Events },
    { value: Enum_Entity_With_Labels.Server_Status, label: 'Server Status', schema: Enum_Schema.Events },
    { value: Enum_Entity_With_Labels.Pipeline_State, label: 'Pipeline State', schema: Enum_Schema.Events },
    { value: Enum_Entity_With_Labels.DEVICE_CONNECTED, label: 'Device Connected', schema: Enum_Schema.Events },
    { value: Enum_Entity_With_Labels.DEVICE_DISCONNECTED, label: 'Device Disconnected', schema: Enum_Schema.Events },
    { value: Enum_Entity_With_Labels.VideoSources, label: 'Video Sources', schema: Enum_Schema.Public },
    { value: Enum_Entity_With_Labels.Persons, label: 'Persons', schema: Enum_Schema.Public },
    { value: Enum_Entity_With_Labels.FacePoint, label: 'Face Point', schema: Enum_Schema.Public },
  ];

  get eventSchemaEntities() {
    return this.entities.filter(entity => entity.schema === Enum_Schema.Events);
  }
  
  get publicSchemaEntities() {
    return this.entities.filter(entity => entity.schema === Enum_Schema.Public);
  }
  

  timeGroupingOptions = [
    { label: 'Hour', value: Enum_TimePeriod.hour },
    { label: 'Day', value: Enum_TimePeriod.day },
    { label: 'Week', value: Enum_TimePeriod.week },
    { label: 'Month', value: Enum_TimePeriod.month },
    { label: 'Year', value: Enum_TimePeriod.year }
  ];

  // Property maps for each entity type
  entityPropertiesMap: {
    [label: string]: Property[];
  }

  // Common properties across entities
  commonProperties: Property[] = [
  ];

  // Current entity properties for display
  entityProperties: Property[] = [];

  groupByTypes = [
    { label: 'Field', value: 'field' },
    { label: 'Time', value: 'time' }
  ];

  enableGroupBy1: boolean = false;
  enableGroupBy2: boolean = false;

  groupBy1SelectionType: string = null;
  groupBy2SelectionType: string = null;

  groupBy1Option: Property = null;
  groupBy2Option: Property = null;

  groupBy1Model: groupByConf = null;
  groupBy2Model: groupByConf = null;

  selectedTimeGrouping1: string = 'day'; // Default
  selectedTimeGrouping2: string = 'day'; // Default

  // For recommending widget types
  recommendedWidgets = [];

  isFormInitialized = false;

  constructor(private fb: FormBuilder, private analyticService: AnalyticService, private eventService: EventService, private videoSourceManager: VideoSourceClientManager) { }

  ngOnInit(): void {
    // Show loader
    this.isFormInitialized = false;

    forkJoin({
      commonProperties: this.eventService.getAllCommonProperties(),
      analytics: this.analyticService.getAllAnalytics()
    }).subscribe(({ commonProperties, analytics }) => {
      if (commonProperties && commonProperties.length && analytics && analytics.length) {
        this.commonProperties = commonProperties || [];
        this.entityPropertiesMap = analytics.reduce((acc, entity) => {
          acc[entity.name] = [...entity.properties, ...commonProperties];
          return acc;
        }, {});

        this.createForm();
        this.createRuleGroupQueryBuilder([]);

        this.isFormInitialized = true;
      }
    });

  }


  createForm(): void {
    this.widgetForm = this.fb.group({
      configurationApproach: ['widgetFirst', Validators.required],
      entityConfigType: ['single'], // New control for entity configuration type
      widgetType: [null],

      displayConfig: this.fb.group({
        heading: ['', Validators.required],
        subHeading: ['s'],
        color: ['#3498db'],
      }),

      dataInputConfig: this.fb.group({
        method: [Enum_Method.Count],
        isDistinct: [false],
        entityTypeSelect : ['events'],
        entitySelect: [null], // For single entity selection
        fieldNames: [[]], // For single entity properties
        entities: [[]], // For multiple entities
        dataConfig: this.fb.array([]), // For multiple entity configurations
        groupBy1: [null],
        groupBy2: [null],
        commonProperties: [[]], // For common properties
        clubbingTime: [false]
      }),

      filterConfig: this.fb.group({
        customFilters: [{}],
        propertyFilters: [null]
      }),

      widgetTileConf: this.fb.group({
        w: [4],
        h: [4],
        x: [0],
        y: [0]
      }),

      showableProperties: this.fb.array([]) // Store showable property configurations
    });
  }

  onConfigurationApproachChange(): void {
    const value = this.widgetForm.get('configurationApproach').value;

    if (value === 'widgetFirst') {
      this.widgetForm.get('widgetType').setValidators(Validators.required);
    } else {
      this.widgetForm.get('entityConfigType').setValidators(Validators.required);
    }

    // Reset related values
    this.widgetForm.get('widgetType').setValue(null);
    this.updateRecommendedWidgets();
    this.updateStepCompletion(1);
  }

  onWidgetTypeChange(): void {
    if (this.widgetForm.get('configurationApproach').value === 'widgetFirst') {
      this.updateStepCompletion(1);
    } else {
      this.updateStepCompletion(4);
    }
  }


  onEntityTypeSelectChange(event: any): void {
    var entityType = event.value;
    this.widgetForm.get('dataInputConfig.entityTypeSelect').setValue(entityType);
    this.widgetForm.get('dataInputConfig.entities').setValue([]);
    this.widgetForm.get('dataInputConfig.entitySelect').setValue(null);
    this.widgetForm.get('dataInputConfig.fieldNames').setValue([]);
    this.widgetForm.get('dataInputConfig.commonProperties').setValue([]);
    this.widgetForm.get('dataInputConfig.method').setValue(Enum_Method.Count);
    if (entityType == Enum_Schema.Events) {
      this.selectedEntites = this.eventSchemaEntities;
    } else {
      this.selectedEntites = this.publicSchemaEntities;
    }
  }

  setConfig() {
    this.config = this.columnArray;
  }

  onEntityConfigTypeChange(): void {
    const value = this.widgetForm.get('entityConfigType').value;

    // Reset entity-related values
    if (value === 'single') {
      this.widgetForm.get('dataInputConfig.entitySelect').reset();
      this.clearDataConfigArray();
    } else {
      // Multiple entities
      this.widgetForm.get('dataInputConfig.entities').setValue([]);
      this.widgetForm.get('dataInputConfig.entitySelect').reset();
    }

    // Reset group by selections
    this.widgetForm.get('dataInputConfig.groupBy1').reset();
    this.widgetForm.get('dataInputConfig.groupBy2').reset();

    this.updateRecommendedWidgets();
    this.updateStepCompletion(1);
  }

  onEntitySelectChange(event: any): void {
    if (event.value) {
      this.onEntityChange();
    } else {
      this.entityProperties = [];
    }
    this.createRuleGroupQueryBuilder(this.entityProperties);
    this.updateRecommendedWidgets();
    this.updateStepCompletion(3);
  }

  onFieldNamesChange(event: any): void {
    this.widgetForm.get('dataInputConfig.fieldNames').setValue(event.value);
    this.updateRecommendedWidgets();
    this.updateStepCompletion(3);
  }

  onEntitiesChange(event: any): void {
    const values = event.value;

    if (values && values.length) {
      this.setupEntityConfigs(values);
      this.updateRecommendedWidgets();
    } else {
      this.clearDataConfigArray();
    }
    this.createRuleGroupQueryBuilder(this.commonProperties);
    this.updateStepCompletion(3);
  }

  onHeadingChange(): void {
    this.updateStepCompletion(2);
  }

  onCommonPropertiesChange(event: any): void {
    this.widgetForm.get('dataInputConfig.commonProperties').setValue(event.value);
    this.updateRecommendedWidgets();
    this.updateStepCompletion(3);
  }



  // DataConfig FormArray utility methods
  get dataConfigArray(): FormArray {
    return this.widgetForm.get('dataInputConfig.dataConfig') as FormArray;
  }

  getDataConfigControls(): FormGroup[] {
    return this.dataConfigArray.controls as FormGroup[];
  }

  clearDataConfigArray(): void {
    while (this.dataConfigArray.length > 0) {
      this.dataConfigArray.removeAt(0);
    }
  }

  setupEntityConfigs(entityValues: string[]): void {
    // Clear any existing configurations
    this.clearDataConfigArray();

    // Create a new form group for each selected entity
    for (const entityValue of entityValues) {
      var mappedEntity = this.entities.find(e => e.value === entityValue);
      this.dataConfigArray.push(
        this.fb.group({
          entity: [mappedEntity.value, Validators.required],
          schemaName: [mappedEntity.schema, Validators.required]
        })
      );
    }
  }

  aggregationMethodChange(event): void {
    const method = (event.target as HTMLSelectElement).value;
    this.widgetForm.get('dataInputConfig.method').setValue(method);
    this.widgetForm.get('dataInputConfig.fieldNames').setValue([], { emitEvent: false });
    // this.updateStepCompletion(3);
  }

  // Accordion Step Navigation Methods
  toggleStep(step: number): void {
    if (this.currentStep === step) {
      // Already on this step, do nothing
      return;
    }

    if (this.canNavigateToStep(step)) {
      this.currentStep = step;
    }
  }

  goToNextStep(): void {
    const nextStep = this.currentStep + 1;
    if (this.canNavigateToStep(nextStep)) {
      this.currentStep = nextStep;
    }
  }

  goToPreviousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep = this.currentStep - 1;
    }
  }

  goToStep(step: number): void {
    if (this.canNavigateToStep(step)) {
      this.currentStep = step;
    }
  }

  isStepComplete(step: number): boolean {
    return this.stepsCompleted[step] === true;
  }

  canNavigateToStep(step: number): boolean {
    // First step is always accessible
    if (step === 1) return true;

    // Otherwise, all previous steps must be completed
    for (let i = 1; i < step; i++) {
      if (!this.isStepComplete(i)) {
        return false;
      }
    }

    return true;
  }

  onEntityChange(): void {
    const entityValue = this.widgetForm.get('dataInputConfig.entitySelect').value;

    if (entityValue && this.entityPropertiesMap[entityValue]) {
      this.entityProperties = this.entityPropertiesMap[entityValue];
    } else {
      this.entityProperties = [];
    }
  }

  // Update getAllAvailableProperties to ensure properties have name
  getAllAvailableProperties(): Property[] {
    const properties: Property[] = [];

    if (this.widgetForm.get('entityConfigType').value === 'single') {
      const entityValue = this.widgetForm.get('dataInputConfig.entitySelect').value;
      if (entityValue && this.entityPropertiesMap[entityValue]) {
        properties.push(...this.entityPropertiesMap[entityValue]);
      }
    } else {
      const selectedEntities = this.widgetForm.get('dataInputConfig.entities').value || [];
      for (const entityValue of selectedEntities) {
        const entityProps = this.entityPropertiesMap[entityValue] || [];
        properties.push(...entityProps);
      }
      properties.push(...this.commonProperties);
    }

    // Ensure all properties have name field
    return properties.map(prop => ({
      ...prop
    }));
  }


  updateStepCompletion(step: number): void {
    switch (step) {
      case 1:
        // Step 1: Configuration Approach
        if (this.widgetForm.get('configurationApproach').value === 'widgetFirst') {
          this.stepsCompleted[1] = this.widgetForm.get('widgetType').value !== null;
        } else {
          this.stepsCompleted[1] = this.widgetForm.get('entityConfigType').value !== null;
        }
        break;

      case 2:
        // Step 2: Display Configuration
        this.stepsCompleted[2] = !!this.widgetForm.get('displayConfig.heading').value;
        break;

      case 3:
        // Step 3: Data Configuration & Filters
        if (this.widgetForm.get('entityConfigType').value === 'single') {
          const entity = this.widgetForm.get('dataInputConfig.entitySelect').value;
          const aggregationMethod = this.widgetForm.get('dataInputConfig.method').value;
          if (aggregationMethod === Enum_Method.Sum) {
            const properties = this.widgetForm.get('dataInputConfig.fieldNames').value || [];
            this.stepsCompleted[3] = !!entity && ((Array.isArray(properties) && properties.length > 0) || (!!properties && !Array.isArray(properties)));
          }
          else {
            this.stepsCompleted[3] = !!entity
          }
        } else {
          const entities = this.widgetForm.get('dataInputConfig.entities').value || [];
          this.stepsCompleted[3] = entities.length > 0;
        }
        break;

      case 4:
        // Step 4: Widget Type (for properties-first approach only)
        if (this.widgetForm.get('configurationApproach').value === 'propertiesFirst') {
          this.stepsCompleted[4] = this.widgetForm.get('widgetType').value !== null;
        }
        break;
    }
  }

  canRecommendWidgets(): boolean {
    if (this.widgetForm.get('configurationApproach').value === 'propertiesFirst') {
      // Check if we have enough data to make recommendations
      if (this.widgetForm.get('entityConfigType').value === 'single') {
        const entity = this.widgetForm.get('dataInputConfig.entitySelect').value;
        const aggregationMethod = this.widgetForm.get('dataInputConfig.method').value;
        if (aggregationMethod === Enum_Method.Sum) {
          const properties = this.widgetForm.get('dataInputConfig.fieldNames').value || [];
          return !!entity && ((Array.isArray(properties) && properties.length > 0) || (!!properties && !Array.isArray(properties)));
        }
        else {
          return !!entity
        }
      } else {
        const entities = this.widgetForm.get('dataInputConfig.entities').value || [];
          return entities.length > 0
        // // Check if at least one entity has properties selected
        // const dataConfigs = this.getDataConfigControls();
        // for (const config of dataConfigs) {
        //   if (config.get('properties').value?.length > 0) {
        //     return true;
        //   }
        // }
      }
    }

    return false;
  }

  updateRecommendedWidgets(): void {
    if (!this.canRecommendWidgets()) {
      this.recommendedWidgets = [];
      return;
    }

    const entityConfigType = this.widgetForm.get('entityConfigType').value;
    const groupBy1 = this.widgetForm.get('dataInputConfig.groupBy1').value;
    const groupBy2 = this.widgetForm.get('dataInputConfig.groupBy2').value;
    const aggregationMethod = this.widgetForm.get('dataInputConfig.method').value;

    // Default available widgets
    let availableWidgets = [...allWidgetTypes];

    // Multiple entities
    if (groupBy1 && groupBy2) {
      availableWidgets = getWidgetDropdownItemsByDimension(WidgetDimension.ThreeDimensional);
    }
    else if (groupBy1) {
      // One groupBy field
      const groupByProp = this.getAllAvailableProperties().find(p => p.name === groupBy1);
      availableWidgets = availableWidgets.filter(w =>
        [Enum_WidgetType.BarChart, Enum_WidgetType.PieChart, Enum_WidgetType.Donut, Enum_WidgetType.AreaChart, Enum_WidgetType.ColumnChart, Enum_WidgetType.LineChart, Enum_WidgetType.HeatMapChart, Enum_WidgetType.KPI].includes(w.value)
      );

    } else {
      // No groupBy fields
      availableWidgets = availableWidgets.filter(w =>
        [Enum_WidgetType.Table, Enum_WidgetType.KPI].includes(w.value)
      );
    }


    // Always ensure Table option is available
    if (!availableWidgets.some(w => w.value === Enum_WidgetType.Table)) {
      availableWidgets.push(this.widgetTypes.find(w => w.value === Enum_WidgetType.Table));
    }

    this.recommendedWidgets = availableWidgets;
  }

  canSubmitForm(): boolean {
    // Basic validation
    if (!this.widgetForm.get('displayConfig.heading').value) {
      return false;
    }

    // Widget Type Selection validation
    if (!this.widgetForm.get('widgetType').value) {
      return false;
    }

    // Single/Multiple entity validation based on entity configuration type
    if (this.widgetForm.get('entityConfigType').value === 'single') {
      const entity = this.widgetForm.get('dataInputConfig.entitySelect').value;
      const aggregationMethod = this.widgetForm.get('dataInputConfig.method').value;
      if (aggregationMethod === Enum_Method.Sum) {
        const properties = this.widgetForm.get('dataInputConfig.fieldNames').value || [];
        return !!entity && ((Array.isArray(properties) && properties.length > 0) || (!!properties && !Array.isArray(properties)));
      }
      else {
        return !!entity
      }
    } else {
      const entities = this.widgetForm.get('dataInputConfig.entities').value || [];
        return entities.length > 0
      // // Check if at least one entity has properties selected
      // const dataConfigs = this.getDataConfigControls();
      // for (const config of dataConfigs) {
      //   if (config.get('properties').value?.length > 0) {
      //     return true;
      //   }
      // }
    }
  }

  onSubmit(): void {
    if (!this.canSubmitForm()) {
      this.markFormGroupTouched(this.widgetForm);
      alert('Please complete all required fields before submitting.');
      return;
    }
  
    // Determine dimension based on data configuration
    let dimension = WidgetDimension.OneDimensional;
  
    if (this.widgetForm.get('dataInputConfig.groupBy1').value) {
      dimension = this.widgetForm.get('dataInputConfig.groupBy2').value ?
        WidgetDimension.ThreeDimensional :
        WidgetDimension.TwoDimensional;
    }
  
    // Create fieldNames
    const fieldNames: Record<string, EventPropertyType> = {};
  
    // Gather fieldNames properties based on entity configuration
    if (this.widgetForm.get('entityConfigType').value === 'single') {
      const props = this.widgetForm.get('dataInputConfig.fieldNames').value || [];
      const entityValue = this.widgetForm.get('dataInputConfig.entitySelect').value;
  
      // Create fieldNames objects
      props.forEach(propValue => {
        const propInfo = this.entityPropertiesMap[entityValue]?.find(p => p.name === propValue);
        if (propInfo) {
          fieldNames[propValue.name] = propInfo.type;
        }
      });
    } else {
      // For multiple entities, gather from all entity configurations
      const dataConfigs = this.getDataConfigControls();
  
      // Add common properties if selected
      const commonProps = this.widgetForm.get('dataInputConfig.commonProperties').value || [];
      commonProps.forEach(propValue => {
        const propInfo = this.commonProperties.find(p => p.name === propValue);
        if (propInfo) {
          fieldNames[propValue] = propInfo.type;
        }
      });
    }
  
    // Create showable properties array
    const showableProperties: ShowableProperty[] = [];
  
    // Gather showable properties based on entity configuration
    if (this.widgetForm.get('entityConfigType').value === 'single') {
      const props = this.widgetForm.get('dataInputConfig.fieldNames').value || [];
      const entityValue = this.widgetForm.get('dataInputConfig.entitySelect').value;
  
      // Create ShowableProperty objects
      props.forEach(propValue => {
        const propInfo = this.entityPropertiesMap[entityValue]?.find(p => p.name === propValue.name);
        if (propInfo) {
          showableProperties.push({
            name: propValue,
            displayName: propInfo.columnName,
            isMultiValued: false,
            isLabel: propInfo.type === EventPropertyType.String
          });
        }
      });
    } else {
      // For multiple entities, gather from all entity configurations
      const dataConfigs = this.getDataConfigControls();
  
      // Add common properties if selected
      const commonProps = this.widgetForm.get('dataInputConfig.commonProperties').value || [];
      commonProps.forEach(propValue => {
        const propInfo = this.commonProperties.find(p => p.name === propValue.name);
        if (propInfo) {
          showableProperties.push({
            name: propValue,
            displayName: propInfo.columnName,
            isMultiValued: false,
            isLabel: propInfo.type === EventPropertyType.String
          });
        }
      });
    }
  
    // Prepare the data configuration
    let dataConfig: WidgetDataConfig[] = [];
  
    if (this.widgetForm.get('entityConfigType').value === 'single') {
      dataConfig = [{
        entity: this.widgetForm.get('dataInputConfig.entitySelect').value as Enum_Entity,
        schemaName: this.widgetForm.get('dataInputConfig.entityTypeSelect').value as Enum_Schema
      }];
    } else {
      // For multiple entities, gather from all entity configurations
      const dataConfigs = this.getDataConfigControls();
  
      dataConfigs.forEach(config => { 
        if (config.get('schemaName').value) {
          dataConfig.push({
            entity: config.get('entity').value as Enum_Entity,
            schemaName: config.get('schemaName').value as Enum_Schema
          });
        }
      });
    }
  
    // Create the base widget configuration
    const baseWidgetConfig: BaseWidgetConstructorProps = {
      id: this.generateUUID(),
      widgetType: this.widgetForm.get('widgetType').value,
      displayConfig: this.widgetForm.get('displayConfig').value,
      showableProperties: showableProperties,
      widgetTileConf: this.widgetForm.get('widgetTileConf').value,
      WidgetInteractivityConfig : {
        isWidgetHidden : false
      },
      filterConfig: {
        customFilters: {},
        propertyFilters: this.convertRulesToPropertyFilters(),
        disableTimeFilter: false,
        startTime: this.getCurrentDayStart(),
        endTime: moment(new Date()).valueOf(),
        isDashboardFilterApplied: true
      }
    };
  
    // Create appropriate data input config based on dimension
    let dataInputConfig: any; // Using any temporarily to solve the type issue
  
    switch (dimension) {
      case WidgetDimension.OneDimensional:
        dataInputConfig = {
          isDistinct: this.widgetForm.get('dataInputConfig.isDistinct').value,
          method: this.widgetForm.get('dataInputConfig.method').value,
          dataConfig: dataConfig
        };
        break;
  
      case WidgetDimension.TwoDimensional:
        dataInputConfig = {
          isDistinct: this.widgetForm.get('dataInputConfig.isDistinct').value,
          method: this.widgetForm.get('dataInputConfig.method').value,
          dataConfig: dataConfig,
          groupBy1: this.widgetForm.get('dataInputConfig.groupBy1').value,
          clubbingTime: this.widgetForm.get('dataInputConfig.clubbingTime').value
        };
        break;
  
      case WidgetDimension.ThreeDimensional:
        dataInputConfig = {
          isDistinct: this.widgetForm.get('dataInputConfig.isDistinct').value,
          method: this.widgetForm.get('dataInputConfig.method').value,
          dataConfig: dataConfig,
          groupBy1: this.widgetForm.get('dataInputConfig.groupBy1').value,
          groupBy2: this.widgetForm.get('dataInputConfig.groupBy2').value,
          clubbingTime: this.widgetForm.get('dataInputConfig.clubbingTime').value
        };
        break;
    }
  
    try {
      // Create a complete constructor props object
      const constructorProps = {
        ...baseWidgetConfig,
        dataInputConfig: dataInputConfig
      };
  
      // Validate the configuration for the selected widget type
      const validation = WidgetFactory.validateWidgetConfiguration(
        this.widgetForm.get('widgetType').value, 
        dataInputConfig
      );
  
      if (!validation.isValid) {
        alert(`Invalid widget configuration: ${validation.errors.join(', ')}`);
        return;
      }
  
      // Use the factory to create the appropriate widget
      const finalWidget = WidgetFactory.createWidget(constructorProps);
  
      // In a real application, you would save this widget or pass it to a service
      console.log('Widget created:', finalWidget);
      this.finalWidget = finalWidget;
      this.finalWidgetChange.emit(this.finalWidget);
      alert('Widget created successfully!');
      
      // Optional: Reset the form or navigate to another page
      // this.onReset();
      // this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Error creating widget:', error);
      alert(`Error creating widget: ${error.message}`);
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(c => {
          if (c instanceof FormGroup) {
            this.markFormGroupTouched(c);
          } else {
            c.markAsTouched();
          }
        });
      }
    });
  }

  convertRulesToPropertyFilters(): any {
    // Convert the rule groups to a format the widget can use
    const propertyFilters = this.ruleData;
    return propertyFilters;
  }

  getCurrentDayStart(): number {
    const now = new Date();
    return moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)).valueOf();
  }

  generateUUID(): string {
    // Simple UUID generator for demo purposes
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  onReset(): void {
    this.widgetForm.reset();
    this.clearDataConfigArray();

    this.enableGroupBy1 = false;
    this.enableGroupBy2 = false;
    this.groupBy1SelectionType = null;
    this.groupBy2SelectionType = null;
    this.groupBy1Option = null;
    this.groupBy2Option = null;
    this.groupBy1Model = null;
    this.groupBy2Model = null;

    // Reset default values
    this.widgetForm.get('configurationApproach').setValue('widgetFirst');
    this.widgetForm.get('entityConfigType').setValue('single');
    this.widgetForm.get('dataInputConfig.method').setValue(Enum_Method.Count);
    this.widgetForm.get('dataInputConfig.isDistinct').setValue(false);
    this.widgetForm.get('displayConfig.color').setValue('#3498db');

    // Reset accordion state
    this.currentStep = 1;
    this.stepsCompleted = { 1: false, 2: false, 3: false, 4: false };
  }

  // Helper methods for property operations
  getEntityLabel(entityValue: string): string {
    const entity = this.entities.find(e => e.label === entityValue);
    return entity ? entity.label : entityValue;
  }

  getEntitySpecificProperties(entityValue: string): any[] {
    return this.entityPropertiesMap[entityValue] || [];
  }


  selectWidget(widgetType: string): void {
    this.widgetForm.get('widgetType').setValue(widgetType);
    this.updateStepCompletion(4);
  }

  // Method to determine if we can proceed to the review step
  canProceedToReview(): boolean {
    if (this.widgetForm.get('configurationApproach').value === 'widgetFirst') {
      return this.isStepComplete(1) && this.isStepComplete(2) && this.isStepComplete(3);
    } else {
      return this.isStepComplete(1) && this.isStepComplete(2) && this.isStepComplete(3) && this.isStepComplete(4);
    }
  }

  // Check if a property is time-based
  isTimeProperty(selectedProperty: Property): boolean {
    if (!selectedProperty) return false;

    // Get property information from all available properties
    const allProperties = this.getAllAvailableProperties();
    const property = allProperties.find(prop => prop.name === selectedProperty.name);

    // Check if property is time-based
    return property?.type === EventPropertyType.Date || property?.type === EventPropertyType.DateTime;
  }

  // Get form control for a specific entity's properties
  getPropertiesControlForEntity(entityValue: string): AbstractControl | null {
    if (!entityValue) return null;

    // If it's single entity config
    if (this.widgetForm.get('entityConfigType').value === 'single' &&
      this.widgetForm.get('dataInputConfig.entitySelect').value === entityValue) {
      return this.widgetForm.get('dataInputConfig.fieldNames');
    }

    // If it's multiple entities config
    if (this.widgetForm.get('entityConfigType').value === 'multiple') {
      const dataConfigControls = this.getDataConfigControls();
      for (let i = 0; i < dataConfigControls.length; i++) {
        const config = dataConfigControls[i];
        if (config.get('entity').value === entityValue) {
          return config.get('properties');
        }
      }
    }

    return null;
  }

  // Methods for the summary section
  getWidgetTypeLabel(): string {
    const widgetType = this.widgetForm.get('widgetType').value;
    const widget = this.widgetTypes.find(w => w.value === widgetType);
    return widget ? widget.label : 'None Selected';
  }

  getSelectedPropertiesSummary(): string {

    return "";

    // if (this.widgetForm.get('entityConfigType').value === 'single') {
    //   const fieldNamesValue = this.widgetForm.get('dataInputConfig.fieldNames').value;

    //   // Handle the case where fieldNames might be a single object (for Count method) or an array
    //   if (!fieldNamesValue) {
    //     return 'None';
    //   }

    //   const entityValue = this.widgetForm.get('dataInputConfig.entitySelect').value;
    //   let properties = [];

    //   // Check if it's a single property object (Count method) or array of property names
    //   if (Array.isArray(fieldNamesValue)) {
    //     // It's an array of property names (for non-Count methods)
    //     properties = fieldNamesValue.map(propertyName => {
    //       const prop = this.entityPropertiesMap[entityValue]?.find(p => p.name === propertyName);
    //       return prop ? prop.name : propertyName;
    //     });
    //   } else if (typeof fieldNamesValue === 'object' && fieldNamesValue.name) {
    //     // It's a single property object (for Count method)
    //     properties = [fieldNamesValue.name];
    //   } else {
    //     // Fallback for any other format
    //     properties = [String(fieldNamesValue)];
    //   }

    //   return properties.join(', ');
    // } else {
    //   // For multiple entities, this is more complex - summarize by entity
    //   const entities = this.widgetForm.get('dataInputConfig.entities').value || [];
    //   if (entities.length === 0) return 'None';

    //   const summaries = [];
    //   const dataConfigs = this.getDataConfigControls();

    //   for (const config of dataConfigs) {
    //     const entityValue = config.get('entity').value;
    //     const properties = config.get('properties').value || [];
    //     var propertiesLength = (!!properties && !Array.isArray(properties)) ? 1 : (Array.isArray(properties) && properties.length > 0) ? properties.length : 0;
    //     if (propertiesLength > 0) {
    //       const entityLabel = this.getEntityLabel(entityValue);
    //       const propLabels = properties.map(value => {
    //         const prop = this.entityPropertiesMap[entityValue]?.find(p => p.name === value.name);
    //         return prop ? prop.name : value;
    //       }).join(', ');

    //       summaries.push(`${entityLabel}: ${propLabels}`);
    //     }
    //   }

    //   return summaries.join('; ');
    // }
  }

  getGroupingSummary(): string {
    if (!this.enableGroupBy1) return 'None';

    const groupBy1 = this.widgetForm.get('dataInputConfig.groupBy1').value;
    if (!groupBy1) return 'None';

    const allProps = this.getAllAvailableProperties();
    const groupBy1Label = groupBy1.name;

    if (!this.enableGroupBy2) return groupBy1Label;

    const groupBy2 = this.widgetForm.get('dataInputConfig.groupBy2').value;
    if (!groupBy2) return groupBy1Label;

    const groupBy2Label = groupBy2.name;
    return `Group By 1 : ${groupBy1Label} \n Group By 2 :${groupBy2Label}`;
  }

  getPropertyLabel(propertyField: string): string {
    if (!propertyField) return 'Unknown Property';

    const allProps = this.getAllAvailableProperties();
    const property = allProps.find(p => p.name === propertyField);
    return property ? property.columnName : propertyField;
  }


  // Check for time-based properties
  hasTimeBasedProperties(): boolean {
    const allProperties = this.getAllAvailableProperties();
    return allProperties.some(prop => this.isTimeProperty(prop));
  }

  accordionTabOpened(event: any) {
    // The index is 0-based in the event but 1-based in our model
    this.currentStep = event.index + 1;
  }

  // Add these new methods
  toggleGroupBy1(event: any): void {
    this.enableGroupBy1 = event.target.checked;

    if (!this.enableGroupBy1) {
      // Clear GroupBy1 when disabled
      this.widgetForm.get('dataInputConfig.groupBy1').setValue(null);
      this.groupBy1Model = null;
      this.groupBy1Option = null;
      this.groupBy1SelectionType = null;

      // Also disable and clear GroupBy2 since it depends on GroupBy1
      this.enableGroupBy2 = false;
      this.toggleGroupBy2({ target: { checked: false } });
    }

    this.updateRecommendedWidgets();
    this.updateStepCompletion(3);
  }

  toggleGroupBy2(event: any): void {
    this.enableGroupBy2 = event.target.checked;

    if (!this.enableGroupBy2) {
      // Clear GroupBy2 when disabled
      this.widgetForm.get('dataInputConfig.groupBy2').setValue(null);
      this.groupBy2Model = null;
      this.groupBy2Option = null;
      this.groupBy2SelectionType = null;
    }

    this.updateRecommendedWidgets();
    this.updateStepCompletion(3);
  }

  onGroupBy1Change(event: any): void {

    var prop = event.value as Property;

    // Create groupByConf object
    this.groupBy1Model = new groupByConf();
    this.groupBy1Model.name = prop.name;
    this.groupBy1Model.projectionName = prop.columnName;
    this.groupBy1Model.type = prop.type;
    this.groupBy1Model.isTime = false;

    this.groupBy1Option = prop;

    // Set to form
    this.widgetForm.get('dataInputConfig.groupBy1').setValue(this.groupBy1Model);
    this.updateRecommendedWidgets();
    this.updateStepCompletion(3);
  }

  onGroupBy2Change(event): void {
    var prop = event.value as Property;

    // Create groupByConf object
    this.groupBy2Model = new groupByConf();
    this.groupBy2Model.name = prop.name;
    this.groupBy2Model.projectionName = prop.columnName;
    this.groupBy2Model.type = prop.type;
    this.groupBy2Model.isTime = false;

    this.groupBy2Option = prop;

    // Set to form
    this.widgetForm.get('dataInputConfig.groupBy2').setValue(this.groupBy2Model);
    this.updateRecommendedWidgets();
  }

  updateTimeGrouping(groupByNumber: number, event): void {
    // Create groupByConf object
    const groupByModel = new groupByConf();
    groupByModel.name = event.Value;
    groupByModel.projectionName = this.capitalizeFirstWord(event.Value);
    groupByModel.type = EventPropertyType.String;
    groupByModel.isTime = true;

    if (groupByNumber === 1) {
      this.groupBy1Model = groupByModel;
      this.widgetForm.get('dataInputConfig.groupBy1')?.setValue(groupByModel);

    } else if (groupByNumber === 2) {
      this.groupBy2Model = groupByModel;
      this.widgetForm.get('dataInputConfig.groupBy2')?.setValue(groupByModel);
    }

    this.updateRecommendedWidgets();
    this.updateStepCompletion(3);
  }

  determinePropertyType(fieldName: string): EventPropertyType {
    // Get property information from all available properties
    const allProperties = this.getAllAvailableProperties();
    const property = allProperties.find(prop => prop.name === fieldName);

    if (!property) {
      return EventPropertyType.String; // Default
    }

    return property.type
  }

  onSelectGroupByType(groupByNumber: number, event): void {
    const selectedValue = event.value;
    if (groupByNumber === 1) {
      this.groupBy1SelectionType = selectedValue;
    } else if (groupByNumber === 2) {
      this.groupBy2SelectionType = selectedValue;
    }

    // Update the groupBy configuration in the form
    this.updateTimeGrouping(groupByNumber, event);
  }

  capitalizeFirstWord(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  createRuleGroupQueryBuilder(properties: Property[]) {
    properties.forEach((property: Property) => {
      if (property.type != EventPropertyType.Guid) {

        if (property.name == "VideoSourceId") {
          const videoSources = this.videoSourceManager.getAllVideoSourceInMemory();
          let videoSourcesName = "";
          for (let i = 0; i < videoSources.length; i++) {
            videoSourcesName += videoSources[i].name + ",";
          }
          property.defaultValues = videoSourcesName.slice(0, -1);
        }

        this.createFilterPropertyObject(
          property.name,
          property.columnName,
          property.type,
          property.defaultValues,
        );
      }
    });
  }

  createFilterPropertyObject(propertyName, name, type, options) {
    let object;
    const operators = this.getOpertorByType(type);
    const options_ = this.setDefaultValuesByType(propertyName, options, type);
    console.log(type);
    if (options_ == null) {
      object = { name: name, type: EventPropertyType[type], operators: operators };
    } else {
      object = {
        name: name,
        type: EventPropertyType[type],
        options: options_,
        operators: operators,
      };
    }
    this.columnArray.fields[propertyName] = object;
    this.setConfig();
  }

  getOpertorByType(type: number) {
    return RuleOperators[type];
  }

  setDefaultValuesByType(propertyName, options, type) {
    if (typeof options === "string") {
      return options.includes(",")
        ? options.split(",").map((value) => value.trim())
        : [options.trim()];
    }
    if (type === 3) {
      return [true, false];
    }
    return options;
  }
}