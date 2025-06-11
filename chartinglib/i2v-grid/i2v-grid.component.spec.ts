import { ComponentFixture, TestBed } from '@angular/core/testing';

import { I2vGridComponent } from './i2v-grid.component';

describe('I2vGridComponent', () => {
  let component: I2vGridComponent;
  let fixture: ComponentFixture<I2vGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [I2vGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(I2vGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
