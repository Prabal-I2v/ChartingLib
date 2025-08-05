// widget-form.component.ts - Complete TypeScript file with strong typing
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, AbstractControl } from '@angular/forms';
import { forkJoin } from 'rxjs';
// Enums and Models
import {
  Enum_WidgetType,
  Enum_Method,
  Enum_Schema,
  WidgetDimension,
  getWidgetDropdownItemsByDimension,
  allWidgetTypes,
  Enum_Method_Aggregation,
  Enum_Method_Aggregation_With_Labels
} from '../Models/enums/enums';

import { EventPropertyType, RuleOperators } from 'src/app/Models/eventPropertyType.model';
import { groupByConf, Rule, RuleSet } from '../Models/types/types';
import { Property } from 'src/app/Models/property.model';

// Services
import { AnalyticService } from 'src/app/services/analytic.service';
import { EventService } from 'src/app/services/event.service';
import { VideoSourceClientManager } from 'src/app/Managers/VideoSourceClientManager';

// Widget Models
import { WidgetFactory } from '../Models/widget-factory';
import {
  OneDimensionWidgetConstructorProps,
  ThreeDimensionWidgetConstructorProps,
  TwoDimensionWidgetConstructorProps,
  Widget
} from '../Models/Widget';

import { DonutConf, DonutChart1DWidget } from '../Models/widgetRequestModel/DonutChart1DModel';
import { DonutChart2DWidget } from '../Models/widgetRequestModel/DonutChart2DModel';
import { Kpi2DWidget, KPI2DWidgetConstructorProps } from '../Models/widgetRequestModel/KpiWidget2DModel';
import { TableWidgetConstructorProps, TableConf, TableWidget } from '../Models/widgetRequestModel/TableWidgetRequestModel';
import { Kpi1DWidget, KPI1DWidgetConstructorProps, KPIConf } from '../Models/widgetRequestModel/KpiWidget1DModel';

// Interfaces
import {
  IBaseWidgetConstructorProps,
  IOneDimensionDataInputConfig,
  IShowableProperty,
  IThreeDimensionDataInputConfig,
  ITwoDimensionDataInputConfig,
  IWidgetDataConfig,
  IWidgetFieldNameConfig,
  IWidgetDisplayConfig,
  IWidgetFilterConfig,
  IWidgetInteractivityConfig,
  ITimeRange
} from '../Models/interfaces/interfaces';

// Utils and Constants
import {
  entityTypes,
  fieldsAggregationMethods,
  groupByTypes,
  multipleEntitiesAggregationMethods,
  seriesAggregationOptions,
  singleEntityAggregationMethods,
  timeGroupingOptions,
  WidgetFormUtils,
  ValidationRules,
  WIDGET_FORM_CONSTANTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  validateWidgetCompatibility,
  EntityOption,
  PUBLIC_ENTITIES
} from './widget-form-utils';

// Query Builder
import { QueryBuilderConfig } from '@i2v-systems/i2v-query-builder';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WidgetTileConf } from '../Models/types/types';
import { CommonComponentsComponent, CommonModalComponent, CommonModalData } from '@i2v-systems/common-components';
import { WidgetFormPreviewComponent } from '../widget-form-preview/widget-form-preview.component';
import { AnalyticEventModel } from 'src/app/Models/analyticEvent.Model';

// Form value interfaces (what the form contains)
interface WidgetFormValue {
  configurationApproach: 'widgetFirst' | 'propertiesFirst';
  entityConfigType: 'single' | 'multiple';
  widgetType: Enum_WidgetType | null;

  displayConfig: {
    heading: string;
    subHeading: string;
    color: string;
  };

  dataInputConfig: {
    method: Enum_Method;
    isDistinct: boolean;
    entityTypeSelect: Enum_Schema;
    entitySelect: string | null;
    fieldNames: IWidgetFieldNameConfig[];
    entities: string[];
    dataConfig: IWidgetDataConfig[];
    groupBy1: groupByConf | null;
    groupBy2: groupByConf | null;
    commonProperties?: Property[];
    clubbingTime: boolean;
    fieldsAggregationType: Enum_Method_Aggregation;
  };

  filterConfig: {
    customFilters: Record<string, any>;
    propertyFilters: RuleSet | null;
  };

  widgetSpecificConfig: {
    kpiConf: {
      countValueColumnName: string;
      displayValueColumnName: string;
      imageColumnName: string;
      seriesAggregation: Enum_Method_Aggregation;
      showAggregation: boolean;
      dataAggregationMethod: Enum_Method_Aggregation
      showChart: boolean;
      hideLabel: boolean
    };
    donutConf: {
      centerLabel: string;
      centerLabelAggregation: Enum_Method_Aggregation;
      showSeriesLabelValue: boolean;
    };
    tableConf: {
      pagination: boolean;
      pageLimit: number;
      pageNumber: number;
    };
  };

  widgetTileConf: WidgetTileConf;
  showableProperties: IShowableProperty[];
}

// Form control interfaces (what FormGroup expects)
interface WidgetFormControls {
  id: FormControl<string | null>,
  dashboardId: FormControl<string | null>,
  configurationApproach: FormControl<'widgetFirst' | 'propertiesFirst'>;
  entityConfigType: FormControl<'single' | 'multiple'>;
  widgetType: FormControl<Enum_WidgetType | null>;

  displayConfig: FormGroup<{
    heading: FormControl<string>;
    subHeading: FormControl<string>;
    color: FormControl<string>;
  }>;

  dataInputConfig: FormGroup<{
    method: FormControl<Enum_Method>;
    isDistinct: FormControl<boolean>;
    entityTypeSelect: FormControl<Enum_Schema>;
    entitySelect: FormControl<string | null>;
    fieldNames: FormControl<IWidgetFieldNameConfig[]>;
    entities: FormControl<string[]>;
    dataConfig: FormArray<FormGroup<{
      entity: FormControl<string>;
      schemaName: FormControl<Enum_Schema>;
    }>>;
    groupBy1: FormControl<groupByConf | null>;
    groupBy2: FormControl<groupByConf | null>;
    clubbingTime: FormControl<boolean>;
    fieldsAggregationType: FormControl<Enum_Method_Aggregation>;
  }>;

  filterConfig: FormGroup<{
    customFilters: FormControl<Record<string, any>>;
    propertyFilters: FormControl<RuleSet | null>;
  }>;

  enableWidgetSpecificConfig: FormControl<boolean>;

  widgetSpecificConfig: FormGroup<{
    kpiConf: FormGroup<{
      countValueColumnName: FormControl<string>;
      displayValueColumnName: FormControl<string>;
      imageColumnName: FormControl<string>;
      showAggregation: FormControl<boolean>;
      dataAggregationMethod: FormControl<Enum_Method_Aggregation>;
      hideLabel: FormControl<boolean>;
      showChart: FormControl<boolean>;
    }>;
    donutConf: FormGroup<{
      centerLabel: FormControl<string>;
      centerLabelAggregation: FormControl<Enum_Method_Aggregation>;
      showSeriesLabelValue: FormControl<boolean>;
    }>;
    tableConf: FormGroup<{
      pagination: FormControl<boolean>;
      pageLimit: FormControl<number>;
      pageNumber: FormControl<number>;
    }>;
  }>;

  allowRefresh: FormControl<boolean>;
  refreshInterval: FormControl<number>;

  widgetTileConf: FormGroup<any>; // Using any for WidgetTileConf due to complexity
  showablePropertiesSelection: FormControl<string[]>;
  showableProperties: FormArray<FormGroup<{
    name: FormControl<string>;
    displayName: FormControl<string>;
    isMultiValued: FormControl<boolean>;
    isLabel: FormControl<boolean>;
    multiValuedConfig: FormGroup<{
      dependentOnColumn: FormControl<string | null>,
      valueBasedOnColumn: FormControl<string>
    }>
  }>>;
}

interface StepCompletion {
  [key: number]: boolean;
}

interface WidgetRecommendation {
  value: Enum_WidgetType;
  label: string;
}

export enum Enum_WidgetFormMode {
  normal = 'normal',
  predefined = 'predefined'
}

export interface IWidgetFormDataRequestModel {
  data?: Widget;
  dashboardId: string;
  operation: Enum_WidgetFormOperation;
  mode?: Enum_WidgetFormMode;
  timeObj: ITimeRange
}

export enum Enum_WidgetFormOperation {
  add,
  edit,
  none
}

export interface IWidgetFormDataResponseModel {
  widgetData: Widget;
  operation: Enum_WidgetFormOperation;
}

@Component({
  selector: 'app-widget-form',
  templateUrl: './widget-form.component.html',
  styleUrls: ['./widget-form.component.scss']
})
export class WidgetFormComponent implements OnInit {
  // Input/Output
  @Input() finalWidget: Widget;
  @Output() finalWidgetChange = new EventEmitter<Widget>();

  // Form Configuration - Now strongly typed
  dashboardId: string;
  widgetForm: FormGroup<WidgetFormControls>;
  columnArray: any = { fields: {} };
  ruleData: RuleSet = new RuleSet();
  config: QueryBuilderConfig;
  get isFormValid() {
    return this.canSubmitForm();
  }

  // Enums for template access
  readonly Enum_method = Enum_Method;
  readonly Enum_WidgetType = Enum_WidgetType;
  readonly RuleOperators = RuleOperators;
  readonly EventPropertyType = EventPropertyType;
  readonly Enum_Schema = Enum_Schema;

  // Step Management
  currentStep = 1;
  stepsCompleted: StepCompletion = { 1: false, 2: false, 3: false, 4: false, 5: false };

  // Widget Configuration
  widgetTypes = allWidgetTypes;
  recommendedWidgets: WidgetRecommendation[] = [];

  // Data Options
  readonly singleEntityAggregationMethods = singleEntityAggregationMethods;
  readonly multipleEntitiesAggregationMethods = multipleEntitiesAggregationMethods;
  readonly entityTypes = entityTypes;
  readonly fieldsAggregationMethods = fieldsAggregationMethods;
  readonly groupByTypes = groupByTypes;
  readonly seriesAggregationOptions = seriesAggregationOptions;
  readonly timeGroupingOptions = timeGroupingOptions;
  readonly PUBLIC_ENTITIES = PUBLIC_ENTITIES;

  EVENT_ENTITIES: EntityOption[] = []

  // Configuration Mode
  isAdvancedMode: boolean = true;
  formMode: Enum_WidgetFormMode = Enum_WidgetFormMode.normal;
  timeObj: ITimeRange;
  selectedEntities: any[] = []; // For dropdown options
  isWidgetTypeSelectedInitially: boolean = false;

  // Property Management - Now strongly typed
  entityPropertiesMap: { [label: string]: Property[] } = {};
  commonProperties: Property[] = [];
  entityProperties: Property[] = []; // Available properties for current selection
  allFieldNames: IWidgetFieldNameConfig[] = []; // All field names for current entity
  commonFieldNames: IWidgetFieldNameConfig[] = []; // Common field names for selection
  allShowablePropertiesName: IShowableProperty[] = [];

  // Group By Configuration
  enableGroupBy1: boolean = false;
  enableGroupBy2: boolean = false;
  groupBy1SelectionType: string | null = null;
  groupBy2SelectionType: string | null = null;
  groupBy1Option: Property | null = null;
  groupBy2Option: Property | null = null;
  groupBy1Model: groupByConf | null = null;
  groupBy2Model: groupByConf | null = null;
  selectedTimeGrouping1: string = 'day';
  selectedTimeGrouping2: string = 'day';

  // Filters
  enablePropertyFilters: boolean = false;

  // State Management
  isFormInitialized = false;
  attemptedSubmit = false;

  constructor(
    private fb: FormBuilder,
    private analyticService: AnalyticService,
    private eventService: EventService,
    private videoSourceManager: VideoSourceClientManager,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public modalData: { event: { data: IWidgetFormDataRequestModel } },
    public dialogRef: MatDialogRef<WidgetFormComponent, IWidgetFormDataResponseModel>,
  ) {
    if (modalData.event?.data?.data) {
      this.finalWidget = modalData.event?.data?.data;
    }
    if (modalData.event?.data.dashboardId) {
      this.dashboardId = modalData.event?.data.dashboardId;
    }
    if (modalData.event?.data?.mode) {
      this.formMode = modalData.event.data.mode;
    }
    if (modalData.event.data.timeObj) {
      this.timeObj = modalData.event.data.timeObj
    }
  }

  ngOnInit() {

    if (this.finalWidget && this.modalData.event?.data?.operation === Enum_WidgetFormOperation.edit) {
      this.initializeForm(this.finalWidget);
    }
    else {
      this.initializeForm();
    }

    this.setupFormValidation();
  }

  get dataConfigArray(): FormArray {
    return this.widgetForm.controls.dataInputConfig.controls.dataConfig;
  }

  // Property getters for template access
  get selectedFieldNames(): IWidgetFieldNameConfig[] {
    return this.widgetForm.controls.dataInputConfig.controls.fieldNames.value || [];
  }

  // Property getters for template access
  get entityAggregationMethod(): Enum_Method {
    return this.widgetForm.controls.dataInputConfig.controls.method.value;
  }

  get allowRefresh(): boolean {
    return this.widgetForm.controls.allowRefresh.value;
  }

  get isSpecificConfigEnabled(): boolean {
    return this.widgetForm.controls.enableWidgetSpecificConfig.value;
  }

