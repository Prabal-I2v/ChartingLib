import { ComponentFixture, TestBed } from '@angular/core/testing';

import { I2vMultiColumnChartComponent } from './i2v-multi-column-chart.component';

describe('I2vMultiColumnChartComponent', () => {
  let component: I2vMultiColumnChartComponent;
  let fixture: ComponentFixture<I2vMultiColumnChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [I2vMultiColumnChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(I2vMultiColumnChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
