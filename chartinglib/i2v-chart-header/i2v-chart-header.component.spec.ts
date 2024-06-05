import { ComponentFixture, TestBed } from "@angular/core/testing";

import { I2vChartHeaderComponent } from "./i2v-chart-header.component";

describe("I2vChartHeaderComponent", () => {
  let component: I2vChartHeaderComponent;
  let fixture: ComponentFixture<I2vChartHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [I2vChartHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(I2vChartHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
