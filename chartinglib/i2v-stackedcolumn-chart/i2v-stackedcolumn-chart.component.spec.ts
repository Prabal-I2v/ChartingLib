import { ComponentFixture, TestBed } from "@angular/core/testing";

import { I2vStackedcolumnChartComponent } from "./i2v-stackedcolumn-chart.component";

describe("I2vStackedcolumnChartComponent", () => {
  let component: I2vStackedcolumnChartComponent;
  let fixture: ComponentFixture<I2vStackedcolumnChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [I2vStackedcolumnChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(I2vStackedcolumnChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