  get showableProperties(): IShowableProperty[] {
    const formArray = this.widgetForm.controls.showableProperties;
    if (!formArray || !formArray.controls) {
      return [];
    }

    return formArray.controls.map(control => ({
      name: control.value.name || '',
      displayName: control.value.displayName || '',
      isMultiValued: control.value.isMultiValued || false,
      isLabel: control.value.isLabel || false,
      multiValuedConfig: control.value.multiValuedConfig ? {
        dependentOnColumn: control.value.multiValuedConfig.dependentOnColumn || undefined,
        valueBasedOnColumn: control.value.multiValuedConfig.valueBasedOnColumn || ''
      } : undefined
    }));
  }


  // Form Initialization
  private initializeForm(widgetData: Widget = null) {
    this.isFormInitialized = false;

    try {
      forkJoin({
        commonProperties: this.eventService.getAllCommonProperties(),
        analytics: this.analyticService.getAllAnalytics()
      }).subscribe((result) => {
        const commonProperties = result.commonProperties;
        const analytics: AnalyticEventModel[] = result.analytics;

        if (commonProperties?.length && analytics?.length) {
          //create EVENT_ENTITIES from analytics

          this.EVENT_ENTITIES = WidgetFormUtils.createEventEntities(analytics);

          this.commonProperties = commonProperties || [];
          this.commonFieldNames = this.commonProperties.map<IWidgetFieldNameConfig>(prop => ({
            name: prop.name,
            columnName: prop.columnName,
            applyAggregation: true,
            type: prop.type,
            rule: null
          }));

          this.entityPropertiesMap = analytics.reduce((acc, entity) => {
            acc[entity.name] = [...entity.properties, ...commonProperties];
            return acc;
          }, {});

          this.createForm();
          this.onEntityTypeSelectChange();
          this.createRuleGroupQueryBuilder([]);
          this.isFormInitialized = true;

          if (widgetData) {
            try {
              this.widgetForm.patchValue({
                id: this.finalWidget.id,
                dashboardId: this.finalWidget.dashboardId
              });

              // Initialize all configurations
              this.initializeBasicConfig(this.finalWidget);
              this.initializeDisplayConfig(this.finalWidget);
              this.initializeDataInputConfig(this.finalWidget);
              this.initializeShowableProperties(this.finalWidget);
              this.initializeWidgetSpecificConfig(this.finalWidget);
              this.initializeFilterConfig(this.finalWidget);
              this.initializeWidgetTileConfig(this.finalWidget);
              this.updateUIStateAfterLoad();

              // For pre-defined widgets, mark steps 1 and 3 as complete and disable form controls
              if (this.formMode === Enum_WidgetFormMode.predefined) {
                this.stepsCompleted[1] = true;
                this.stepsCompleted[3] = true;
                this.disableFormControlsForPredefinedMode();
                // Start from step 2 for pre-defined widgets
                this.currentStep = 2;
              }

              this.updateAllStepCompletions();
              console.log('Form initialized with existing widget data');

            } catch (error) {
              console.error('Error initializing form with widget data:', error);
            }
          }
        }
      });
    } catch (error) {
      console.error('Error initializing form:', error);
      this.isFormInitialized = true;
    }
  }

  private disableFormControlsForPredefinedMode(): void {
    if (this.formMode === Enum_WidgetFormMode.predefined) {
      // Disable Step 1 controls
      this.widgetForm.controls.configurationApproach.disable();
      this.widgetForm.controls.entityConfigType.disable();
      this.widgetForm.controls.widgetType.disable();

      // Disable Step 3 controls
      this.widgetForm.controls.dataInputConfig.disable();
      this.widgetForm.controls.filterConfig.disable();

      // Keep Step 2, 4, and 5 controls enabled
      this.widgetForm.controls.displayConfig.enable();
      if (this.requiresWidgetSpecificConfig()) {
        this.widgetForm.controls.enableWidgetSpecificConfig.enable();
        this.widgetForm.controls.widgetSpecificConfig.enable();
      }
      this.widgetForm.controls.allowRefresh.enable();
      this.widgetForm.controls.refreshInterval.enable();
      this.widgetForm.controls.showablePropertiesSelection.enable();
      this.widgetForm.controls.showableProperties.enable();
    }
  }

  private createForm(): void {
    this.widgetForm = this.fb.group<WidgetFormControls>({
      id: this.fb.control(null),
      dashboardId: this.fb.control(this.dashboardId),
      configurationApproach: this.fb.control('widgetFirst', {
        validators: [Validators.required],
        nonNullable: true
      }),
      entityConfigType: this.fb.control('single', {
        nonNullable: true
      }),
      widgetType: this.fb.control<Enum_WidgetType | null>(null),

      displayConfig: this.fb.group({
        heading: this.fb.control('', {
          validators: [Validators.required],
          nonNullable: true
        }),
        subHeading: this.fb.control(''),
        color: this.fb.control<string>(WIDGET_FORM_CONSTANTS.DEFAULT_COLORS[0], {
          nonNullable: true
        }),
      }),

      dataInputConfig: this.fb.group({
        method: this.fb.control(Enum_Method.Count, { nonNullable: true }),
        isDistinct: this.fb.control(false, { nonNullable: true }),
        entityTypeSelect: this.fb.control(Enum_Schema.Events, { nonNullable: true }),
        entitySelect: this.fb.control<string | null>(null),
        fieldNames: this.fb.control<IWidgetFieldNameConfig[]>([], { nonNullable: true }),
        entities: this.fb.control<string[]>([], { nonNullable: true }),
        dataConfig: this.fb.array<FormGroup<{
          entity: FormControl<string>;
          schemaName: FormControl<Enum_Schema>;
        }>>([]),
        groupBy1: this.fb.control<groupByConf | null>(null),
        groupBy2: this.fb.control<groupByConf | null>(null),
        clubbingTime: this.fb.control<boolean>(false, { nonNullable: true }),
        fieldsAggregationType: this.fb.control<Enum_Method_Aggregation>(Enum_Method_Aggregation.None, {
          nonNullable: true
        }),
      }),


      filterConfig: this.fb.group({
        customFilters: this.fb.control<Record<string, any>>({}, { nonNullable: true }),
        propertyFilters: this.fb.control<RuleSet | null>(null)
      }),

      enableWidgetSpecificConfig: this.fb.control(false),

      widgetSpecificConfig: this.fb.group({
        kpiConf: this.fb.group({
          countValueColumnName: this.fb.control('count', { nonNullable: true }),
          displayValueColumnName: this.fb.control(''),
          imageColumnName: this.fb.control(''),
          showAggregation: this.fb.control(false),
          dataAggregationMethod: this.fb.control(Enum_Method_Aggregation.None),
          hideLabel: this.fb.control(false),
          showChart: this.fb.control(false)
        }),

        donutConf: this.fb.group({
          centerLabel: this.fb.control('Result', { nonNullable: true }),
          centerLabelAggregation: this.fb.control(Enum_Method_Aggregation.None),
          showSeriesLabelValue: this.fb.control(true)
        }),

        tableConf: this.fb.group({
          pagination: this.fb.control(true, { nonNullable: true }),
          pageLimit: this.fb.control<number>(WIDGET_FORM_CONSTANTS.DEFAULT_PAGE_LIMIT, { nonNullable: true }),
          pageNumber: this.fb.control(1, { nonNullable: true })
        })
      }),

      widgetTileConf: this.fb.group({
        x: this.fb.control(0, { nonNullable: true }),
        y: this.fb.control(0, { nonNullable: true }),
        w: this.fb.control(4, { nonNullable: true }),
        h: this.fb.control(4, { nonNullable: true }),
        ...WIDGET_FORM_CONSTANTS.DEFAULT_DIMENSIONS
      } as any),

      // In createForm() method, add:
      showablePropertiesSelection: this.fb.control<string[]>([]),
      showableProperties: this.fb.array<FormGroup<{
        name: FormControl<string>;
        displayName: FormControl<string>;
        isMultiValued: FormControl<boolean>;
        isLabel: FormControl<boolean>;
        multiValuedConfig: FormGroup<{
          dependentOnColumn: FormControl<string | null>;
          valueBasedOnColumn: FormControl<string>;
        }>;
      }>>([]),

      allowRefresh: this.fb.control<boolean>(false),
      refreshInterval: this.fb.control<number>(300),
    });
  }

  accordionTabOpened(event: any): void {
    this.currentStep = event.index + 1;
  }

  // Step Management Methods
  getStepLabels(): string[] {
    const labels = ['Choose Approach', 'Display Config', 'Data Config & Filters'];

    if (this.widgetForm.controls.configurationApproach.value === 'propertiesFirst') {
      labels.push('Widget Type');
    }

    if (this.widgetForm.controls.widgetType.value && this.requiresWidgetSpecificConfig()) {
      labels.push('Widget Configuration');
    }

    labels.push('Review & Submit');

    // Add indicators for pre-defined mode
    if (this.formMode === Enum_WidgetFormMode.predefined) {
      labels[0] = '🔒 Choose Approach'; // Step 1 - locked
      labels[2] = '🔒 Data Config & Filters'; // Step 3 - locked
    }

    return labels;
  }

  isStepComplete(step: number): boolean {
    return this.stepsCompleted[step] === true;
  }

  isStepEditable(step: number): boolean {
    if (this.formMode === Enum_WidgetFormMode.predefined) {
      // Only allow editing steps 2, 4, and 5 for pre-defined widgets
      return step === 2 || step === 4 || step === 5;
    }
    return true; // Normal mode allows all steps
  }

  canNavigateToStep(step: number): boolean {
    if (step === 1) return true;

    // For pre-defined widgets, restrict navigation to steps 1 and 3
    if (this.formMode === Enum_WidgetFormMode.predefined) {
      if (step === 1 || step === 3) {
        return false; // Disable steps 1 and 3
      }
    }

    for (let i = 1; i < step; i++) {
      if (!this.isStepComplete(i)) {
        return false;
      }
    }
    return true;
  }

