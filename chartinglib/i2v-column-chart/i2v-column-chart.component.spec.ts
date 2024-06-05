import { ComponentFixture, TestBed } from "@angular/core/testing";

import { I2vColumnChartComponent } from "./i2v-column-chart.component";

describe("I2vColumnChartComponent", () => {
  let component: I2vColumnChartComponent;
  let fixture: ComponentFixture<I2vColumnChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [I2vColumnChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(I2vColumnChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
