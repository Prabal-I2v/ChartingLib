import { ComponentFixture, TestBed } from "@angular/core/testing";

import { I2vBarChartComponent } from "./i2v-bar-chart.component";

describe("I2vBarChartComponent", () => {
  let component: I2vBarChartComponent;
  let fixture: ComponentFixture<I2vBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [I2vBarChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(I2vBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
