import { ComponentFixture, TestBed } from '@angular/core/testing';

import { I2vDonutChartComponent } from './i2v-donut-chart.component';

describe('I2vDonutChartComponent', () => {
  let component: I2vDonutChartComponent;
  let fixture: ComponentFixture<I2vDonutChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [I2vDonutChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(I2vDonutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
