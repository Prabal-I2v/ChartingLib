import { ComponentFixture, TestBed } from '@angular/core/testing';

import { I2vKpiChartComponent } from './i2v-kpi-chart.component';

describe('I2vKpiChartComponent', () => {
  let component: I2vKpiChartComponent;
  let fixture: ComponentFixture<I2vKpiChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [I2vKpiChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(I2vKpiChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
