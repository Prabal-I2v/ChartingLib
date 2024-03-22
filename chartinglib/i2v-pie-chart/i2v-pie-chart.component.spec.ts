import { ComponentFixture, TestBed } from '@angular/core/testing';

import { I2vPieChartComponent } from './i2v-pie-chart.component';

describe('I2vPieChartComponent', () => {
  let component: I2vPieChartComponent;
  let fixture: ComponentFixture<I2vPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [I2vPieChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(I2vPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
