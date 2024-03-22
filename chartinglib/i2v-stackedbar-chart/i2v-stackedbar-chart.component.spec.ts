import { ComponentFixture, TestBed } from '@angular/core/testing';

import { I2vStackedbarChartComponent } from './i2v-stackedbar-chart.component';

describe('I2vStackedbarChartComponent', () => {
  let component: I2vStackedbarChartComponent;
  let fixture: ComponentFixture<I2vStackedbarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [I2vStackedbarChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(I2vStackedbarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
