import { ComponentFixture, TestBed } from '@angular/core/testing';

import { I2vHeatmapChartComponent } from './i2v-heatmap-chart.component';

describe('I2vHeatmapChartComponent', () => {
  let component: I2vHeatmapChartComponent;
  let fixture: ComponentFixture<I2vHeatmapChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [I2vHeatmapChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(I2vHeatmapChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
