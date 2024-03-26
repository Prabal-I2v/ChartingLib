import { ComponentFixture, TestBed } from '@angular/core/testing';

import { I2vGaugeChartComponent } from './i2v-gauge-chart.component';

describe('I2vGaugeChartComponent', () => {
  let component: I2vGaugeChartComponent;
  let fixture: ComponentFixture<I2vGaugeChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [I2vGaugeChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(I2vGaugeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