  toggleStep(step: number): void {
    if (this.currentStep === step) return;

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

  // Configuration Methods
  requiresWidgetSpecificConfig(): boolean {
    const widgetType = this.widgetForm.controls.widgetType.value;
    return widgetType && [
      Enum_WidgetType.KPI1D, Enum_WidgetType.KPI2D,
      Enum_WidgetType.Donut1D, Enum_WidgetType.Donut2D,
      Enum_WidgetType.Table
    ].includes(widgetType);
  }

  toggleConfigurationMode(): void {
    this.isAdvancedMode = !this.isAdvancedMode;

    if (!this.isAdvancedMode) {
      this.resetAdvancedConfigurations();
    }

    this.updateRecommendedWidgets();
    this.updateStepCompletion(3);
  }

  private resetAdvancedConfigurations(): void {
    this.enableGroupBy1 = false;
    this.enableGroupBy2 = false;
    this.enablePropertyFilters = false;
    this.groupBy1SelectionType = null;
    this.groupBy2SelectionType = null;
    this.groupBy1Option = null;
    this.groupBy2Option = null;
    this.groupBy1Model = null;
    this.groupBy2Model = null;
    this.widgetForm.patchValue({
      dataInputConfig: {
        groupBy1: null,
        groupBy2: null
      },
      filterConfig: {
        propertyFilters: null
      }
    });
    this.ruleData = new RuleSet();
  }

  // Event Handlers - Updated for type safety
  onConfigurationApproachChange(): void {
    const value = this.widgetForm.controls.configurationApproach.value;

    if (value === 'widgetFirst') {
      this.widgetForm.controls.widgetType.setValidators(Validators.required);
    } else {
      this.widgetForm.controls.entityConfigType.setValidators(Validators.required);
    }

    this.widgetForm.patchValue({ widgetType: null });
    this.updateRecommendedWidgets();
    this.updateStepCompletion(1);
  }

  onWidgetTypeChange(): void {
    const widgetType = parseInt(this.widgetForm.controls.widgetType.value as any, 10) as Enum_WidgetType;
    this.widgetForm.patchValue({ widgetType: widgetType });
    this.setDefaultWidgetSpecificConfig();

    if (this.widgetForm.controls.configurationApproach.value === 'widgetFirst') {
      this.updateStepCompletion(1);
    } else {
      this.updateStepCompletion(4);
    }

    if (this.requiresWidgetSpecificConfig()) {
      this.updateStepCompletion(5);
    }

    this.isWidgetTypeSelectedInitially = true;
  }

  onEntityTypeSelectChange(): void {
    // const entityType = event.value;
    const entityType = this.widgetForm.controls.dataInputConfig.controls.entityTypeSelect.value as Enum_Schema
    this.widgetForm.patchValue({
      dataInputConfig: {
        entityTypeSelect: entityType,
        entities: [],
        entitySelect: null,
        fieldNames: [],
        method: Enum_Method.Count
      }
    });

    this.selectedEntities = entityType === Enum_Schema.Events
      ? this.EVENT_ENTITIES
      : PUBLIC_ENTITIES;
  }

  onEntityConfigTypeChange(): void {
    const value = this.widgetForm.controls.entityConfigType.value;

    if (value === 'single') {
      this.widgetForm.patchValue({
        dataInputConfig: {
          entitySelect: null
        }
      });

    } else {
      this.widgetForm.patchValue({
        dataInputConfig: {
          entities: [],
          entitySelect: null
        }
      });
    }

    this.clearDataConfigArray();
    this.widgetForm.patchValue({
      dataInputConfig: {
        groupBy1: null,
        groupBy2: null
      }
    });

    this.updateRecommendedWidgets();
    this.updateStepCompletion(1);
  }

  onEntitySelectChange(): void {
    // const selectedEntity = event.value as Enum_Entity;
    const selectedEntity = this.widgetForm.controls.dataInputConfig.controls.entitySelect.value;
    if (selectedEntity) {
      // Update entity properties for dropdown
      this.entityProperties = this.entityPropertiesMap[selectedEntity] || [];
      this.allFieldNames = this.entityProperties.map<IWidgetFieldNameConfig>(
        (prop) => ({
          name: prop.name,
          columnName: prop.columnName,
          applyAggregation: true,
          type: prop.type,
          rule: null, // Initialize with no rule
        })
      );


    } else {
      this.entityProperties = [];
      this.allFieldNames = [];
    }

    this.onEntityChange();
    // Clear field names when entity changes
    this.widgetForm.patchValue({
      dataInputConfig: {
        fieldNames: []
      }
    });

    // Update showable properties options
    this.updateAllShowablePropertiesName();

    this.updateRecommendedWidgets();
    this.updateStepCompletion(3);
  }

  onFieldNamesChange(event: any): void {
    const selectedFields = event.value as IWidgetFieldNameConfig[]
    // Update form control
    this.widgetForm.patchValue({
      dataInputConfig: {
        fieldNames: selectedFields
      }
    });

    if (selectedFields?.length > 1) {
      this.disableGroupBy2();
    }

    // Update showable properties options
    this.updateAllShowablePropertiesName();

    this.updateRecommendedWidgets();
    this.updateStepCompletion(3);
  }

  onCommonPropertiesChange(event: any): void {
    const selectedProperties = event.value as IWidgetFieldNameConfig[];

    this.widgetForm.patchValue({
      dataInputConfig: {
        fieldNames: selectedProperties
      }
    });

    this.updateRecommendedWidgets();
    this.updateStepCompletion(3);
  }

  onFieldsAggregationMethodChange(): void {
    const method = this.widgetForm.controls.dataInputConfig.controls.fieldsAggregationType.value as Enum_Method_Aggregation
    this.widgetForm.patchValue({
      dataInputConfig: {
        fieldsAggregationType: method
      }
    });

    // Update showable properties options
    this.updateAllShowablePropertiesName();
  }

  onEntitiesChange(event: any): void {
    const selectedEntities = event.value as string[];

    if (selectedEntities?.length) {
      this.setupEntityConfigs(selectedEntities);
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

  aggregationMethodChange(event: any): void {
    const method = event.value as Enum_Method;
    const entityValue = this.widgetForm.controls.dataInputConfig.controls.entitySelect.value;

    this.widgetForm.patchValue({
      dataInputConfig: {
        method: method
      }
    });

    if (entityValue && this.entityPropertiesMap[entityValue]) {
      this.entityProperties = WidgetFormUtils.getCompatibleProperties(
        this.entityPropertiesMap[entityValue],
        method
      );
      this.allFieldNames = this.entityProperties.map<IWidgetFieldNameConfig>(prop => ({
        name: prop.name,
        columnName: prop.columnName,
        applyAggregation: true,
        type: prop.type,
        rule: null // Initialize with no rule
      }));

    } else {
      this.entityProperties = [];
      this.allFieldNames = [];
    }

    this.widgetForm.patchValue({
      dataInputConfig: {
        fieldNames: []
      }
    });

    this.updateAllShowablePropertiesName();
  }

  onEntityChange(): void {
    const entityValue = this.widgetForm.controls.dataInputConfig.controls.entitySelect.value;
    const aggregationMethod = this.widgetForm.controls.dataInputConfig.controls.method.value;
    if (entityValue && this.entityPropertiesMap[entityValue]) {
      this.entityProperties = WidgetFormUtils.getCompatibleProperties(
        this.entityPropertiesMap[entityValue],
        aggregationMethod
      );
      this.allFieldNames = this.entityProperties.map<IWidgetFieldNameConfig>(
        (prop) => ({
          name: prop.name,
          columnName: prop.columnName,
          applyAggregation: true,
          type: prop.type,
          rule: null, // Initialize with no rule
        })
      );
    } else {
      this.entityProperties = [];
      this.allFieldNames = [];
    }

    this.updateAllShowablePropertiesName();
    this.createRuleGroupQueryBuilder(this.entityProperties);
  }

  applyAggregationOnField(index: any, event: Event): void {
    const target = event.target as HTMLInputElement;
    const existingField = this.selectedFieldNames[index] as IWidgetFieldNameConfig;
    if (existingField) {
      if (target.checked) {
        existingField.applyAggregation = true;
      }
      else {
        existingField.applyAggregation = false;
      }
    }
  }

  // Field Rules Management
  toggleFieldRule(index: any, event: Event): void {
    const target = event.target as HTMLInputElement;
    const existingField = this.selectedFieldNames[index] as IWidgetFieldNameConfig;
    if (existingField) {
      if (target.checked) {
        existingField.rule = new Rule();
        existingField.rule.field = existingField.name;
        existingField.rule.operator = this.getOpertorsByType[existingField.type][0];
        existingField.rule.type = existingField.type;

      } else {

        existingField.rule = null;
      }
    }
  }


  onFieldRuleOperatorChange(fieldIndex: number, event: Event): void {
    const operator = (event.target as HTMLSelectElement).value;
    this.updateFieldRule(fieldIndex, 'operator', operator);
  }

  onFieldRuleValueChange(fieldIndex: number, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.updateFieldRule(fieldIndex, 'value', value);
  }

  private updateFieldRule(fieldIndex: number, property: string, value: any): void {
    const existingField = this.selectedFieldNames[fieldIndex] as IWidgetFieldNameConfig;
    if (existingField) {
      existingField.rule[property] = value;
    }

  }


  hasGroupBy1TypeError(): boolean {
    return this.enableGroupBy1 && !this.groupBy1SelectionType && this.attemptedSubmit;
  }

  getGroupBy1TypeError(): string {
    return 'Please select a Group By 1 type';
  }

  hasGroupBy1FieldError(): boolean {
    return this.enableGroupBy1 &&
      this.groupBy1SelectionType === 'field' &&
      !this.groupBy1Option &&
      this.attemptedSubmit;
  }

  getGroupBy1FieldError(): string {
    return 'Please select a field for Group By 1';
  }

  hasGroupBy1TimeError(): boolean {
    return this.enableGroupBy1 &&
      this.groupBy1SelectionType === 'time' &&
      !this.selectedTimeGrouping1 &&
      this.attemptedSubmit;
  }

  getGroupBy1TimeError(): string {
    return 'Please select a time grouping for Group By 1';
  }

  // Group By 2 validation methods
  hasGroupBy2TypeError(): boolean {
    return this.enableGroupBy2 && !this.groupBy2SelectionType && this.attemptedSubmit;
  }

  getGroupBy2TypeError(): string {
    return 'Please select a Group By 2 type';
  }

  hasGroupBy2FieldError(): boolean {
    return this.enableGroupBy2 &&
      this.groupBy2SelectionType === 'field' &&
      !this.groupBy2Option &&
      this.attemptedSubmit;
  }

  getGroupBy2FieldError(): string {
    return 'Please select a field for Group By 2';
  }

  hasGroupBy2TimeError(): boolean {
    return this.enableGroupBy2 &&
      this.groupBy2SelectionType === 'time' &&
      !this.selectedTimeGrouping2 &&
      this.attemptedSubmit;
  }

  getGroupBy2TimeError(): string {
    return 'Please select a time grouping for Group By 2';
  }

  // Group By Event Handlers
  toggleGroupBy1(event: any): void {
    this.enableGroupBy1 = (event.target as HTMLInputElement).checked;

    if (!this.enableGroupBy1) {
      this.resetGroupBy1();
      this.enableGroupBy2 = false;
      this.toggleGroupBy2({ target: { checked: false } } as any);
    }

    if (this.widgetForm.controls.configurationApproach.value === 'propertiesFirst') {
      this.widgetForm.patchValue({
        widgetType: null
      });
    }

    this.updateStepCompletion(4)
    this.updateRecommendedWidgets();
    this.updateStepCompletion(3);
  }

  toggleGroupBy2(event: Event): void {
    this.enableGroupBy2 = (event.target as HTMLInputElement).checked;

    if (!this.enableGroupBy2) {
      this.resetGroupBy2();
    }

    if (this.widgetForm.controls.configurationApproach.value === 'propertiesFirst') {
      this.widgetForm.patchValue({
        widgetType: null
      });
    }

    this.updateStepCompletion(4)
    this.updateRecommendedWidgets();
    this.updateStepCompletion(3);
  }

  private resetGroupBy1(): void {
    this.widgetForm.patchValue({
      dataInputConfig: {
        groupBy1: null
      }
    });
    this.groupBy1Model = null;
    this.groupBy1Option = null;
    this.groupBy1SelectionType = null;
  }

  private resetGroupBy2(): void {
    this.widgetForm.patchValue({
      dataInputConfig: {
        groupBy2: null
      }
    });
    this.groupBy2Model = null;
    this.groupBy2Option = null;
    this.groupBy2SelectionType = null;
  }

  getAvailableGroupByTypes(groupByNumber: number): any[] {
    if (groupByNumber === 1) {
      return groupByTypes;
    }

    if (groupByNumber === 2 && this.groupBy1SelectionType === 'time') {
      return groupByTypes.filter(type => type.value === 'field');
    }

    return groupByTypes;
  }

  onSelectGroupByType(groupByNumber: number, event: any): void {
    const selectedValue = event.value;

    if (groupByNumber === 1) {
      this.groupBy1SelectionType = selectedValue;

      if (selectedValue === 'time' && this.groupBy2SelectionType === 'time') {
        this.resetGroupBy2();
      }

      this.resetGroupBy1Model(selectedValue);
    } else if (groupByNumber === 2) {
      this.groupBy2SelectionType = selectedValue;
      this.resetGroupBy2Model(selectedValue);
    }

    this.updateRecommendedWidgets();
    this.updateStepCompletion(3); // Trigger validation update
  }

  private resetGroupBy1Model(selectionType: string): void {
    if (selectionType === 'time') {
      this.groupBy1Model = null;
      this.groupBy1Option = null;
      this.widgetForm.patchValue({
        dataInputConfig: { groupBy1: null }
      });
    } else if (selectionType === 'field') {
      this.selectedTimeGrouping1 = 'day';
      this.groupBy1Model = null;
      this.groupBy1Option = null;
      this.widgetForm.patchValue({
        dataInputConfig: { groupBy1: null }
      });
    }
  }

  private resetGroupBy2Model(selectionType: string): void {
    if (selectionType === 'time') {
      this.groupBy2Model = null;
      this.groupBy2Option = null;
      this.widgetForm.patchValue({
        dataInputConfig: { groupBy2: null }
      });
    } else if (selectionType === 'field') {
      this.selectedTimeGrouping2 = 'day';
      this.groupBy2Model = null;
      this.groupBy2Option = null;
      this.widgetForm.patchValue({
        dataInputConfig: { groupBy2: null }
      });
    }
  }

  onGroupBy1Change(event: any): void {
    const selectedProperty = event.value as Property;
    this.groupBy1Model = this.createGroupByModel(selectedProperty);
    this.groupBy1Option = selectedProperty;

    this.widgetForm.patchValue({
      dataInputConfig: {
        groupBy1: this.groupBy1Model
      }
    });

    this.updateRecommendedWidgets();
    this.updateStepCompletion(3);
  }

  onGroupBy2Change(event: any): void {
    const selectedProperty = event.value as Property;
    this.groupBy2Model = this.createGroupByModel(selectedProperty);
    this.groupBy2Option = selectedProperty;

    this.widgetForm.patchValue({
      dataInputConfig: {
        groupBy2: this.groupBy2Model
      }
    });

    this.updateRecommendedWidgets();
    this.updateStepCompletion(3);
  }

  // Helper Methods
  private createGroupByModel(prop: Property): groupByConf {
    const model = new groupByConf();
    model.name = prop.name;
    model.projectionName = prop.columnName;
    model.type = prop.type;
    model.isTime = false;
    return model;
  }

  private disableGroupBy2(): void {
    this.enableGroupBy2 = false;
    this.groupBy2SelectionType = null;
    this.groupBy2Option = null;
    this.groupBy2Model = null;
    this.widgetForm.patchValue({
      dataInputConfig: {
        groupBy2: null
      }
    });
  }

  updateTimeGrouping(groupByNumber: number, event: any): void {
    const groupByModel = new groupByConf();
    groupByModel.name = event.value;
    groupByModel.projectionName = WidgetFormUtils.capitalizeFirst(event.value);
    groupByModel.type = EventPropertyType.String;
    groupByModel.isTime = true;

    if (groupByNumber === 1) {
      this.groupBy1Model = groupByModel;
      this.selectedTimeGrouping1 = event.value;
      this.widgetForm.patchValue({
        dataInputConfig: { groupBy1: groupByModel }
      });
    } else if (groupByNumber === 2) {
      this.groupBy2Model = groupByModel;
      this.selectedTimeGrouping2 = event.value;
      this.widgetForm.patchValue({
        dataInputConfig: { groupBy2: groupByModel }
      });
    }

    this.updateRecommendedWidgets();
    this.updateStepCompletion(3);
  }

  // Property Filters
  togglePropertyFilters(event: Event): void {
    this.enablePropertyFilters = (event.target as HTMLInputElement).checked;

    if (!this.enablePropertyFilters) {
      this.ruleData = new RuleSet();
      this.widgetForm.patchValue({
        filterConfig: {
          propertyFilters: null
        }
      });
    }

    this.updateStepCompletion(3);
  }

  convertRulesToPropertyFilters(): any {
    return this.enablePropertyFilters ? this.ruleData : null;
  }

  // Utility Methods
  getAllAvailableProperties(): Property[] {
    const properties: Property[] = [];

    if (this.widgetForm.controls.entityConfigType.value === 'single') {
      const entityValue = this.widgetForm.controls.dataInputConfig.controls.entitySelect.value;
      if (entityValue && this.entityPropertiesMap[entityValue]) {
        properties.push(...this.entityPropertiesMap[entityValue]);
      }
    } else {
      const selectedEntities = this.widgetForm.controls.dataInputConfig.controls.entities.value || [];
      for (const entityValue of selectedEntities) {
        const entityProps = this.entityPropertiesMap[entityValue] || [];
        properties.push(...entityProps);
      }
      properties.push(...this.commonProperties);
    }

    return properties;
  }

  getAvailableColumnNames(): string[] {
    const fieldNames = this.selectedFieldNames;
    const columns = ['count'];

    if (fieldNames?.length > 0) {
      fieldNames.forEach((field: IWidgetFieldNameConfig) => {
        if (field?.name) {
          columns.push(field.name);
        }
      });
    }

    columns.push('displayValue');
    return [...new Set(columns)];
  }

  shouldShowGroupBy1(): boolean {
    const widgetType = this.widgetForm.controls.widgetType.value;
    if (this.isWidgetTypeSelectedInitially) {
      var TwoDimensionalWidgetTypes = getWidgetDropdownItemsByDimension(WidgetDimension.TwoDimensional);
      var ThreeDimensionalWidgetTypes = getWidgetDropdownItemsByDimension(WidgetDimension.ThreeDimensional);
      var requiredTypes = [...TwoDimensionalWidgetTypes, ...ThreeDimensionalWidgetTypes];
      if (requiredTypes.some((type) => type.value == widgetType)) {
        return true;
      } else {
        return false;
      }
    }

    return true;
  }

  shouldShowGroupBy2(): boolean {
    if (!this.enableGroupBy1) return false;

    const widgetType = this.widgetForm.controls.widgetType.value;
    if (this.isWidgetTypeSelectedInitially) {
      var requiredTypes = getWidgetDropdownItemsByDimension(WidgetDimension.ThreeDimensional);
      if (requiredTypes.some((type) => type.value == widgetType)) {
        return true;
      } else {
        return false;
      }
    }

    const selectedFields = this.selectedFieldNames;
    if (selectedFields?.length > 1) {
      return false;
    }

    return true;
  }

  // Data Config Array Methods
  getDataConfigControls(): FormGroup[] {
    return this.dataConfigArray.controls as FormGroup[];
  }

  clearDataConfigArray(): void {
    this.entityProperties = [];
    this.allFieldNames = [];


    while (this.dataConfigArray.length > 0) {
      this.dataConfigArray.removeAt(0);
    }

    this.updateAllShowablePropertiesName();
  }

  setupEntityConfigs(entityValues: string[]): void {
    this.clearDataConfigArray();

    for (const entityValue of entityValues) {
      const event_entity = this.EVENT_ENTITIES.find(entity => entity.value == entityValue)
      const entityFormGroup = this.fb.group({
        entity: this.fb.control<string>(entityValue, {
          validators: [Validators.required],
          nonNullable: true
        }),
        schemaName: this.fb.control<Enum_Schema>(event_entity.schema, {
          validators: [Validators.required],
          nonNullable: true
        })
      });
      this.dataConfigArray.push(entityFormGroup);

    }
  }

  // Widget Recommendation Logic
  canRecommendWidgets(): boolean {
    if (this.widgetForm.controls.configurationApproach.value === 'propertiesFirst') {
      if (this.widgetForm.controls.entityConfigType.value === 'single') {
        const entity = this.widgetForm.controls.dataInputConfig.controls.entitySelect.value;
        const aggregationMethod = this.widgetForm.controls.dataInputConfig.controls.method.value;

        if (aggregationMethod === Enum_Method.Sum) {
          return !!entity && this.selectedFieldNames.length > 0;
        } else {
          return !!entity;
        }
      } else {
        const entities = this.widgetForm.controls.dataInputConfig.controls.entities.value || [];
        return entities.length > 0;
      }
    }
    return false;
  }


  private updateAllShowablePropertiesName(): void {
    const fieldNames = this.selectedFieldNames;

    this.allShowablePropertiesName = [];

    if (fieldNames && fieldNames.length > 0) {
      fieldNames.forEach((fieldName: IWidgetFieldNameConfig) => {

        this.allShowablePropertiesName.push({
          name: fieldName.name,
          displayName: fieldName.columnName,
          isMultiValued: false,
          isLabel: fieldName.type === EventPropertyType.String,
        });
      });
    }

    // Add aggregation method if applicable
    const fieldAggregationType = this.widgetForm.controls.dataInputConfig.controls.fieldsAggregationType.value;
    if (fieldAggregationType && (fieldAggregationType == Enum_Method_Aggregation.Total || fieldAggregationType == Enum_Method_Aggregation.Least || fieldAggregationType == Enum_Method_Aggregation.Greatest)) {
      this.allShowablePropertiesName.push({
        name: Enum_Method_Aggregation_With_Labels[fieldAggregationType],
        displayName: Enum_Method_Aggregation_With_Labels[fieldAggregationType],
        isMultiValued: false,
        isLabel: false
      });
    }

    const showablePropertiesArray = this.widgetForm.controls.showableProperties;
    showablePropertiesArray.clear();
    this.widgetForm.controls.showablePropertiesSelection.reset();
  }

  updateRecommendedWidgets(): void {
    if (!this.canRecommendWidgets()) {
      this.recommendedWidgets = [];
      return;
    }

    const groupBy1 = this.widgetForm.controls.dataInputConfig.controls.groupBy1.value;
    const groupBy2 = this.widgetForm.controls.dataInputConfig.controls.groupBy2.value;
    const fieldNames = this.selectedFieldNames;

    let availableWidgets = [...allWidgetTypes];

    if (fieldNames.length === 1 && groupBy1 && groupBy2) {
      availableWidgets = getWidgetDropdownItemsByDimension(WidgetDimension.ThreeDimensional);
    } else if (groupBy1) {
      availableWidgets = getWidgetDropdownItemsByDimension(WidgetDimension.TwoDimensional);
    } else {
      availableWidgets = getWidgetDropdownItemsByDimension(WidgetDimension.OneDimensional);
    }

    this.recommendedWidgets = availableWidgets;
  }

  onShowablePropertiesChange(event: any): void {
    const selectedProps = event.value;

    // Clear existing showable properties FormArray
    const showablePropertiesArray = this.widgetForm.controls.showableProperties;
    showablePropertiesArray.clear();

    selectedProps.forEach((prop) => {
      const isEntityProp = this.entityProperties.find(entityProp => entityProp.name.toLowerCase() == prop.toLowerCase());

      if (isEntityProp) {
        showablePropertiesArray.push(this.createShowablePropertyFormGroup({
          name: isEntityProp.name,
          displayName: isEntityProp.columnName,
          isLabel: false,
          isMultiValued: false
        }));
      }
      else {
        const isAggregationProp =
          Enum_Method_Aggregation_With_Labels[this.widgetForm.controls.dataInputConfig.controls.fieldsAggregationType.value]?.toLowerCase() === prop.toLowerCase();

        if (isAggregationProp) {
          showablePropertiesArray.push(this.createShowablePropertyFormGroup(
            {
              name: Enum_Method_Aggregation_With_Labels[this.widgetForm.controls.dataInputConfig.controls.fieldsAggregationType.value],
              displayName: Enum_Method_Aggregation_With_Labels[this.widgetForm.controls.dataInputConfig.controls.fieldsAggregationType.value],
              isLabel: false,
              isMultiValued: false
            }));
        }
      }
    })

    // Update step completion if needed
    this.updateStepCompletion(3);
  }

  selectWidget(widgetType: Enum_WidgetType): void {
    this.widgetForm.patchValue({ widgetType: widgetType });
    this.setDefaultWidgetSpecificConfig();

    if (this.widgetForm.controls.configurationApproach.value === 'propertiesFirst') {
      this.updateStepCompletion(4);
    }

    if (this.requiresWidgetSpecificConfig()) {
      this.updateStepCompletion(5);
    }
  }

  // Step Completion Logic
  updateStepCompletion(step: number): void {
    const errors = this.getStepErrors(step);
    this.stepsCompleted[step] = errors.length === 0;

    // Also validate dependent steps
    if (step < 5) {
      this.updateStepCompletion(step + 1);
    }
  }

  // Method to update all step completions
  private updateAllStepCompletions(): void {
    for (let i = 1; i <= 5; i++) {
      this.updateStepCompletion(i);
    }
  }

  private validateStep3(): string[] {
    const errors: string[] = [];
    const entityConfigType = this.widgetForm?.controls.entityConfigType.value;

    if (entityConfigType === 'single') {
      const entity = this.widgetForm.controls.dataInputConfig.controls.entitySelect.value;
      const aggregationMethod = this.widgetForm.controls.dataInputConfig.controls.method.value;

      if (!entity) {
        errors.push('Please select an entity');
      }

      if (aggregationMethod === Enum_Method.Sum && this.selectedFieldNames.length === 0) {
        errors.push('Please select at least one field for aggregation');
      }
    } else {
      const entities = this.widgetForm?.controls.dataInputConfig.controls.entities.value || [];
      if (entities.length === 0) {
        errors.push('Please select at least one entity');
      }
    }

    return errors;
  }

  canProceedToReview(): boolean {
    const approach = this.widgetForm.controls.configurationApproach.value;
    const hasWidgetSpecificConfig = this.requiresWidgetSpecificConfig();

    if (approach === 'widgetFirst') {
      if (hasWidgetSpecificConfig) {
        return this.isStepComplete(1) && this.isStepComplete(2) &&
          this.isStepComplete(3) && this.isStepComplete(5);
      } else {
        return this.isStepComplete(1) && this.isStepComplete(2) && this.isStepComplete(3);
      }
    } else {
      if (hasWidgetSpecificConfig) {
        return this.isStepComplete(1) && this.isStepComplete(2) &&
          this.isStepComplete(3) && this.isStepComplete(4) && this.isStepComplete(5);
      } else {
        return this.isStepComplete(1) && this.isStepComplete(2) &&
          this.isStepComplete(3) && this.isStepComplete(4);
      }
    }
  }

  // Widget Configuration
  setDefaultWidgetSpecificConfig(): void {
    const widgetType = this.widgetForm.controls.widgetType.value;

    if (widgetType === Enum_WidgetType.KPI1D || widgetType === Enum_WidgetType.KPI2D) {
      this.widgetForm.patchValue({
        widgetSpecificConfig: {
          kpiConf: {
            countValueColumnName: null,
            displayValueColumnName: null,
            hideLabel: false,
            showChart: false
          }
        }
      });
    } else if (widgetType === Enum_WidgetType.Donut1D || widgetType === Enum_WidgetType.Donut2D) {
      this.widgetForm.patchValue({
        widgetSpecificConfig: {
          donutConf: {
            centerLabel: 'Result',
            centerLabelAggregation: Enum_Method_Aggregation.None,
            showSeriesLabelValue: true
          }
        }
      });
    } else if (widgetType === Enum_WidgetType.Table) {
      this.widgetForm.patchValue({
        widgetSpecificConfig: {
          tableConf: {
            pagination: true,
            pageLimit: WIDGET_FORM_CONSTANTS.DEFAULT_PAGE_LIMIT,
            pageNumber: 1
          }
        }
      });
    }
  }

  // Query Builder Setup
  setConfig(): void {
    this.config = this.columnArray;
  }

  createRuleGroupQueryBuilder(properties: Property[]): void {
    properties.forEach((property: Property) => {
      if (property.type !== EventPropertyType.Guid) {
        if (property.name.toLowerCase() === "videosourceid") {
          const videoSources = this.videoSourceManager.getAllVideoSourceInMemory();
          let videoSourcesName = "";
          for (let i = 0; i < videoSources.length; i++) {
            videoSourcesName += videoSources[i].name + ",";
          }
          property.defaultValues = videoSourcesName.slice(0, -1);
          property.type = EventPropertyType.MultiSelect
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

  createFilterPropertyObject(propertyName: string, name: string, type: EventPropertyType, options: any): void {
    const operators = this.getOpertorsByType(type);
    const processedOptions = this.setDefaultValuesByType(options, type);

    const object: any = {
      name: name,
      type: EventPropertyType[type],
      operators: operators
    };

    if (processedOptions !== null) {
      object.options = processedOptions;
    }

    this.columnArray.fields[propertyName] = object;
    this.setConfig();
  }

  getOpertorsByType(type: EventPropertyType): string[] {
    return RuleOperators[type] || ["Equal", "NotEqual"];
  }

  setDefaultValuesByType(options: any, type: EventPropertyType): any {
    if (typeof options === "string") {
      return options.includes(",")
        ? options.split(",").map((value: string) => value.trim())
        : [options.trim()];
    }

    if (type === EventPropertyType.Boolean) {
      return [true, false];
    }

    return options;
  }

  // Validation and Form Submission
  canSubmitForm(): boolean {
    if (!this.widgetForm?.controls.displayConfig.controls.heading.value) {
      return false;
    }

    if (!this.widgetForm?.controls.widgetType.value) {
      return false;
    }

    const entityValidation = this.validateForm();

    // if (this.requiresWidgetSpecificConfig()) {
    //   entityValidation = entityValidation && this.validateWidgetSpecificConfig();
    // }

    return entityValidation;
  }

  validateForm(): boolean {
    const warnings = this.getValidationWarnings();
    if (warnings.length > 0) {
      return false;
    }
    return true;
  }


  onSubmit(): void {
    this.attemptedSubmit = true;
    this.markFormGroupTouched(this.widgetForm);

    if (!this.canSubmitForm()) {
      // Scroll to first error
      this.scrollToFirstError();
      return;
    }

    this.showValidationWarnings();

    try {
      const finalWidget = this.createWidget();
      this.finalWidget = finalWidget;
      alert(SUCCESS_MESSAGES.WIDGET_CREATED);
      this.dialogRef.close({
        widgetData: this.finalWidget,
        operation: this.modalData.event?.data?.operation
      });
    } catch (error) {
      console.error('Error creating widget:', error);
      alert(`${ERROR_MESSAGES.WIDGET_CREATION_FAILED}: ${(error as Error).message}`);
    }
  }

  // Enhanced getPreview method with validation
  getPreview(): void {
    this.attemptedSubmit = true;
    this.markFormGroupTouched(this.widgetForm);

    if (!this.canSubmitForm()) {
      this.scrollToFirstError();
      return;
    }

    this.showValidationWarnings();

    try {
      const finalWidget = this.createWidget();
      console.log('Widget created:', finalWidget);

      const event: any = {};
      event.component = WidgetFormPreviewComponent;
      event.data = finalWidget;

      const dialogData: CommonModalData = {
        event: event,
        width: "900px",
        heading: "Widget Preview",
        footerButtons: [
          {
            Callback: "Close",
            title: "Close",
            basedOnChildTemplate: true,
            style: "i2v-button tertiary-outline medium",
          },
        ],
        showPreviousButton: false,
        showNextButton: false,
        showBackButton: false,
      };

      const ref = this.dialog.open(CommonModalComponent, {
        panelClass: "custom-dialog-container",
        data: dialogData,
      });

      ref.afterClosed().subscribe((data) => { });
    } catch (error) {
      console.error('Error in preview widget:', error);
      alert(`${ERROR_MESSAGES.WIDGET_CREATION_FAILED}: ${(error as Error).message}`);
    }
  }

  // Method to scroll to first error field
  private scrollToFirstError(): void {
    setTimeout(() => {
      const firstErrorElement = document.querySelector('.form-control.error, .p-dropdown.error, .p-multiselect.error');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

        // Try to focus the element
        if (firstErrorElement instanceof HTMLElement) {
          firstErrorElement.focus();
        }
      }
    }, 100);
  }

  Cancel(): void {
    this.dialogRef.close({ widgetData: null, operation: Enum_WidgetFormOperation.none });
  }

  // Widget Creation (Updated to use typed form)
  private createWidget(): Widget {
    // For pre-defined widgets, ensure we use the original data configuration
    if (this.formMode === Enum_WidgetFormMode.predefined && this.finalWidget) {
      const formValue = this.widgetForm.getRawValue() as any; // Use getRawValue to include disabled controls

      // Create updated widget preserving original data configuration
      const updatedWidget = { ...this.finalWidget };

      // Update only editable configurations
      // Step 2 - Display Config
      updatedWidget.displayConfig = {
        heading: formValue.displayConfig.heading,
        subHeading: formValue.displayConfig.subHeading,
        color: formValue.displayConfig.color,
        svgIcon: this.finalWidget.displayConfig?.svgIcon
      };

      // Step 4 - Widget Type (if changed)
      if (this.widgetForm.controls.configurationApproach.value === 'propertiesFirst') {
        updatedWidget.widgetType = formValue.widgetType!;
      }

      // Step 5 - Widget Specific Config and other settings
      if (this.requiresWidgetSpecificConfig() && this.isSpecificConfigEnabled) {
        this.updateWidgetSpecificConfigForPredefined(updatedWidget, formValue);
      }

      // Update refresh settings
      updatedWidget.allowRefresh = formValue.allowRefresh;
      updatedWidget.refreshInterval = formValue.refreshInterval;

      // Update showable properties
      updatedWidget.showableProperties = this.showableProperties;

      return updatedWidget;
    }

    // For normal mode, use the existing createWidget logic
    const formValue = this.widgetForm.value as WidgetFormValue;
    const dimension = this.determineDimension();
    const fieldNames = this.selectedFieldNames;
    const fieldsAggregationType = this.widgetForm.controls.dataInputConfig.controls.fieldsAggregationType.value;


    let showablePropertiesArray = [];
    if (fieldNames && fieldNames.length > 0) {
      if (dimension === WidgetDimension.ThreeDimensional) {
        if (fieldNames.length > 1 && fieldsAggregationType != Enum_Method_Aggregation.None) {
          showablePropertiesArray = this.createShowableProperties([], true);
        }
      }
      this.widgetForm.controls.showableProperties.controls.forEach(control => showablePropertiesArray.push({
        name: control.value.name || '',
        displayName: control.value.displayName || '',
        isMultiValued: control.value.isMultiValued || false,
        isLabel: control.value.isLabel || false,
        multiValuedConfig: control.value.multiValuedConfig ? {
          dependentOnColumn: control.value.multiValuedConfig.dependentOnColumn || undefined,
          valueBasedOnColumn: control.value.multiValuedConfig.valueBasedOnColumn || ''
        } : undefined
      }));
    }
    else {
      var entityName = this.widgetForm.controls.dataInputConfig.controls.entitySelect.value;
      if (this.widgetForm.controls.entityConfigType.value === 'single') {
        showablePropertiesArray.push({
          name: entityName,
          displayName: entityName,
          isMultiValued: false,
          isLabel: false,
          multiValuedConfig: null
        });
      } else {
        this.widgetForm.controls.dataInputConfig.controls.entities.value.forEach((entity) => {
          showablePropertiesArray.push({
            name: entity,
            displayName: entity,
            isMultiValued: false,
            isLabel: false,
            multiValuedConfig: null
          });
        })
      }
    }
    const dataConfig = this.createDataConfig();
    const baseWidgetConfig = this.createBaseWidgetConfig(showablePropertiesArray);

    const dataInputConfig = this.createDataInputConfig(dimension, fieldNames, dataConfig);
    const constructorProps = this.createConstructorProps(baseWidgetConfig, dataInputConfig, dimension);

    const widgetType = formValue.widgetType!;
    const validation = WidgetFactory.validateWidgetConfiguration(widgetType, dataInputConfig, this.widgetForm.controls.showablePropertiesSelection.value);

    if (!validation.isValid) {
      throw new Error(`${ERROR_MESSAGES.CONFIGURATION_INVALID}: ${validation.errors.join(', ')}`);
    }

    const finalWidget = WidgetFactory.createWidget(constructorProps, widgetType);
    finalWidget.dimension = dimension;
    finalWidget.isPredefinedWidget = false;
    finalWidget.canBeRemoved = true;
    return finalWidget;
  }

  private determineDimension(): WidgetDimension {
    const groupBy1 = this.widgetForm.controls.dataInputConfig.controls.groupBy1.value;
    const groupBy2 = this.widgetForm.controls.dataInputConfig.controls.groupBy2.value;

    if (groupBy1) {
      return groupBy2 ? WidgetDimension.ThreeDimensional : WidgetDimension.TwoDimensional;
    }
    return WidgetDimension.OneDimensional;
  }

  private createShowableProperties(props: IWidgetFieldNameConfig[], addFieldsAggregationType: boolean = false): IShowableProperty[] {
    const showableProperties: IShowableProperty[] = [];
    const entityValue = this.widgetForm.controls.dataInputConfig.controls.entitySelect.value;

    props.forEach((propValue: IWidgetFieldNameConfig) => {
      const propInfo = this.entityPropertiesMap[entityValue]?.find(p => p.name.toLowerCase() === propValue.name.toLowerCase());
      if (propInfo) {
        showableProperties.push({
          name: propValue.name,
          displayName: propInfo.name,
          isMultiValued: false,
          isLabel: propInfo.type === EventPropertyType.String
        });
      }
    });

    if (addFieldsAggregationType) {
      const fieldAggregation = this.widgetForm.controls.dataInputConfig.controls.fieldsAggregationType.value as Enum_Method_Aggregation;
      showableProperties.push({
        name: fieldAggregation.toString(),
        displayName: fieldAggregation.toString(),
        isMultiValued: false,
        isLabel: false
      })

      return showableProperties;
    }

    return showableProperties;
  }

  private addShowableProperty(property?: Partial<IShowableProperty>): void {
    const formGroup = this.createShowablePropertyFormGroup(property);
    this.widgetForm.controls.showableProperties.push(formGroup);
  }

  private createDataConfig(): IWidgetDataConfig[] {
    if (this.widgetForm.controls.entityConfigType.value === 'single') {
      return [{
        entity: this.widgetForm.controls.dataInputConfig.controls.entitySelect.value,
        schemaName: this.widgetForm.controls.dataInputConfig.controls.entityTypeSelect.value as Enum_Schema
      }];
    } else {
      const dataConfigs = this.getDataConfigControls();
      return dataConfigs
        .filter(config => config.get('schemaName')?.value)
        .map(config => ({
          entity: config.get('entity')?.value,
          schemaName: config.get('schemaName')?.value as Enum_Schema
        }));
    }
  }

  private createShowablePropertyFormGroup(property?: Partial<IShowableProperty>): FormGroup {
    return this.fb.group({
      name: this.fb.control(property?.name || ''),
      displayName: this.fb.control(property?.displayName || ''),
      isMultiValued: this.fb.control(property?.isMultiValued || false),
      isLabel: this.fb.control(property?.isLabel || false),
      multiValuedConfig: this.fb.group({
        dependentOnColumn: this.fb.control<string | null>(property?.multiValuedConfig?.dependentOnColumn || null),
        valueBasedOnColumn: this.fb.control(property?.multiValuedConfig?.valueBasedOnColumn || '')
      })
    });
  }

  private addShowablePropertiesToForm(showableProperties: IShowableProperty[]): void {
    const showablePropertiesArray = this.widgetForm.controls.showableProperties;
    showablePropertiesArray.clear();

    showableProperties.forEach(property => {
      showablePropertiesArray.push(this.createShowablePropertyFormGroup(property));
    });
  }

  private createBaseWidgetConfig(showableProperties: IShowableProperty[]): IBaseWidgetConstructorProps {
    // Add showable properties to form if needed
    this.addShowablePropertiesToForm(showableProperties);

    const displayConfigValue = this.widgetForm.controls.displayConfig.value;
    const displayConfig: IWidgetDisplayConfig = {
      heading: displayConfigValue.heading || '',
      subHeading: displayConfigValue.subHeading || '',
      color: displayConfigValue.color || '#0d6efd',
      svgIcon: undefined // Optional property
    };

    return {
      id: this.widgetForm.controls.id.value ? this.widgetForm.controls.id.value : WidgetFormUtils.generateUUID(),
      dashboardId: this.widgetForm.controls.dashboardId.value,
      displayConfig: displayConfig,
      showableProperties: showableProperties,
      widgetTileConf: this.widgetForm.controls.widgetTileConf.value,
      widgetInteractivityConfig: {
        isWidgetHidden: false,
        max: 20
      },
      filterConfig: {
        customFilters: {},
        propertyFilters: this.enablePropertyFilters ? this.convertRulesToPropertyFilters() : null,
        disableTimeFilter: false,
        startTime: this.timeObj.startTime,
        endTime: this.timeObj.endTime,
        isDashboardFilterApplied: true
      },
      allowRefresh: this.widgetForm.controls.allowRefresh.value,
      refreshInterval: this.widgetForm.controls.refreshInterval.value
    };
  }

  private createDataInputConfig(
    dimension: WidgetDimension,
    fieldNames: IWidgetFieldNameConfig[],
    dataConfig: IWidgetDataConfig[]
  ): IOneDimensionDataInputConfig | ITwoDimensionDataInputConfig | IThreeDimensionDataInputConfig {
    const baseConfig = {
      isDistinct: this.widgetForm.controls.dataInputConfig.controls.isDistinct.value,
      method: this.widgetForm.controls.dataInputConfig.controls.method.value,
      dataConfig: dataConfig,
      fieldNames: fieldNames,
      fieldsAggregationType: this.widgetForm.controls.dataInputConfig.controls.fieldsAggregationType.value,
    };

    switch (dimension) {
      case WidgetDimension.OneDimensional:
        return baseConfig as IOneDimensionDataInputConfig;

      case WidgetDimension.TwoDimensional:
        return {
          ...baseConfig,
          groupBy1: this.widgetForm.controls.dataInputConfig.controls.groupBy1.value,
          clubbingTime: this.widgetForm.controls.dataInputConfig.controls.clubbingTime.value,
        } as ITwoDimensionDataInputConfig;

      case WidgetDimension.ThreeDimensional:
        return {
          ...baseConfig,
          groupBy1: this.widgetForm.controls.dataInputConfig.controls.groupBy1.value,
          groupBy2: this.widgetForm.controls.dataInputConfig.controls.groupBy2.value,
          clubbingTime: this.widgetForm.controls.dataInputConfig.controls.clubbingTime.value,
        } as IThreeDimensionDataInputConfig;

      default:
        return baseConfig as IOneDimensionDataInputConfig;
    }
  }

  private createConstructorProps(
    baseWidgetConfig: IBaseWidgetConstructorProps,
    dataInputConfig: any,
    dimension: WidgetDimension
  ): any {
    const widgetType = this.widgetForm.controls.widgetType.value;

    // Handle widget-specific configurations
    if (widgetType === Enum_WidgetType.Donut1D) {
      const donutConf: DonutConf = {
        centerLabel: this.widgetForm.controls.widgetSpecificConfig.controls.donutConf.controls.centerLabel.value,
        centerLabelAggregation: this.widgetForm.controls.widgetSpecificConfig.controls.donutConf.controls.centerLabelAggregation.value,
        showSeriesLabelValue: this.widgetForm.controls.widgetSpecificConfig.controls.donutConf.controls.showSeriesLabelValue.value,
      };

      return {
        ...baseWidgetConfig,
        widgetType: widgetType,
        dataInputConfig: dataInputConfig,
        donutConf: donutConf
      } as DonutChart1DWidget;
    }

    if (widgetType === Enum_WidgetType.Donut2D) {
      const donutConf: DonutConf = {
        centerLabel: this.widgetForm.controls.widgetSpecificConfig.controls.donutConf.controls.centerLabel.value,
        centerLabelAggregation: this.widgetForm.controls.widgetSpecificConfig.controls.donutConf.controls.centerLabelAggregation.value,
        showSeriesLabelValue: this.widgetForm.controls.widgetSpecificConfig.controls.donutConf.controls.showSeriesLabelValue.value,
      };

      return {
        ...baseWidgetConfig,
        dataInputConfig: dataInputConfig,
        donutConf: donutConf
      } as DonutChart2DWidget;
    }

    if (widgetType === Enum_WidgetType.KPI1D) {
      const kpiConf: KPIConf = {
        countValueColumnName: this.widgetForm.controls.widgetSpecificConfig.controls.kpiConf.controls.countValueColumnName.value,
        displayValueColumnName: this.widgetForm.controls.widgetSpecificConfig.controls.kpiConf.controls.displayValueColumnName.value,
        imageColumnName: this.widgetForm.controls.widgetSpecificConfig.controls.kpiConf.controls.imageColumnName.value,
        hideLabel: this.widgetForm.controls.widgetSpecificConfig.controls.kpiConf.controls.hideLabel.value,
        showChart: this.widgetForm.controls.widgetSpecificConfig.controls.kpiConf.controls.showChart.value,
        showAggregation: this.widgetForm.controls.widgetSpecificConfig.controls.kpiConf.controls.showAggregation.value,
        dataAggregationMethod: this.widgetForm.controls.widgetSpecificConfig.controls.kpiConf.controls.dataAggregationMethod.value,
      };

      return {
        ...baseWidgetConfig,
        dataInputConfig: dataInputConfig,
        kpiConf: kpiConf
      } as KPI1DWidgetConstructorProps;
    }

    if (widgetType === Enum_WidgetType.KPI2D) {
      const kpiConf: KPIConf = {
        countValueColumnName: this.widgetForm.controls.widgetSpecificConfig.controls.kpiConf.controls.countValueColumnName.value,
        displayValueColumnName: this.widgetForm.controls.widgetSpecificConfig.controls.kpiConf.controls.displayValueColumnName.value,
        imageColumnName: this.widgetForm.controls.widgetSpecificConfig.controls.kpiConf.controls.imageColumnName.value,
        showAggregation: this.widgetForm.controls.widgetSpecificConfig.controls.kpiConf.controls.showAggregation.value,
        dataAggregationMethod: this.widgetForm.controls.widgetSpecificConfig.controls.kpiConf.controls.dataAggregationMethod.value,
        hideLabel: this.widgetForm.controls.widgetSpecificConfig.controls.kpiConf.controls.showChart.value,
        showChart: this.widgetForm.controls.widgetSpecificConfig.controls.kpiConf.controls.hideLabel.value,
      };

      return {
        ...baseWidgetConfig,
        dataInputConfig: dataInputConfig as ITwoDimensionDataInputConfig,
        kpiConf: kpiConf
      } as KPI2DWidgetConstructorProps;
    }

    if (widgetType === Enum_WidgetType.Table) {
      const tableConf: TableConf = {
        pagination: this.widgetForm.controls.widgetSpecificConfig.controls.tableConf.controls.pagination.value,
        pageLimit: this.widgetForm.controls.widgetSpecificConfig.controls.tableConf.controls.pageLimit.value,
        pageNumber: this.widgetForm.controls.widgetSpecificConfig.controls.tableConf.controls.pageNumber.value,
      };

      return {
        ...baseWidgetConfig,
        dataInputConfig: dataInputConfig as any,
        tableConf: tableConf
      } as TableWidgetConstructorProps;
    }

    // Default case for other widget types
    switch (dimension) {
      case WidgetDimension.OneDimensional:
        return {
          ...baseWidgetConfig,
          dataInputConfig: dataInputConfig as IOneDimensionDataInputConfig
        } as OneDimensionWidgetConstructorProps;
      case WidgetDimension.TwoDimensional:
        return {
          ...baseWidgetConfig,
          dataInputConfig: dataInputConfig as ITwoDimensionDataInputConfig
        } as TwoDimensionWidgetConstructorProps;
      case WidgetDimension.ThreeDimensional:
        return {
          ...baseWidgetConfig,
          dataInputConfig: dataInputConfig as IThreeDimensionDataInputConfig
        } as ThreeDimensionWidgetConstructorProps;
      default:
        return {
          ...baseWidgetConfig,
          dataInputConfig: dataInputConfig as IOneDimensionDataInputConfig
        } as OneDimensionWidgetConstructorProps;
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

  private updateWidgetSpecificConfigForPredefined(widget: Widget, formValue: WidgetFormValue): void {
    const widgetType = widget.widgetType;

    switch (widgetType) {
      case Enum_WidgetType.KPI1D:
      case Enum_WidgetType.KPI2D:
        (widget as any).kpiConf = {
          CountValueColumnName: formValue.widgetSpecificConfig.kpiConf.countValueColumnName,
          DisplayValueColumnName: formValue.widgetSpecificConfig.kpiConf.displayValueColumnName,
          ImageColumnName: formValue.widgetSpecificConfig.kpiConf.imageColumnName,
          showChart: formValue.widgetSpecificConfig.kpiConf.showChart,
          hideLabel: formValue.widgetSpecificConfig.kpiConf.hideLabel,
          showAggregation: formValue.widgetSpecificConfig.kpiConf.showAggregation,
          dataAggregationMethod: formValue.widgetSpecificConfig.kpiConf.dataAggregationMethod
        };
        break;

      case Enum_WidgetType.Donut1D:
      case Enum_WidgetType.Donut2D:
        (widget as any).donutConf = {
          centerLabel: formValue.widgetSpecificConfig.donutConf.centerLabel,
          centerLabelAggregation: formValue.widgetSpecificConfig.donutConf.centerLabelAggregation,
          showSeriesLabelValue: formValue.widgetSpecificConfig.donutConf.showSeriesLabelValue
        };
        break;

      case Enum_WidgetType.Table:
        (widget as any).tableConf = {
          pagination: formValue.widgetSpecificConfig.tableConf.pagination,
          pageLimit: formValue.widgetSpecificConfig.tableConf.pageLimit,
          pageNumber: formValue.widgetSpecificConfig.tableConf.pageNumber
        };
        break;
    }
  }

  // Template Helper Methods
  getPropertyDisplayName(property: Property): string {
    return property.columnName;
  }

  isPropertySelected(property: Property, selectedProperties: Property[]): boolean {
    return selectedProperties.some(selected => selected.name.toLowerCase() === property.name.toLowerCase());
  }

  // Summary Methods for Review Step
  getWidgetTypeLabel(): string {
    const widgetType = this.widgetForm.controls.widgetType.value;
    const widget = this.widgetTypes.find(w => w.value === widgetType);
    return widget ? widget.label : 'None Selected';
  }

  getSelectedPropertiesSummary(): string {
    const fieldNames = this.selectedFieldNames;
    if (fieldNames.length === 0) return 'None selected';
    return fieldNames.map((field: IWidgetFieldNameConfig) => field.name).join(', ');
  }

  getGroupingSummary(): string {
    if (!this.enableGroupBy1) return 'None';

    const groupBy1 = this.widgetForm.controls.dataInputConfig.controls.groupBy1.value;
    if (!groupBy1) return 'None';

    const groupBy1Label = groupBy1.projectionName || groupBy1.name;

    if (!this.enableGroupBy2) return groupBy1Label;

    const groupBy2 = this.widgetForm.controls.dataInputConfig.controls.groupBy2.value;
    if (!groupBy2) return groupBy1Label;

    const groupBy2Label = groupBy2.projectionName || groupBy2.name;
    return `Group By 1: ${groupBy1Label}, Group By 2: ${groupBy2Label}`;
  }

  getWidgetSpecificConfigSummary(): string {
    const widgetType = this.widgetForm.controls.widgetType.value;

    if (widgetType === Enum_WidgetType.KPI1D || widgetType === Enum_WidgetType.KPI2D) {
      const countColumn = this.widgetForm.controls.widgetSpecificConfig.controls.kpiConf.controls.countValueColumnName.value;
      const displayColumn = this.widgetForm.controls.widgetSpecificConfig.controls.kpiConf.controls.displayValueColumnName.value;
      const showChart = this.widgetForm.controls.widgetSpecificConfig.controls.kpiConf.controls.showChart.value;
      return `Count Column: ${countColumn}, Display Column: ${displayColumn}, Show Chart: ${showChart ? 'Yes' : 'No'}`;
    } else if (widgetType === Enum_WidgetType.Donut1D || widgetType === Enum_WidgetType.Donut2D) {
      const resultLabel = this.widgetForm.controls.widgetSpecificConfig.controls.donutConf.controls.centerLabel.value;
      const showSeriesLabel = this.widgetForm.controls.widgetSpecificConfig.controls.donutConf.controls.showSeriesLabelValue.value;
      return `Result Label: ${resultLabel}, Show Series Label: ${showSeriesLabel ? 'Yes' : 'No'}`;
    } else if (widgetType === Enum_WidgetType.Table) {
      const pagination = this.widgetForm.controls.widgetSpecificConfig.controls.tableConf.controls.pagination.value;
      const pageLimit = this.widgetForm.controls.widgetSpecificConfig.controls.tableConf.controls.pageLimit.value;
      return `Pagination: ${pagination ? 'Enabled' : 'Disabled'}, Page Limit: ${pageLimit}`;
    }

    return 'No specific configuration required';
  }

  getValidationWarnings(): string[] {
    const warnings: string[] = [];
    const widgetType = this.widgetForm?.controls.widgetType.value;

    if (!widgetType) {
      warnings.push('Please select a widget type');
      return warnings;
    }

    const dimension = this.determineDimension();
    const fieldNames = this.selectedFieldNames;

    // Basic step 3 validation
    const dataInputConfigurationValidation = this.validateStep3();
    warnings.push(...dataInputConfigurationValidation);

    if (warnings.length > 0) {
      return warnings;
    }

    try {
      const dataConfig = this.createDataConfig();
      const dataInputConfig = this.createDataInputConfig(dimension, fieldNames, dataConfig);

      // Widget configuration validation
      const widgetConfigurationValidation = WidgetFactory.validateWidgetConfiguration(
        widgetType,
        dataInputConfig,
        this.widgetForm.controls.showablePropertiesSelection.value
      );
      warnings.push(...widgetConfigurationValidation.errors);

      // Widget compatibility validation
      const widgetCompatibilityValidation = validateWidgetCompatibility(widgetType, dataInputConfig);
      warnings.push(...widgetCompatibilityValidation.errors);
    } catch (error) {
      warnings.push('Configuration validation failed: ' + (error as Error).message);
    }

    return warnings;
  }

  // Add reactive validation to form controls
  private setupFormValidation(): void {
    // Add required validator to critical fields
    this.widgetForm?.controls.configurationApproach.setValidators([Validators.required]);
    this.widgetForm?.controls.displayConfig.controls.heading.setValidators([
      Validators.required,
      Validators.maxLength(100),
      Validators.pattern(/^(?!\s*$).+/) // Not just whitespace
    ]);

    // Conditional validators
    this.widgetForm?.controls.configurationApproach.valueChanges.subscribe(value => {
      if (value === 'widgetFirst') {
        this.widgetForm.controls.widgetType.setValidators([Validators.required]);
      } else {
        this.widgetForm.controls.widgetType.clearValidators();
      }
      this.widgetForm.controls.widgetType.updateValueAndValidity();
    });

    // Entity selection validation
    this.widgetForm?.controls.entityConfigType.valueChanges.subscribe(value => {
      if (value === 'single') {
        this.widgetForm.controls.dataInputConfig.controls.entitySelect.setValidators([Validators.required]);
        this.widgetForm.controls.dataInputConfig.controls.entities.clearValidators();
      } else {
        this.widgetForm.controls.dataInputConfig.controls.entitySelect.clearValidators();
        this.widgetForm.controls.dataInputConfig.controls.entities.setValidators([Validators.required]);
      }
      this.widgetForm.controls.dataInputConfig.controls.entitySelect.updateValueAndValidity();
      this.widgetForm.controls.dataInputConfig.controls.entities.updateValueAndValidity();
    });

    // Refresh interval validation
    this.widgetForm?.controls.allowRefresh.valueChanges.subscribe(value => {
      if (value) {
        this.widgetForm.controls.refreshInterval.setValidators([
          Validators.required,
          Validators.min(30),
          Validators.max(3600)
        ]);
      } else {
        this.widgetForm.controls.refreshInterval.clearValidators();
      }
      this.widgetForm.controls.refreshInterval.updateValueAndValidity();
    });

    // Widget-specific config validation
    this.widgetForm?.controls.enableWidgetSpecificConfig.valueChanges.subscribe(value => {
      this.updateWidgetSpecificValidation();
    });

    this.widgetForm?.controls.widgetType.valueChanges.subscribe(value => {
      this.updateWidgetSpecificValidation();
    });
  }

  private updateWidgetSpecificValidation(): void {
    const widgetType = this.widgetForm.controls.widgetType.value;
    const isEnabled = this.widgetForm.controls.enableWidgetSpecificConfig.value;

    if (isEnabled && this.requiresWidgetSpecificConfig()) {
      if (widgetType === Enum_WidgetType.KPI1D || widgetType === Enum_WidgetType.KPI2D) {
        this.widgetForm.controls.widgetSpecificConfig.controls.kpiConf.controls.countValueColumnName
          .setValidators([Validators.required]);
        this.widgetForm.controls.widgetSpecificConfig.controls.kpiConf.controls.displayValueColumnName
          .setValidators([Validators.required]);
      } else if (widgetType === Enum_WidgetType.Donut1D || widgetType === Enum_WidgetType.Donut2D) {
        this.widgetForm.controls.widgetSpecificConfig.controls.donutConf.controls.centerLabel
          .setValidators([Validators.required]);
      } else if (widgetType === Enum_WidgetType.Table) {
        this.widgetForm.controls.widgetSpecificConfig.controls.tableConf.controls.pageLimit
          .setValidators([Validators.min(1), Validators.max(100)]);
      }
    } else {
      // Clear validators when not enabled
      this.widgetForm.controls.widgetSpecificConfig.controls.kpiConf.controls.countValueColumnName
        .clearValidators();
      this.widgetForm.controls.widgetSpecificConfig.controls.kpiConf.controls.displayValueColumnName
        .clearValidators();
      this.widgetForm.controls.widgetSpecificConfig.controls.donutConf.controls.centerLabel
        .clearValidators();
      this.widgetForm.controls.widgetSpecificConfig.controls.tableConf.controls.pageLimit
        .clearValidators();
    }

    // Update validity
    this.widgetForm.controls.widgetSpecificConfig.updateValueAndValidity();
  }

  showValidationWarnings(): void {
    const warnings = this.getValidationWarnings();
    if (warnings.length > 0) {
      const warningMessage = 'Please note the following:\n\n' + warnings.join('\n');
      console.warn('Validation warnings:', warnings);
    }
  }

  // Demo and Utility Methods
  preFillForm(): void {
    this.widgetForm.patchValue({
      configurationApproach: 'propertiesFirst',
      entityConfigType: 'single',
      displayConfig: {
        heading: 'Sample Widget Dashboard',
        subHeading: 'Traffic Analytics',
        color: '#2196F3'
      },
      dataInputConfig: {
        entityTypeSelect: Enum_Schema.Events,
        entitySelect: "Highway_ATCC",
        method: Enum_Method.Sum,
        isDistinct: false
      },
      allowRefresh: false,
      refreshInterval: 300,
    });

    this.selectedEntities = this.EVENT_ENTITIES;
    this.onEntityChange();

    if (this.entityProperties?.length > 0) {
      const fieldName: IWidgetFieldNameConfig = {
        name: this.entityProperties[0].name,
        columnName: this.entityProperties[0].columnName,
        applyAggregation: true,
        type: this.entityProperties[0].type,
        rule: null,
      };
      this.widgetForm.patchValue({
        dataInputConfig: {
          fieldNames: [fieldName]
        }
      });

      this.widgetForm.patchValue({
        showablePropertiesSelection: [fieldName.name]
      });
    }



    this.updateAllShowablePropertiesName();

    this.addShowablePropertiesToForm(this.allShowablePropertiesName)

    if (this.isAdvancedMode && this.entityProperties?.length > 1) {
      this.enableGroupBy1 = true;
      this.groupBy1SelectionType = 'field';
      this.groupBy1Option = this.entityProperties[1];
      this.groupBy1Model = this.createGroupByModel(this.entityProperties[1]);
      this.widgetForm.patchValue({
        dataInputConfig: {
          groupBy1: this.groupBy1Model
        }
      });
    }

    this.updateRecommendedWidgets();
    if (this.recommendedWidgets?.length > 0) {
      this.widgetForm.patchValue({
        widgetType: this.recommendedWidgets[0].value
      });
    }

    this.setDefaultWidgetSpecificConfig();

    // Update all step completions
    [1, 2, 3, 4, 5].forEach(step => this.updateStepCompletion(step));

    console.log('Form pre-filled with dummy values');
  }

  onReset(): void {
    this.attemptedSubmit = false;
    this.widgetForm.reset();
    this.clearDataConfigArray();

    // Reset advanced configurations
    this.resetAdvancedConfigurations();

    // Reset default values
    this.widgetForm.patchValue({
      configurationApproach: 'widgetFirst',
      entityConfigType: 'single',
      dataInputConfig: {
        method: Enum_Method.Count,
        isDistinct: false,
        entityTypeSelect: Enum_Schema.Events,
        fieldsAggregationType: Enum_Method_Aggregation.None
      },
      displayConfig: {
        color: WIDGET_FORM_CONSTANTS.DEFAULT_COLORS[0]
      },
      allowRefresh: false,
      refreshInterval: 300,
      enableWidgetSpecificConfig: false,
      widgetTileConf: WIDGET_FORM_CONSTANTS.DEFAULT_DIMENSIONS
    });

    // Reset accordion state
    this.currentStep = 1;
    this.stepsCompleted = { 1: false, 2: false, 3: false, 4: false, 5: false };
    this.setDefaultWidgetSpecificConfig();

    console.log(SUCCESS_MESSAGES.FORM_RESET);
  }

  // Helper Methods
  capitalizeFirstWord(str: string): string {
    return WidgetFormUtils.capitalizeFirst(str);
  }

  getCurrentDayStart(): number {
    return WidgetFormUtils.getCurrentDayStart();
  }

  generateUUID(): string {
    return WidgetFormUtils.generateUUID();
  }

  private initializeBasicConfig(widget: Widget): void {
    // Determine configuration approach based on widget structure
    const configApproach = this.determineConfigurationApproach(widget);

    this.widgetForm.patchValue({
      configurationApproach: configApproach,
      widgetType: widget.widgetType,
      entityConfigType: this.determineEntityConfigType(widget)
    });
  }

  private determineConfigurationApproach(widget: Widget): 'widgetFirst' | 'propertiesFirst' {
    // Logic to determine if this was created widget-first or properties-first
    return 'widgetFirst'; // Default, adjust based on your needs
  }

  private determineEntityConfigType(widget: Widget): 'single' | 'multiple' {
    const dataConfig = widget.dataInputConfig?.dataConfig;
    return (dataConfig && dataConfig.length > 1) ? 'multiple' : 'single';
  }

  private initializeDisplayConfig(widget: Widget): void {
    this.widgetForm.patchValue({
      displayConfig: {
        heading: widget.displayConfig?.heading || '',
        subHeading: widget.displayConfig?.subHeading || '',
        color: widget.displayConfig?.color || WIDGET_FORM_CONSTANTS.DEFAULT_COLORS[0]
      }
    });
  }

  private initializeDataInputConfig(widget: Widget) {
    const dataInputConfig = widget.dataInputConfig;

    if (!dataInputConfig) return;

    // Set basic data input configuration
    this.widgetForm.patchValue({
      dataInputConfig: {
        method: dataInputConfig.method || Enum_Method.Count,
        isDistinct: dataInputConfig.isDistinct || false,
        fieldsAggregationType: dataInputConfig.fieldsAggregationType || Enum_Method_Aggregation.None,
      }
    });

    this.initializeClubbingTimeConfigurations(dataInputConfig);
    // Initialize entity configuration
    this.initializeEntityConfiguration(dataInputConfig);

    // Initialize field names
    this.initializeFieldNames(dataInputConfig);

    // Initialize group by configurations
    this.initializeGroupByConfigurations(dataInputConfig);
  }

  private initializeShowableProperties(widget: Widget) {

    this.widgetForm.patchValue({
      showablePropertiesSelection: this.allShowablePropertiesName
        .filter(x => widget.showableProperties.some(y => y.name.toLowerCase() === x.name.toLowerCase()))
        .map(x => x.name),
    });


    const showablePropertiesArray = this.widgetForm.controls.showableProperties;
    showablePropertiesArray.clear();
    widget.showableProperties.forEach(prop =>
      showablePropertiesArray.push(this.createShowablePropertyFormGroup(prop))
    );
  }

  private async initializeEntityConfiguration(dataInputConfig: any): Promise<void> {
    const dataConfig = dataInputConfig.dataConfig;

    if (!dataConfig || dataConfig.length === 0) return;

    if (dataConfig.length === 1) {
      // Single entity configuration
      const entityConfig = dataConfig[0];

      this.widgetForm.patchValue({
        dataInputConfig: {
          entityTypeSelect: entityConfig.schemaName,
          entitySelect: entityConfig.entity
        }
      });

      // Update selected entities dropdown
      this.selectedEntities = entityConfig.schemaName === Enum_Schema.Events
        ? this.EVENT_ENTITIES
        : PUBLIC_ENTITIES;

      // Trigger entity change to load properties
      this.onEntityChange();

    } else {
      // Multiple entities configuration
      const entityValues = dataConfig.map((config: any) => config.entity);

      this.widgetForm.patchValue({
        dataInputConfig: {
          entities: entityValues,
          entityTypeSelect: dataConfig[0].schemaName // Assume all same schema
        }
      });

      // Update selected entities dropdown
      this.selectedEntities = dataConfig[0].schemaName === Enum_Schema.Events
        ? this.EVENT_ENTITIES
        : PUBLIC_ENTITIES;

      // Setup entity configs
      this.setupEntityConfigs(entityValues);
    }
  }

  private initializeFieldNames(dataInputConfig: any): void {
    const fieldNames: IWidgetFieldNameConfig[] = dataInputConfig.fieldNames || [];
    fieldNames.forEach((field: any) => {
      field.rule = null; // Initialize with no rule
    });

    this.widgetForm.patchValue({
      dataInputConfig: {
        fieldNames: fieldNames
      }
    });

    this.updateAllShowablePropertiesName();
  }

  private initializeGroupByConfigurations(dataInputConfig: any): void {
    // Initialize Group By 1
    if (dataInputConfig.groupBy1) {
      this.enableGroupBy1 = true;
      const groupBy1 = dataInputConfig.groupBy1;

      if (groupBy1.isTime) {
        this.groupBy1SelectionType = 'time';
        this.selectedTimeGrouping1 = groupBy1.name;
      } else {
        this.groupBy1SelectionType = 'field';
        // Find the property in available properties
        const allProps = this.getAllAvailableProperties();
        this.groupBy1Option = allProps.find(p => p.name.toLowerCase() === groupBy1.name.toLowerCase()) || null;
      }

      this.groupBy1Model = groupBy1;
      this.widgetForm.patchValue({
        dataInputConfig: { groupBy1: groupBy1 }
      });
    }

    // Initialize Group By 2
    if (dataInputConfig.groupBy2) {
      this.enableGroupBy2 = true;
      const groupBy2 = dataInputConfig.groupBy2;

      if (groupBy2.isTime) {
        this.groupBy2SelectionType = 'time';
        this.selectedTimeGrouping2 = groupBy2.name;
      } else {
        this.groupBy2SelectionType = 'field';
        // Find the property in available properties
        const allProps = this.getAllAvailableProperties();
        this.groupBy2Option = allProps.find(p => p.name.toLowerCase() === groupBy2.name.toLowerCase()) || null;
      }

      this.groupBy2Model = groupBy2;
      this.widgetForm.patchValue({
        dataInputConfig: { groupBy2: groupBy2 }
      });
    }

  }

  private initializeClubbingTimeConfigurations(dataInputConfig: ITwoDimensionDataInputConfig | IThreeDimensionDataInputConfig): void {
    // Initialize Group By 1
    if (dataInputConfig.clubbingTime) {
      this.widgetForm.patchValue({
        dataInputConfig: { clubbingTime: dataInputConfig.clubbingTime }
      });
    }
  }

  private initializeWidgetSpecificConfig(widget: Widget): void {
    const widgetType = widget.widgetType;

    // Determine if widget-specific config should be enabled
    const shouldEnableConfig = this.determineWidgetSpecificConfigState(widget);

    // Set the checkbox state
    this.widgetForm.patchValue({
      enableWidgetSpecificConfig: shouldEnableConfig
    });

    if (shouldEnableConfig) {
      // Load the actual configuration
      this.loadWidgetSpecificConfiguration(widget, widgetType);
    } else {
      // Set default values but keep checkbox disabled
      this.setDefaultWidgetSpecificConfig();
    }
  }

  private determineWidgetSpecificConfigState(widget: Widget): boolean {
    const widgetType = widget.widgetType;

    // If widget doesn't require specific config, return false
    if (!this.widgetTypeRequiresSpecificConfig(widgetType)) {
      return false;
    }

    // Check if widget has meaningful configuration data
    switch (widgetType) {
      case Enum_WidgetType.KPI1D:
      case Enum_WidgetType.KPI2D:
        return this.hasValidKPIConfig((widget as Kpi1DWidget | Kpi2DWidget).kpiConf);

      case Enum_WidgetType.Donut1D:
      case Enum_WidgetType.Donut2D:
        return this.hasValidDonutConfig((widget as DonutChart1DWidget | DonutChart2DWidget).donutConf);

      case Enum_WidgetType.Table:
        return this.hasValidTableConfig((widget as TableWidget).tableConf);

      default:
        return false;
    }
  }

  widgetTypeRequiresSpecificConfig(widgetType: Enum_WidgetType): boolean {
    if (widgetType == Enum_WidgetType.KPI1D || widgetType == Enum_WidgetType.KPI2D || widgetType == Enum_WidgetType.Donut1D ||
      widgetType == Enum_WidgetType.Donut2D || widgetType == Enum_WidgetType.Table) {
      return true;
    }
    else {
      return false;
    }
  }

  private hasValidKPIConfig(kpiConf: KPIConf): boolean {
    if (!kpiConf) return false;

    return Object.values(kpiConf).some(value => value !== null && value !== undefined && value !== '');
  }

  private hasValidDonutConfig(donutConf: DonutConf): boolean {
    if (!donutConf) return false;

    return Object.values(donutConf).some(value => value !== null && value !== undefined && value !== '');
  }

  private hasValidTableConfig(tableConf: TableConf): boolean {
    if (!tableConf) return false;

    return Object.values(tableConf).some(value => value !== null && value !== undefined && value !== '');
  }

  private loadWidgetSpecificConfiguration(widget: Widget, widgetType: Enum_WidgetType): void {
    switch (widgetType) {
      case Enum_WidgetType.KPI1D:
      case Enum_WidgetType.KPI2D:
        this.initializeKPIConfig(widget);
        break;
      case Enum_WidgetType.Donut1D:
      case Enum_WidgetType.Donut2D:
        this.initializeDonutConfig(widget);
        break;
      case Enum_WidgetType.Table:
        this.initializeTableConfig(widget);
        break;
    }
  }

  private initializeKPIConfig(widget: Kpi1DWidget | Kpi2DWidget): void {
    const kpiConf = widget.kpiConf;

    if (kpiConf) {
      this.widgetForm.patchValue({
        widgetSpecificConfig: {
          kpiConf: {
            countValueColumnName: kpiConf.countValueColumnName,
            displayValueColumnName: kpiConf.displayValueColumnName,
            imageColumnName: kpiConf.imageColumnName || null,
            showChart: kpiConf.showChart || false,
            hideLabel: kpiConf.hideLabel || false,
            showAggregation: kpiConf.showAggregation || false,
            dataAggregationMethod: kpiConf.dataAggregationMethod || Enum_Method_Aggregation.None
          }
        }
      });
    }
  }

  private initializeDonutConfig(widget: DonutChart1DWidget | DonutChart2DWidget): void {
    const donutConf = widget.donutConf;

    if (donutConf) {
      this.widgetForm.patchValue({
        widgetSpecificConfig: {
          donutConf: {
            centerLabel: donutConf.centerLabel || 'Result',
            centerLabelAggregation: donutConf.centerLabelAggregation || Enum_Method_Aggregation.None,
            showSeriesLabelValue: donutConf.showSeriesLabelValue !== false
          }
        }
      });
    }
  }

  private initializeTableConfig(widget: TableWidget): void {
    const tableConf = widget.tableConf;

    if (tableConf) {
      this.widgetForm.patchValue({
        widgetSpecificConfig: {
          tableConf: {
            pagination: tableConf.pagination !== false,
            pageLimit: tableConf.pageLimit || WIDGET_FORM_CONSTANTS.DEFAULT_PAGE_LIMIT,
            pageNumber: tableConf.pageNumber || 1
          }
        }
      });
    }
  }

  private initializeFilterConfig(widget: Widget): void {
    const filterConfig = widget.filterConfig;

    if (filterConfig) {
      this.widgetForm.patchValue({
        filterConfig: {
          customFilters: filterConfig.customFilters || {},
          propertyFilters: filterConfig.propertyFilters || null
        }
      });

      // Set property filters state
      if (filterConfig.propertyFilters) {
        this.enablePropertyFilters = true;
        this.ruleData = filterConfig.propertyFilters;
      }
    }
  }

  hasFieldError(fieldPath: string): boolean {
    const field = this.getFormControl(fieldPath);
    if (!field) return false;

    // Show error if field is invalid AND (touched OR form submission was attempted)
    return field.invalid && (field.touched || this.attemptedSubmit);
  }

  getFieldError(fieldPath: string): string {
    const field = this.getFormControl(fieldPath);
    if (!field || !this.hasFieldError(fieldPath)) return '';

    // Return the first error message found
    const errors = field.errors;
    if (!errors) return '';

    // Handle common Angular validators
    if (errors['required']) {
      return this.getFieldDisplayName(fieldPath) + ' is required';
    }
    if (errors['minlength']) {
      return `${this.getFieldDisplayName(fieldPath)} must be at least ${errors['minlength'].requiredLength} characters`;
    }
    if (errors['maxlength']) {
      return `${this.getFieldDisplayName(fieldPath)} must be no more than ${errors['maxlength'].requiredLength} characters`;
    }
    if (errors['min']) {
      return `${this.getFieldDisplayName(fieldPath)} must be at least ${errors['min'].min}`;
    }
    if (errors['max']) {
      return `${this.getFieldDisplayName(fieldPath)} must be no more than ${errors['max'].max}`;
    }
    if (errors['email']) {
      return 'Please enter a valid email address';
    }
    if (errors['pattern']) {
      return `${this.getFieldDisplayName(fieldPath)} format is invalid`;
    }

    // Handle custom validation errors
    if (errors['customError']) {
      return errors['customError'];
    }

    // Default error message
    return `${this.getFieldDisplayName(fieldPath)} is invalid`;
  }

  markFieldAsTouched(fieldPath: string): void {
    const field = this.getFormControl(fieldPath);
    if (field) {
      field.markAsTouched();
      field.updateValueAndValidity();
    }
  }

  // Step-level error checking methods
  getStepErrors(step: number): string[] {
    const errors: string[] = [];

    switch (step) {
      case 1:
        if (!this.widgetForm.controls.configurationApproach.value) {
          errors.push('Please select a configuration approach');
        }

        if (this.widgetForm.controls.configurationApproach.value === 'widgetFirst') {
          if (!this.widgetForm.controls.widgetType.value) {
            errors.push('Please select a widget type');
          }
        } else if (this.widgetForm.controls.configurationApproach.value === 'propertiesFirst') {
          if (!this.widgetForm.controls.entityConfigType.value) {
            errors.push('Please select an entity configuration type');
          }
        }
        break;

      case 2:
        if (!this.widgetForm.controls.displayConfig.controls.heading.value?.trim()) {
          errors.push('Widget heading is required');
        }
        if (this.widgetForm.controls.displayConfig.controls.heading.value?.length > 100) {
          errors.push('Widget heading must be 100 characters or less');
        }
        break;
      case 3:
        errors.push(...this.validateStep3());

        // Add Group By validation
        if (this.enableGroupBy1) {
          if (!this.groupBy1SelectionType) {
            errors.push('Please select a Group By 1 type');
          } else if (this.groupBy1SelectionType === 'field' && !this.groupBy1Option) {
            errors.push('Please select a field for Group By 1');
          } else if (this.groupBy1SelectionType === 'time' && !this.selectedTimeGrouping1) {
            errors.push('Please select a time grouping for Group By 1');
          }
        }

        if (this.enableGroupBy2) {
          if (!this.groupBy2SelectionType) {
            errors.push('Please select a Group By 2 type');
          } else if (this.groupBy2SelectionType === 'field' && !this.groupBy2Option) {
            errors.push('Please select a field for Group By 2');
          } else if (this.groupBy2SelectionType === 'time' && !this.selectedTimeGrouping2) {
            errors.push('Please select a time grouping for Group By 2');
          }
        }

        break;

      case 4:
        if (this.widgetForm.controls.configurationApproach.value === 'propertiesFirst') {
          if (!this.widgetForm.controls.widgetType.value) {
            errors.push('Please select a widget type');
          }
        }
        break;

      case 5:
        if (this.requiresWidgetSpecificConfig() && this.isSpecificConfigEnabled) {
          errors.push(...this.validateWidgetSpecificConfigErrors());
        }

        if (this.allowRefresh) {
          const refreshInterval = this.widgetForm.controls.refreshInterval.value;
          if (!refreshInterval || refreshInterval < 60 || refreshInterval > 3600) {
            errors.push('Refresh interval must be between 30 and 3600 seconds');
          }
        }
        break;
    }

    return errors;
  }

  // Global form error checking
  getGlobalErrors(): string[] {
    const errors: string[] = [];

    // Check if form was submitted but has errors
    if (this.attemptedSubmit && this.widgetForm.invalid) {
      errors.push('Please complete all required fields and fix validation errors');
    }

    // Check for critical configuration issues
    const validationWarnings = this.getValidationWarnings();
    if (validationWarnings.length > 0) {
      errors.push(...validationWarnings);
    }

    return errors;
  }

  // Enhanced validation for widget-specific config
  private validateWidgetSpecificConfigErrors(): string[] {
    const errors: string[] = [];
    const widgetType = this.widgetForm.controls.widgetType.value;

    // if (widgetType === Enum_WidgetType.KPI1D || widgetType === Enum_WidgetType.KPI2D) {
    //   const kpiConfig = this.widgetForm.controls.widgetSpecificConfig.controls.kpiConf;

    //   if (!kpiConfig.controls.CountValueColumnName.value) {
    //     errors.push('Count Value Column is required for KPI widgets');
    //   }
    //   if (!kpiConfig.controls.DisplayValueColumnName.value) {
    //     errors.push('Display Value Column is required for KPI widgets');
    //   }
    // }
    if (widgetType === Enum_WidgetType.Donut1D || widgetType === Enum_WidgetType.Donut2D) {
      const donutConfig = this.widgetForm.controls.widgetSpecificConfig.controls.donutConf;

      if (!donutConfig.controls.centerLabel.value?.trim()) {
        errors.push('Center Label is required for Donut charts');
      }
      if (donutConfig.controls.centerLabelAggregation.value != Enum_Method_Aggregation.None) {
        errors.push('Center label series aggregation is required for Donut charts');
      }
    }
    // else if (widgetType === Enum_WidgetType.Table) {
    //   const tableConfig = this.widgetForm.controls.widgetSpecificConfig.controls.tableConf;

    //   if (tableConfig.controls.pagination.value) {
    //     const pageLimit = tableConfig.controls.pageLimit.value;
    //     if (!pageLimit || pageLimit < 1 || pageLimit > 100) {
    //       errors.push('Page limit must be between 1 and 100 when pagination is enabled');
    //     }
    //   }
    // }

    return errors;
  }

  // Helper method to get FormControl by path
  private getFormControl(fieldPath: string): AbstractControl | null {
    const pathArray = fieldPath.split('.');
    let control: AbstractControl = this.widgetForm;

    for (const path of pathArray) {
      if (control instanceof FormGroup) {
        control = control.controls[path];
      } else if (control instanceof FormArray) {
        const index = parseInt(path, 10);
        if (!isNaN(index)) {
          control = control.at(index);
        } else {
          return null;
        }
      } else {
        return null;
      }

      if (!control) {
        return null;
      }
    }

    return control;
  }

  // Helper method to get user-friendly field names
  private getFieldDisplayName(fieldPath: string): string {
    const fieldNames: { [key: string]: string } = {
      'configurationApproach': 'Configuration Approach',
      'entityConfigType': 'Entity Configuration Type',
      'widgetType': 'Widget Type',
      'displayConfig.heading': 'Widget Heading',
      'displayConfig.subHeading': 'Sub Heading',
      'displayConfig.color': 'Widget Color',
      'dataInputConfig.entitySelect': 'Entity',
      'dataInputConfig.entities': 'Entities',
      'dataInputConfig.fieldNames': 'Properties',
      'dataInputConfig.method': 'Aggregation Method',
      'refreshInterval': 'Refresh Interval',
      'widgetSpecificConfig.kpiConf.countValueColumnName': 'KPI Count Column',
      'widgetSpecificConfig.kpiConf.displayValueColumnName': 'KPI Label Column',
      'widgetSpecificConfig.kpiConf.imageColumnName': 'KPI Image Column',
      'widgetSpecificConfig.donutConf.resultLabel': 'Result Label',
      'widgetSpecificConfig.tableConf.pageLimit': 'Page Limit'
    };

    return fieldNames[fieldPath] || this.formatFieldPath(fieldPath);
  }

  // Format field path to readable name
  private formatFieldPath(fieldPath: string): string {
    return fieldPath
      .split('.')
      .pop()
      ?.replace(/([A-Z])/g, ' $1')
      ?.replace(/^./, str => str.toUpperCase()) || 'Field';
  }


  private initializeWidgetTileConfig(widget: Widget): void {
    const widgetTileConf = widget.widgetTileConf;

    if (widgetTileConf) {
      this.widgetForm.patchValue({
        widgetTileConf: {
          ...WIDGET_FORM_CONSTANTS.DEFAULT_DIMENSIONS,
          ...widgetTileConf
        }
      });
    }
  }

  private updateUIStateAfterLoad(): void {
    // Set advanced mode if complex configurations are present
    const hasAdvancedConfig = this.enableGroupBy1 || this.enableGroupBy2 || this.enablePropertyFilters;
    this.isAdvancedMode = hasAdvancedConfig;

    // Update recommendations
    this.updateRecommendedWidgets();

    // Set widget type as initially selected
    this.isWidgetTypeSelectedInitially = true;

    // Update rule builder if needed
    if (this.enablePropertyFilters) {
      const allProps = this.getAllAvailableProperties();
      this.createRuleGroupQueryBuilder(allProps);
    }
  }

  // Helper method to check if we're in edit mode
  isEditMode(): boolean {
    return this.modalData.event?.data?.operation === Enum_WidgetFormOperation.edit && !!this.finalWidget;
  }

  // Update the form title based on mode
  getFormTitle(): string {
    if (this.formMode === Enum_WidgetFormMode.predefined) {
      return this.isEditMode() ? 'Customize Pre-defined Widget' : 'Configure Pre-defined Widget';
    }
    return this.isEditMode() ? 'Edit Widget' : 'Create New Widget';
  }

  isPredefinedMode(): boolean {
    return this.formMode === Enum_WidgetFormMode.predefined;
  }

  // Update submit button text based on mode
  getSubmitButtonText(): string {
    return this.isEditMode() ? 'Update Widget' : 'Create Widget';
  }
}
