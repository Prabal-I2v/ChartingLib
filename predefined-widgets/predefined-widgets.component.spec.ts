import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredefinedWidgetsComponent } from './predefined-widgets.component';

describe('PredefinedWidgetsComponent', () => {
  let component: PredefinedWidgetsComponent;
  let fixture: ComponentFixture<PredefinedWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PredefinedWidgetsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PredefinedWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
