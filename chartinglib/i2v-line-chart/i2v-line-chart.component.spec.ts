import { ComponentFixture, TestBed } from '@angular/core/testing';

import { I2vLineChartComponent } from './i2v-line-chart.component';

describe('I2vLineChartComponent', () => {
  let component: I2vLineChartComponent;
  let fixture: ComponentFixture<I2vLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [I2vLineChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(I2vLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
