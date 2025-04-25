import { ComponentFixture, TestBed } from '@angular/core/testing';

import { I2vSankeyChartComponent } from './i2v-sankey-chart.component';

describe('I2vSankeyChartComponent', () => {
  let component: I2vSankeyChartComponent;
  let fixture: ComponentFixture<I2vSankeyChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [I2vSankeyChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(I2vSankeyChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
