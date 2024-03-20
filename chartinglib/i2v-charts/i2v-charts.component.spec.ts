import { ComponentFixture, TestBed } from '@angular/core/testing';

import I2vChartsComponent from './i2v-charts.component';

describe('I2vChartsComponent', () => {
  let component: I2vChartsComponent;
  let fixture: ComponentFixture<I2vChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [I2vChartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(I2vChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
