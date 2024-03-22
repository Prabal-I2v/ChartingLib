import { ComponentFixture, TestBed } from '@angular/core/testing';

import { I2vAreaChartComponent } from './i2v-area-chart.component';

describe('I2vAreaChartComponent', () => {
  let component: I2vAreaChartComponent;
  let fixture: ComponentFixture<I2vAreaChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [I2vAreaChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(I2vAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
